// app/PostHogPageView.jsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { usePostHog } from "posthog-js/react";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  // Centralized device_id identification logic
  useEffect(() => {
    if (!posthog || typeof window === "undefined") return;

    const handleDeviceIdIdentification = () => {
      console.log("🔍 [POSTHOG-PAGEVIEW] Checking for device_id attribution");

      // 1. First check URL parameters
      const deviceIdFromUrl = searchParams?.get("device_id");

      // 2. Check localStorage for existing device_id
      const storedDeviceId = localStorage.getItem("fm_device");

      // 3. Get current PostHog distinct_id
      const currentDistinctId = posthog.get_distinct_id();

      console.log("📊 [POSTHOG-PAGEVIEW] Attribution check:", {
        deviceIdFromUrl: deviceIdFromUrl || "none",
        storedDeviceId: storedDeviceId || "none",
        currentDistinctId: currentDistinctId,
        currentPage: pathname,
      });

      // Handle device_id from URL (new attribution)
      if (deviceIdFromUrl) {
        console.log(
          "✅ [POSTHOG-PAGEVIEW] Device ID found in URL - establishing new attribution"
        );

        // Store device_id in localStorage for persistence
        localStorage.setItem("fm_device", deviceIdFromUrl);

        // Identify with device_id if not already identified
        if (currentDistinctId !== deviceIdFromUrl) {
          console.log(
            "🔗 [POSTHOG-PAGEVIEW] Identifying session with device_id from URL"
          );

          posthog.identify(deviceIdFromUrl, {
            $anon_distinct_id: currentDistinctId,
            device_id: deviceIdFromUrl,
            attributed_from_app: true,
            app_attribution_timestamp: Date.now(),
            attribution_landing_page: pathname,
            attribution_url: window.location.href,
            previous_anonymous_id: currentDistinctId,
            identification_source: "url_params_pageview",
          });

          // Track attribution event
          posthog.capture("app_attribution_established", {
            device_id: deviceIdFromUrl,
            attribution_type: "url_device_id",
            landing_page: pathname,
            landing_url: window.location.href,
            timestamp: Date.now(),
            previous_anonymous_id: currentDistinctId,
            identification_method: "pageview_identify",
          });

          console.log("✅ [POSTHOG-PAGEVIEW] Device attribution established:", {
            previousAnonymousId: currentDistinctId,
            newDistinctId: deviceIdFromUrl,
            landingPage: pathname,
          });
        } else {
          console.log(
            "ℹ️ [POSTHOG-PAGEVIEW] Already identified with this device_id"
          );
        }
      }
      // Handle existing stored device_id (returning user)
      else if (storedDeviceId && currentDistinctId !== storedDeviceId) {
        console.log(
          "🔄 [POSTHOG-PAGEVIEW] Found stored device_id - ensuring identification"
        );

        posthog.identify(storedDeviceId, {
          device_id: storedDeviceId,
          attributed_from_app: true,
          persistent_attribution: true,
          re_identification_timestamp: Date.now(),
          current_page: pathname,
          identification_source: "localStorage_pageview",
        });

        console.log(
          "✅ [POSTHOG-PAGEVIEW] Re-identified with stored device_id:",
          {
            storedDeviceId: storedDeviceId,
            currentPage: pathname,
          }
        );
      }
      // Direct web access (no device attribution)
      else if (!storedDeviceId && !deviceIdFromUrl) {
        console.log(
          "🌐 [POSTHOG-PAGEVIEW] Direct web access - no device attribution"
        );
      }
      // Already properly identified
      else {
        console.log(
          "✅ [POSTHOG-PAGEVIEW] Attribution already properly established"
        );
      }
    };

    // Run device identification first, then handle pageview
    handleDeviceIdIdentification();
  }, [pathname, searchParams, posthog]);

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }

      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

// Wrap this in Suspense to avoid the `useSearchParams` usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
export default function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
