/**
 * Server-side PostHog service using posthog-node
 * Handles all PostHog operations in API routes and server-side code
 */

import { PostHog } from "posthog-node";
import { TrackingEvents } from "@/lib/tracking";

let serverPostHog = null;

// Initialize server-side PostHog client
const initServerPostHog = () => {
  if (serverPostHog) return serverPostHog;

  // Only initialize server-side PostHog if we're on the server
  if (typeof window === "undefined") {
    try {
      serverPostHog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        // Server-side configuration
        flushAt: 1, // Send events immediately in webhooks
        flushInterval: 0, // Don't batch events
      });

      console.log("✅ [SERVER-POSTHOG] Server-side PostHog initialized");
      return serverPostHog;
    } catch (error) {
      console.error(
        "❌ [SERVER-POSTHOG] Failed to initialize server-side PostHog:",
        error
      );
      return null;
    }
  }

  return null;
};

// Get server-side PostHog instance
export const getServerPostHog = () => {
  if (!serverPostHog) {
    return initServerPostHog();
  }
  return serverPostHog;
};

// Server-side event tracking with enhanced properties
export const trackServerEvent = async (eventName, properties = {}) => {
  const serverPH = getServerPostHog();
  if (!serverPH) {
    console.warn("⚠️ [SERVER-POSTHOG] Server-side PostHog not available");
    return { success: false, reason: "no_server_posthog" };
  }

  try {
    const enhancedProperties = {
      source: "server",
      timestamp: Date.now(),
      ...properties,
    };

    await serverPH.capture({
      event: eventName,
      properties: enhancedProperties,
      distinctId: properties.distinctId || properties.email || "server-event",
    });

    console.log(`✅ [SERVER-POSTHOG] Event tracked: ${eventName}`);
    return { success: true };
  } catch (error) {
    console.error(
      `❌ [SERVER-POSTHOG] Error tracking event ${eventName}:`,
      error
    );
    return { success: false, reason: "tracking_error", error };
  }
};

// Server-side user identification and property setting
export const identifyServerUser = async (distinctId, properties = {}) => {
  const serverPH = getServerPostHog();
  if (!serverPH) {
    console.warn("⚠️ [SERVER-POSTHOG] Server-side PostHog not available");
    return { success: false, reason: "no_server_posthog" };
  }

  try {
    const enhancedProperties = {
      identification_timestamp: Date.now(),
      identification_source: "server",
      ...properties,
    };

    await serverPH.identify({
      distinctId: distinctId,
      properties: enhancedProperties,
    });

    console.log(
      `✅ [SERVER-POSTHOG] User identified: ${distinctId.substring(0, 3)}***`
    );
    return { success: true };
  } catch (error) {
    console.error(
      `❌ [SERVER-POSTHOG] Error identifying user ${distinctId}:`,
      error
    );
    return { success: false, reason: "identification_error", error };
  }
};

// Server-side alias function for linking identities
export const aliasServerUser = async (distinctId, alias) => {
  const serverPH = getServerPostHog();
  if (!serverPH) {
    console.warn("⚠️ [SERVER-POSTHOG] Server-side PostHog not available");
    return { success: false, reason: "no_server_posthog" };
  }

  try {
    await serverPH.alias({
      distinctId: distinctId,
      alias: alias,
    });

    console.log(
      `✅ [SERVER-POSTHOG] Alias created: ${distinctId.substring(
        0,
        3
      )}*** → ${alias.substring(0, 3)}***`
    );
    return { success: true };
  } catch (error) {
    console.error(
      `❌ [SERVER-POSTHOG] Error creating alias ${distinctId} → ${alias}:`,
      error
    );
    return { success: false, reason: "alias_error", error };
  }
};

// Cleanup function to flush pending events (call at end of API routes)
export const flushServerEvents = async () => {
  const serverPH = getServerPostHog();
  if (serverPH) {
    try {
      await serverPH.flush();
      console.log("✅ [SERVER-POSTHOG] Events flushed successfully");
    } catch (error) {
      console.error("❌ [SERVER-POSTHOG] Error flushing events:", error);
    }
  }
};

// Shutdown function for graceful cleanup
export const shutdownServerPostHog = async () => {
  const serverPH = getServerPostHog();
  if (serverPH) {
    try {
      await serverPH.shutdown();
      console.log(
        "✅ [SERVER-POSTHOG] Server-side PostHog shut down successfully"
      );
      serverPostHog = null;
    } catch (error) {
      console.error(
        "❌ [SERVER-POSTHOG] Error shutting down server-side PostHog:",
        error
      );
    }
  }
};
// =============================================================================
// SERVER-SIDE TRACKING FUNCTIONS (for API routes and webhooks)
// =============================================================================

// =============================================================================
// WEBHOOK-SPECIFIC TRACKING FUNCTIONS
// =============================================================================

// Track payment completion in webhook
export const trackWebhookPaymentCompleted = async (paymentData) => {
  const {
    payment_id,
    email,
    license_type,
    max_devices,
    amount,
    is_team_product,
    product_id,
    webhook_id,
    device_id,
    posthog_distinct_id,
    from_app,
  } = paymentData;

  // 🎯 PostHog Attribution: Proper alias-then-identify pattern
  if (posthog_distinct_id) {
    console.log(
      `🔗 [WEBHOOK-TRACKING] PostHog Attribution - Aliasing anonymous session to email:`,
      {
        anonymous_distinct_id: posthog_distinct_id,
        payment_email: email,
        device_id: device_id,
        from_app: from_app,
      }
    );

    // 🟡 1️⃣ FIRST: Alias the anonymous session to the email
    // This merges all anonymous events into the email-identified user
    await aliasServerUser(posthog_distinct_id, email);

    console.log(
      `✅ [WEBHOOK-TRACKING] Anonymous session aliased to email: ${posthog_distinct_id} → ${email.substring(
        0,
        3
      )}***`
    );

    // 🟢 2️⃣ SECOND: Identify with email and set user properties
    const userProperties = {
      email: email,
      user_type: "licensed",
      current_plan: license_type,
      license_type: license_type,
      max_devices: max_devices,
      is_team_product: is_team_product,
      identification_source: "webhook_payment",
      identification_timestamp: Date.now(),
      payment_amount: amount,
      payment_id: payment_id,
      from_app: from_app || false,
      ...(device_id && { device_id: device_id }),
    };

    await identifyServerUser(email, userProperties);

    console.log(
      `✅ [WEBHOOK-TRACKING] User identified with email and properties set`
    );
  } else {
    // Fallback: No session tracking, just identify with email
    console.log(
      `📧 [WEBHOOK-TRACKING] No PostHog session found - using email identification only`
    );

    const userProperties = {
      user_type: "licensed",
      current_plan: license_type,
      license_type: license_type,
      max_devices: max_devices,
      is_team_product: is_team_product,
      identification_source: "webhook_payment",
      identification_timestamp: Date.now(),
      payment_amount: amount,
      payment_id: payment_id,
      from_app: from_app || false,
      ...(device_id && { device_id: device_id }),
    };

    await identifyServerUser(email, userProperties);
  }

  // Handle additional device_id linking if needed (keep as property, not alias)
  if (device_id) {
    console.log(
      `📱 [WEBHOOK-TRACKING] Device ID found, storing as user property: ${device_id}`
    );
    // Note: We store device_id as a property, not alias it to avoid conflicts
    await identifyServerUser(email, { device_id: device_id });
  }

  // Track the payment completion event with email as distinct_id
  return await trackServerEvent(TrackingEvents.PAYMENT_COMPLETED, {
    payment_id,
    email: email,
    license_type,
    max_devices,
    amount,
    is_team_product,
    product_id,
    source: "webhook",
    webhook_id,
    posthog_distinct_id: posthog_distinct_id,
    from_app: from_app || false,
    attribution_method: posthog_distinct_id ? "session_tracking" : "email_only",
    distinctId: email, // Always use email as final distinct_id
  });
};

// Track payment failure in webhook
export const trackWebhookPaymentFailed = async (paymentData) => {
  const {
    payment_id,
    email,
    license_type,
    max_devices,
    amount,
    is_team_product,
    product_id,
    webhook_id,
    device_id,
    failure_reason,
    failure_code,
    error_message,
    posthog_distinct_id,
    from_app,
  } = paymentData;

  // 🎯 PostHog Attribution: Proper alias-then-identify pattern for failed payments
  if (posthog_distinct_id) {
    console.log(
      `🔗 [WEBHOOK-TRACKING] PostHog Attribution - Aliasing failed payment session to email:`,
      {
        anonymous_distinct_id: posthog_distinct_id,
        payment_email: email,
        device_id: device_id,
        from_app: from_app,
      }
    );

    // 🟡 1️⃣ FIRST: Alias the anonymous session to the email
    // This merges all anonymous events into the email-identified user
    await aliasServerUser(posthog_distinct_id, email);

    console.log(
      `✅ [WEBHOOK-TRACKING] Anonymous session aliased to email (failed payment): ${posthog_distinct_id} → ${email.substring(
        0,
        3
      )}***`
    );

    // 🟢 2️⃣ SECOND: Identify with email and set user properties
    const userProperties = {
      email: email,
      user_type: "payment_failed",
      payment_status: "failed",
      last_payment_failure_reason: failure_reason,
      last_payment_failure_code: failure_code,
      identification_source: "webhook_payment_failed",
      identification_timestamp: Date.now(),
      failed_payment_amount: amount,
      failed_payment_id: payment_id,
      from_app: from_app || false,
      ...(device_id && { device_id: device_id }),
    };

    await identifyServerUser(email, userProperties);

    console.log(
      `✅ [WEBHOOK-TRACKING] User identified with email and failed payment properties set`
    );
  } else {
    // Fallback: No session tracking, just identify with email
    console.log(
      `📧 [WEBHOOK-TRACKING] No PostHog session found - using email identification for failed payment only`
    );

    const userProperties = {
      user_type: "payment_failed",
      payment_status: "failed",
      last_payment_failure_reason: failure_reason,
      last_payment_failure_code: failure_code,
      identification_source: "webhook_payment_failed",
      identification_timestamp: Date.now(),
      failed_payment_amount: amount,
      failed_payment_id: payment_id,
      from_app: from_app || false,
      ...(device_id && { device_id: device_id }),
    };

    await identifyServerUser(email, userProperties);
  }

  // Handle additional device_id linking if needed (keep as property, not alias)
  if (device_id) {
    console.log(
      `📱 [WEBHOOK-TRACKING] Device ID found, storing as user property for failed payment: ${device_id}`
    );
    // Note: We store device_id as a property, not alias it to avoid conflicts
    await identifyServerUser(email, { device_id: device_id });
  }

  // Track the payment failure event with email as distinct_id
  return await trackServerEvent(TrackingEvents.PAYMENT_FAILED, {
    payment_id,
    email: email,
    license_type,
    max_devices,
    amount,
    is_team_product,
    product_id,
    failure_reason,
    failure_code,
    error_message,
    source: "webhook",
    webhook_id,
    posthog_distinct_id: posthog_distinct_id,
    from_app: from_app || false,
    attribution_method: posthog_distinct_id ? "session_tracking" : "email_only",
    distinctId: email, // Always use email as final distinct_id
  });
};

// Track subscription activation in webhook
export const trackWebhookSubscriptionActivated = async (subscriptionData) => {
  const {
    subscription_id,
    email,
    license_type,
    max_devices,
    amount,
    product_id,
    payment_frequency,
    next_billing_date,
    webhook_id,
  } = subscriptionData;

  // First identify the user
  const userProperties = {
    user_type: "licensed",
    current_plan: license_type,
    license_type: license_type,
    max_devices: max_devices,
    subscription_id: subscription_id,
    next_billing_date: next_billing_date,
    payment_frequency: payment_frequency,
    identification_source: "webhook_subscription",
    identification_timestamp: Date.now(),
    subscription_amount: amount,
    is_subscription: true,
  };

  await identifyServerUser(email, userProperties);

  // Track the subscription activation event
  return await trackServerEvent(TrackingEvents.SUBSCRIPTION_ACTIVATED, {
    subscription_id,
    email: email,
    license_type,
    max_devices,
    amount,
    product_id,
    payment_frequency,
    next_billing_date,
    source: "webhook",
    webhook_id,
    distinctId: email,
  });
};

// Track subscription renewal in webhook
export const trackWebhookSubscriptionRenewed = async (renewalData) => {
  const { subscription_id, email, license_key, next_billing_date, webhook_id } =
    renewalData;

  // Update user properties for renewal
  const userProperties = {
    user_type: "licensed",
    next_billing_date: next_billing_date,
    last_renewal_date: new Date().toISOString(),
    identification_source: "webhook_renewal",
    identification_timestamp: Date.now(),
  };

  await identifyServerUser(email, userProperties);

  // Track the subscription renewal event
  return await trackServerEvent(TrackingEvents.SUBSCRIPTION_RENEWED, {
    subscription_id,
    email: email,
    license_key,
    next_billing_date,
    source: "webhook",
    webhook_id,
    distinctId: email,
  });
};

// Track subscription cancellation in webhook
export const trackWebhookSubscriptionCancelled = async (webhook_id) => {
  return await trackServerEvent(TrackingEvents.SUBSCRIPTION_CANCELLED, {
    source: "webhook",
    webhook_id,
    distinctId: "server-event",
  });
};

// Track subscription expiration in webhook
export const trackWebhookSubscriptionExpired = async (expirationData) => {
  const { subscription_id, email, webhook_id } = expirationData;

  // Update user properties to reflect expired status
  const userProperties = {
    user_type: "expired",
    subscription_status: "expired",
    identification_source: "webhook_expiration",
    identification_timestamp: Date.now(),
  };

  await identifyServerUser(email, userProperties);

  // Track the subscription expiration event
  return await trackServerEvent(TrackingEvents.SUBSCRIPTION_EXPIRED, {
    subscription_id,
    email: email,
    source: "webhook",
    webhook_id,
    distinctId: email,
  });
};

// Track subscription failure in webhook
export const trackWebhookSubscriptionFailed = async (failureData) => {
  const { subscription_id, email, webhook_id } = failureData;

  // Update user properties to reflect failed status
  const userProperties = {
    user_type: "failed",
    subscription_status: "failed",
    identification_source: "webhook_failure",
    identification_timestamp: Date.now(),
  };

  await identifyServerUser(email, userProperties);

  // Track the subscription failure event
  return await trackServerEvent(TrackingEvents.SUBSCRIPTION_FAILED, {
    subscription_id,
    email: email,
    source: "webhook",
    webhook_id,
    distinctId: email,
  });
};

// Track refund in webhook
export const trackWebhookRefund = async (refundData) => {
  const { payment_id, subscription_id, email, webhook_id } = refundData;

  // Update user properties to reflect refunded status
  const userProperties = {
    user_type: "refunded",
    refund_type: subscription_id ? "subscription" : "one_time",
    identification_source: "webhook_refund",
    identification_timestamp: Date.now(),
  };

  await identifyServerUser(email, userProperties);

  // Track the refund event
  return await trackServerEvent(TrackingEvents.REFUND_SUCCEEDED, {
    payment_id,
    subscription_id,
    email: email,
    refund_type: subscription_id ? "subscription" : "one_time",
    source: "webhook",
    webhook_id,
    distinctId: email,
  });
};

// Track webhook processing error
export const trackWebhookProcessingError = async (errorData) => {
  const { webhook_id, event_type, error_message, error_name } = errorData;

  return await trackServerEvent(TrackingEvents.WEBHOOK_PROCESSING_ERROR, {
    webhook_id,
    event_type: event_type || "unknown",
    error_message,
    error_name,
    source: "webhook",
    distinctId: "server-event",
  });
};

// flushServerEvents is now imported from server-posthog.js
