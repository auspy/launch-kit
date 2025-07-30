/**
 * Centralized PostHog service using React hooks
 * Handles user identification and attribution linking between website and app
 */

// This is a React hook-based service, so it should be used within React components
export const PostHogService = {
  /**
   * Identify user after login, linking anonymous session to email
   * @param {string} email - User email (distinct ID)
   * @param {string|null} deviceId - Device ID from app (for attribution)
   * @param {object} posthog - PostHog hook instance
   */
  identifyUser(email, deviceId = null, posthog = null) {
    if (!posthog) {
      console.warn("⚠️ [POSTHOG-SERVICE] PostHog instance not available");
      return { success: false, reason: "no_posthog" };
    }

    console.log("🎯 [POSTHOG-SERVICE] Identifying user with React hook");
    console.log("📧 [POSTHOG-SERVICE] Email:", email.substring(0, 3) + "***");
    console.log("📱 [POSTHOG-SERVICE] Device ID:", deviceId || "none");

    try {
      // Get the current distinct ID before identification
      const currentDistinctId = posthog.get_distinct_id();
      console.log(
        "🔍 [POSTHOG-SERVICE] Current distinct ID:",
        currentDistinctId
      );

      // Prepare identification properties
      const identificationProps = {
        identification_source: "website_login",
        identification_timestamp: Date.now(),
        login_method: "email_password",
      };

      // Add device_id if provided (from app attribution)
      if (deviceId) {
        identificationProps.device_id = deviceId;
        identificationProps.attributed_from_app = true;
        console.log(
          "🔗 [POSTHOG-SERVICE] Including device_id for app attribution"
        );
      }

      // 🔗 HANDLE ALIAS CHAIN: anonymous_id → device_id → email
      if (deviceId && currentDistinctId === deviceId) {
        // Case 1: User came from app, current distinct_id is already device_id
        // We need to alias device_id → email
        console.log(
          "📱 [POSTHOG-SERVICE] User came from app, aliasing device_id to email"
        );

        posthog.alias(email);
        identificationProps.alias_chain = "anonymous_id → device_id → email";
        identificationProps.previous_device_id = deviceId;

        console.log("✅ [POSTHOG-SERVICE] Aliased device_id to email:", {
          previousDeviceId: deviceId,
          newDistinctId: email,
        });
      } else if (deviceId && currentDistinctId !== deviceId) {
        // Case 2: User has device_id but current session is different (anonymous)
        // We have: anonymous_id (current) and device_id (from URL)
        // Strategy: Keep current anonymous session, just identify with email
        console.log(
          "🌐 [POSTHOG-SERVICE] User has device_id but different session, identifying with email"
        );

        identificationProps.$anon_distinct_id = currentDistinctId;
        identificationProps.alias_chain =
          "anonymous_id → email (device_id stored)";
        identificationProps.related_device_id = deviceId;
      } else {
        // Case 3: No device_id, regular website-only user
        console.log(
          "🌐 [POSTHOG-SERVICE] Regular website user, identifying anonymous session"
        );

        identificationProps.$anon_distinct_id = currentDistinctId;
        identificationProps.alias_chain = "anonymous_id → email";
      }

      // Identify the user with email as distinct ID
      posthog.identify(email, identificationProps);

      console.log("✅ [POSTHOG-SERVICE] User identified successfully");
      return {
        success: true,
        distinctId: email,
        linkedAnonymousId: currentDistinctId,
        deviceId: deviceId,
      };
    } catch (error) {
      console.error("❌ [POSTHOG-SERVICE] Error during identification:", error);
      return { success: false, reason: "identification_error", error };
    }
  },

  /**
   * Get current distinct ID
   * @param {object} posthog - PostHog hook instance
   */
  getCurrentDistinctId(posthog = null) {
    if (!posthog) {
      console.warn("⚠️ [POSTHOG-SERVICE] PostHog instance not available");
      return null;
    }

    try {
      return posthog.get_distinct_id();
    } catch (error) {
      console.error("❌ [POSTHOG-SERVICE] Error getting distinct ID:", error);
      return null;
    }
  },

  /**
   * Reset user identification (logout)
   * @param {object} posthog - PostHog hook instance
   */
  resetUser(posthog = null) {
    if (!posthog) {
      console.warn("⚠️ [POSTHOG-SERVICE] PostHog instance not available");
      return { success: false, reason: "no_posthog" };
    }

    console.log("🔄 [POSTHOG-SERVICE] Resetting user identification");

    try {
      posthog.reset();
      console.log("✅ [POSTHOG-SERVICE] User reset successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ [POSTHOG-SERVICE] Error during reset:", error);
      return { success: false, reason: "reset_error", error };
    }
  },

  /**
   * Track event with consistent properties
   * @param {string} eventName - Event name
   * @param {object} properties - Event properties
   * @param {object} posthog - PostHog hook instance
   */
  trackEvent(eventName, properties = {}, posthog = null) {
    if (!posthog) {
      console.warn("⚠️ [POSTHOG-SERVICE] PostHog instance not available");
      return { success: false, reason: "no_posthog" };
    }

    try {
      const enhancedProperties = {
        ...properties,
        source: "website",
        timestamp: Date.now(),
      };

      posthog.capture(eventName, enhancedProperties);
      return { success: true };
    } catch (error) {
      console.error("❌ [POSTHOG-SERVICE] Error tracking event:", error);
      return { success: false, reason: "tracking_error", error };
    }
  },
};

// Hook-based wrapper for use in React components
export const usePostHogService = (posthog) => {
  return {
    identifyUser: (email, deviceId = null) =>
      PostHogService.identifyUser(email, deviceId, posthog),
    getCurrentDistinctId: () => PostHogService.getCurrentDistinctId(posthog),
    resetUser: () => PostHogService.resetUser(posthog),
    trackEvent: (eventName, properties = {}) =>
      PostHogService.trackEvent(eventName, properties, posthog),
  };
};

export default PostHogService;
