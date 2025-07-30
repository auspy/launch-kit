/**
 * Configurable Dodo Payments webhook handler
 * Handles all webhook events with customizable business logic
 */

import { Webhook } from "standardwebhooks";
import {
  createLicense,
  updateSubscription,
  revokeLicenseBySubsId,
  revokeLicenseByPaymentId,
} from "@/lib/license/license.operations";
import {
  generateLicenseKey,
  getLicenseTypeFromProduct,
  getMaxDevicesFromProductId,
} from "@/lib/license/license.utils";
import { getWebhookCollection } from "@/adapters/webhook.db";
import { getLicensesCollection } from "@/adapters/license.db";
import {
  validateWebhookHeaders,
  validatePaymentSucceededWebhook,
  validateSubscriptionActiveWebhook,
  validateSubscriptionCancelledWebhook,
  validateSubscriptionExpiredWebhook,
  validateSubscriptionFailedWebhook,
  validateRefundSucceededWebhook,
  validateSubscriptionRenewedWebhook,
} from "@/lib/dodo/dodo-webhook.validation";

export function createDodoWebhookHandler(config = {}) {
  const {
    // Webhook configuration
    webhookSecret = process.env.DODO_WEBHOOK_SECRET,
    maxDuration = 30,
    
    // Product configuration
    teamProductIds = [
      process.env.TEAM_PRODUCT_ID,
      process.env.TEAM_IN_PRODUCT_ID,
    ].filter(Boolean),
    
    oneYearProductIds = process.env.ONE_YEAR_UPDATES_PRODUCT_IDS?.split(',') || [],
    
    // Event handlers
    eventHandlers = {},
    
    // Hooks for customization
    onWebhookReceived = async (event, webhookId) => event,
    onWebhookProcessed = async (event, webhookId, status) => {},
    onError = async (error, webhookId, event) => {},
    
    // Logging
    logging = true,
  } = config;

  return async function dodoWebhookHandler(request) {
    const webhookId = request.headers.get("webhook-id") || Date.now().toString();
    
    try {
      if (logging) {
        console.log(`[${webhookId}] 🔔 DODO webhook received`);
      }

      const payload = await request.text();
      const headers = {
        "webhook-id": request.headers.get("webhook-id"),
        "webhook-timestamp": request.headers.get("webhook-timestamp"),
        "webhook-signature": request.headers.get("webhook-signature"),
      };

      if (logging) {
        console.log(`[${webhookId}] 📦 Raw webhook payload:`, payload);
        console.log(`[${webhookId}] 📋 Webhook headers:`, headers);
      }

      // Validate headers
      try {
        if (logging) {
          console.log(`[${webhookId}] 🔍 Validating webhook headers...`);
        }
        validateWebhookHeaders(headers);
        if (logging) {
          console.log(`[${webhookId}] ✅ Headers validation successful`);
        }
      } catch (error) {
        console.error(`[${webhookId}] ❌ Invalid webhook headers:`, error.errors);
        return new Response(
          JSON.stringify({ success: false, error: "Invalid headers" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check for duplicate webhook
      if (logging) {
        console.log(`[${webhookId}] 🔍 Checking for duplicate webhook:`, webhookId);
      }
      
      const webhookCollection = await getWebhookCollection();
      const existingWebhook = await webhookCollection.findOne({ webhookId });

      if (existingWebhook) {
        if (logging) {
          console.log(`[${webhookId}] ⚠️ Webhook already processed, skipping`);
        }
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Verify signature
      if (logging) {
        console.log(`[${webhookId}] 🔐 Verifying webhook signature...`);
      }
      
      const webhook = new Webhook(webhookSecret);
      const event = webhook.verify(payload, headers);
      
      if (logging) {
        console.log(`[${webhookId}] ✅ Signature verification successful`);
      }

      // Allow pre-processing of event
      const processedEvent = await onWebhookReceived(event, webhookId);

      // Process the webhook based on type
      const { type } = processedEvent;
      if (logging) {
        console.log(`[${webhookId}] 📝 Processing webhook event:`, type);
      }
      
      let status = "success";

      try {
        // Use custom event handler if provided
        if (eventHandlers[type]) {
          await eventHandlers[type](processedEvent, webhookId, config);
        } else {
          // Use default handlers
          await processDefaultEvent(processedEvent, webhookId, config);
        }
      } catch (error) {
        status = "error";
        throw error;
      } finally {
        // Record webhook processing
        if (logging) {
          console.log(`[${webhookId}] 💾 Recording webhook processing...`);
        }
        
        await webhookCollection.insertOne({
          webhookId,
          eventType: type || "unknown",
          processedAt: new Date(),
          status,
          payload: JSON.parse(payload),
        });
        
        if (logging) {
          console.log(`[${webhookId}] ✅ Webhook processing recorded`);
        }

        // Call post-processing hook
        await onWebhookProcessed(processedEvent, webhookId, status);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      await onError(error, webhookId, null);
      
      if (error.name === "WebhookVerificationError") {
        console.error(`[${webhookId}] ❌ Webhook verification failed:`, error.message);
      } else if (error.code === 121) {
        // MongoDB validation error
        console.error(`[${webhookId}] ❌ MongoDB validation error:`, {
          failingDocumentId: error.errInfo?.failingDocumentId,
          details: JSON.stringify(error.errInfo?.details, null, 2),
        });
      } else {
        console.error(`[${webhookId}] ❌ Webhook error:`, {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
        });
      }
      
      // Still return 200 to acknowledge receipt
      return new Response(
        JSON.stringify({ success: false }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

/**
 * Process default webhook events
 */
async function processDefaultEvent(event, webhookId, config) {
  const { type } = event;
  const { teamProductIds, oneYearProductIds, logging } = config;

  switch (type) {
    case "payment.succeeded": {
      await handlePaymentSucceeded(event, webhookId, { teamProductIds, oneYearProductIds, logging });
      break;
    }

    case "subscription.active": {
      await handleSubscriptionActive(event, webhookId, { logging });
      break;
    }

    case "subscription.renewed": {
      await handleSubscriptionRenewed(event, webhookId, { logging });
      break;
    }

    case "subscription.cancelled": {
      if (logging) {
        console.log(`[${webhookId}] 🔔 Processing subscription cancelled`);
      }
      break;
    }

    case "subscription.expired": {
      await handleSubscriptionExpired(event, webhookId, { logging });
      break;
    }

    case "subscription.failed": {
      await handleSubscriptionFailed(event, webhookId, { logging });
      break;
    }

    case "refund.succeeded": {
      await handleRefundSucceeded(event, webhookId, { logging });
      break;
    }

    default: {
      if (logging) {
        console.log(`[${webhookId}] 🔔 Unhandled webhook event:`, type);
      }
      break;
    }
  }
}

/**
 * Handle payment.succeeded event
 */
async function handlePaymentSucceeded(event, webhookId, { teamProductIds, oneYearProductIds, logging }) {
  const validatedPayment = validatePaymentSucceededWebhook(JSON.stringify(event));
  const {
    data: {
      payment_id,
      total_amount,
      customer: { email },
      subscription_id,
      product_cart,
    },
  } = validatedPayment;

  // Only create license for non-subscription payments
  if (!subscription_id && product_cart?.length > 0) {
    if (logging) {
      console.log(`[${webhookId}] 💰 Processing one-time payment:`, {
        payment_id,
        email,
      });
    }

    const licenseKey = await generateLicenseKey();
    const product_id = product_cart[0].product_id;
    const quantity = product_cart[0].quantity || 1;

    // Check if this is a team product
    const isTeamProduct = teamProductIds.includes(product_id);

    // Get license type based on product
    const licenseType = getLicenseTypeFromProduct(product_id);

    // Determine if this is a one-year updates product
    let updatesEndDate = null;
    if (oneYearProductIds.includes(product_id) || isTeamProduct) {
      const purchaseDate = new Date();
      updatesEndDate = new Date(purchaseDate);
      updatesEndDate.setFullYear(updatesEndDate.getFullYear() + 1);
      if (logging) {
        console.log(`[${webhookId}] 📅 One-year updates license, setting expiry: ${updatesEndDate}`);
      }
    }

    // For team products, use quantity as device count
    let maxDevices;
    if (isTeamProduct) {
      maxDevices = quantity;
      if (logging) {
        console.log(`[${webhookId}] 👥 Team product detected, using quantity as device count: ${quantity}`);
      }
    } else {
      maxDevices = getMaxDevicesFromProductId(
        updatesEndDate ? "one_year" : "lifetime",
        product_id
      );
    }

    if (logging) {
      console.log(`[${webhookId}] 📝 Creating license:`, {
        licenseType,
        maxDevices,
        product_id,
        quantity,
        isTeamProduct,
      });
    }

    const license = await createLicense({
      licenseKey,
      email,
      maxDevices,
      purchaseId: payment_id,
      purchaseAmount: total_amount / 100,
      purchaseDate: new Date(),
      productId: product_id,
      licenseType,
      updatesEndDate,
    });

    if (!license) {
      console.error(`[${webhookId}] ❌ Failed to create license for payment:`, payment_id);
      throw new Error(`Failed to create license for payment: ${payment_id}`);
    }
    
    if (logging) {
      console.log(`[${webhookId}] ✅ License created successfully`);
    }
  } else {
    if (logging) {
      console.log(`[${webhookId}] 📝 Subscription payment, skipping license creation`);
    }
  }
}

/**
 * Handle subscription.active event
 */
async function handleSubscriptionActive(event, webhookId, { logging }) {
  const validatedSub = validateSubscriptionActiveWebhook(JSON.stringify(event));
  const {
    data: {
      product_id,
      payment_frequency_interval,
      customer: { email },
      subscription_id,
      recurring_pre_tax_amount,
      next_billing_date,
    },
  } = validatedSub;

  // First try to find existing license by subscription_id
  const collection = await getLicensesCollection();
  const existingLicense = await collection.findOne({ subscription_id });

  const licenseType = payment_frequency_interval === "Year" ? "yearly" : "monthly";

  if (existingLicense) {
    // Update existing license
    if (logging) {
      console.log(`[${webhookId}] 📝 Updating existing subscription license:`, existingLicense.licenseKey);
    }
    
    await updateSubscription(existingLicense.licenseKey, {
      licenseType,
      nextBillingDate: new Date(next_billing_date),
    });
    
    if (logging) {
      console.log(`[${webhookId}] ✅ Updated subscription for license: ${existingLicense.licenseKey}`);
    }
  } else {
    // Create new license for subscription
    if (logging) {
      console.log(`[${webhookId}] 🔑 Creating new subscription license`);
    }
    
    const licenseKey = await generateLicenseKey();
    const license = await createLicense({
      licenseKey,
      email,
      maxDevices: getMaxDevicesFromProductId(licenseType, product_id),
      purchaseId: subscription_id,
      purchaseAmount: recurring_pre_tax_amount / 100,
      purchaseDate: new Date(),
      productId: product_id,
      licenseType,
      subscription_id: subscription_id,
      nextBillingDate: new Date(next_billing_date),
    });

    if (!license) {
      console.error(`[${webhookId}] ❌ Failed to create license for subscription:`, subscription_id);
      throw new Error(`Failed to create license for subscription: ${subscription_id}`);
    }
    
    if (logging) {
      console.log(`[${webhookId}] ✅ Subscription license created successfully`);
    }
  }
}

/**
 * Handle subscription.renewed event
 */
async function handleSubscriptionRenewed(event, webhookId, { logging }) {
  const validatedSub = validateSubscriptionRenewedWebhook(JSON.stringify(event));
  const {
    data: {
      subscription_id,
      next_billing_date,
      customer: { email },
    },
  } = validatedSub;

  if (logging) {
    console.log(`[${webhookId}] 🔄 Processing subscription renewal for ${email}`);
  }

  // Find license by subscription_id
  const collection = await getLicensesCollection();
  const existingLicense = await collection.findOne({ subscription_id });

  if (existingLicense) {
    if (logging) {
      console.log(`[${webhookId}] 📅 Updating nextBillingDate for license:`, existingLicense.licenseKey);
    }
    
    await updateSubscription(existingLicense.licenseKey, {
      nextBillingDate: new Date(next_billing_date),
    });
    
    if (logging) {
      console.log(`[${webhookId}] ✅ Updated nextBillingDate for license: ${existingLicense.licenseKey} to ${next_billing_date}`);
    }
  } else {
    console.error(`[${webhookId}] ❌ Could not find license for subscription: ${subscription_id}`);
  }
}

/**
 * Handle subscription.expired event
 */
async function handleSubscriptionExpired(event, webhookId, { logging }) {
  const validatedSub = validateSubscriptionExpiredWebhook(JSON.stringify(event));
  const {
    data: {
      subscription_id,
      customer: { email },
    },
  } = validatedSub;

  if (logging) {
    console.log(`[${webhookId}] 🔔 Processing subscription expired for ${email}`);
  }

  // Revoke the license
  await revokeLicenseBySubsId(subscription_id);
  
  if (logging) {
    console.log(`[${webhookId}] ✅ Revoked license for subscription: ${subscription_id}`);
  }
}

/**
 * Handle subscription.failed event
 */
async function handleSubscriptionFailed(event, webhookId, { logging }) {
  const validatedSub = validateSubscriptionFailedWebhook(JSON.stringify(event));
  const {
    data: {
      subscription_id,
      customer: { email },
    },
  } = validatedSub;

  if (logging) {
    console.log(`[${webhookId}] 🔔 Processing subscription failure for ${email}`);
  }

  // Revoke the license for failed subscription
  await revokeLicenseBySubsId(subscription_id);
  
  if (logging) {
    console.log(`[${webhookId}] ✅ Revoked license for failed subscription: ${subscription_id}`);
  }
}

/**
 * Handle refund.succeeded event
 */
async function handleRefundSucceeded(event, webhookId, { logging }) {
  const validatedRefund = validateRefundSucceededWebhook(JSON.stringify(event));
  const {
    data: {
      payment_id,
      subscription_id,
      customer: { email },
    },
  } = validatedRefund;

  if (logging) {
    console.log(`[${webhookId}] 🔔 Processing refund for ${email}`);
  }

  // If it's a subscription refund, revoke by subscription_id
  if (subscription_id) {
    await revokeLicenseBySubsId(subscription_id);
    if (logging) {
      console.log(`[${webhookId}] ✅ Revoked license for refunded subscription: ${subscription_id}`);
    }
  } else {
    // For one-time payment refunds, revoke by payment_id
    await revokeLicenseByPaymentId(payment_id);
    if (logging) {
      console.log(`[${webhookId}] ✅ Revoked license for refunded payment: ${payment_id}`);
    }
  }
}