"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { trackEvent, TrackingEvents } from "@/lib/tracking";
import { isDev } from "@/constants";

function PricingAttributionHandler({ children, locale = "default" }) {
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const [deviceId, setDeviceId] = React.useState(null);
  const [identificationStatus, setIdentificationStatus] = React.useState(null);

  // Capture device_id from URL params and handle attribution
  React.useEffect(() => {
    const deviceIdParam = searchParams.get("device_id");
    console.log("📱 [PRICING-WRAPPER] Checking for device_id in URL params");

    if (deviceIdParam && posthog) {
      setDeviceId(deviceIdParam);
      console.log("✅ [PRICING-WRAPPER] Device ID captured from app:", {
        deviceId: deviceIdParam,
        locale: locale,
        fullUrl: window.location.href,
      });

      // Track that user arrived from app
      trackEvent(TrackingEvents.ATTRIBUTION_LINKED, {
        source: "focusmo_app",
        action: "purchase_license_click",
        device_id: deviceIdParam,
        landing_page: "/pricing",
        locale: locale,
        user_type: "app_user",
      });

      // 🆕 NEW PLAN: Direct identify with device_id (no alias chaining)
      console.log(
        "🔗 [PRICING-WRAPPER] Identifying session as device_id (NEW PLAN)"
      );

      // Get current anonymous distinct ID before identification
      const currentAnonymousId = posthog.get_distinct_id();
      console.log(
        "🆔 [PRICING-WRAPPER] Current anonymous ID:",
        currentAnonymousId
      );

      // NEW PLAN: Identify with device_id, linking previous anonymous session
      posthog.identify(deviceIdParam, {
        $anon_distinct_id: currentAnonymousId,
        device_id: deviceIdParam,
        attributed_from_app: true,
        app_attribution_timestamp: Date.now(),
        attribution_landing_page: "/pricing",
        attribution_locale: locale,
        previous_anonymous_id: currentAnonymousId,
      });

      // Store device_id in localStorage for persistence across page loads
      localStorage.setItem("fm_device", deviceIdParam);

      console.log("✅ [PRICING-WRAPPER] PostHog identified with device_id:", {
        previousAnonymousId: currentAnonymousId,
        newDistinctId: deviceIdParam,
      });

      // Track the attribution event with the new distinct_id
      posthog.capture("app_attribution_established", {
        device_id: deviceIdParam,
        attribution_type: "purchase_license_click",
        landing_page: "/pricing",
        locale: locale,
        timestamp: Date.now(),
        previous_anonymous_id: currentAnonymousId,
        identification_method: "direct_identify", // NEW PLAN
      });

      setIdentificationStatus("identified");
      console.log(
        "✅ [PRICING-WRAPPER] PostHog device identification completed (NEW PLAN)"
      );
    } else {
      console.log(
        "ℹ️ [PRICING-WRAPPER] No device_id in URL - checking localStorage"
      );

      // Check if we have stored device_id from previous session
      const storedDeviceId = localStorage.getItem("fm_device");
      if (storedDeviceId && posthog) {
        setDeviceId(storedDeviceId);
        console.log(
          "📱 [PRICING-WRAPPER] Using stored device_id:",
          storedDeviceId
        );

        // Ensure we're still identified as the device_id
        const currentDistinctId = posthog.get_distinct_id();
        if (currentDistinctId !== storedDeviceId) {
          console.log(
            "🔄 [PRICING-WRAPPER] Re-identifying with stored device_id"
          );
          posthog.identify(storedDeviceId);
        }
      } else {
        console.log(
          "ℹ️ [PRICING-WRAPPER] No device_id found - direct web access"
        );
      }
    }
  }, [searchParams, posthog, locale]);

  // Clone children and pass props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        deviceId,
        fromApp: !!deviceId,
        showAppBanner: isDev,
      });
    }
    return child;
  });

  return (
    <>
      {/* App Connection Banner */}
      {deviceId && isDev && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="container max-w-6xl px-4 py-3">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                (Dev Mode) Connected from your Focusmo app
              </span>
              <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">
                Enhanced experience
              </span>
            </div>
          </div>
        </div>
      )}

      {enhancedChildren}
    </>
  );
}

/**
 * Reusable wrapper for pricing pages that handles device_id attribution
 * from the Focusmo app. Keeps the main pricing pages server-side rendered.
 *
 * @param {React.ReactNode} children - The pricing page content to wrap
 * @param {string} locale - The locale for pricing (e.g., "in" for India)
 */
export default function PricingPageWrapper({ children, locale = "default" }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PricingAttributionHandler locale={locale}>
        {children}
      </PricingAttributionHandler>
    </Suspense>
  );
}
