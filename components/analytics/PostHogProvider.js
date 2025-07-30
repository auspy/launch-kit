"use client";

import { useEffect, createContext, useContext } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import dynamic from "next/dynamic";

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

// Create context for bootstrap flags
const BootstrapFlagsContext = createContext({});

// Export the hook for components to use
export function useBootstrapFlags() {
  return useContext(BootstrapFlagsContext);
}

export function PostHogProvider({ children, bootstrapFlags = {} }) {
  useEffect(() => {
    // Only initialize on client side
    if (typeof window !== "undefined") {
      console.log("🚀 [POSTHOG] Initializing PostHog client");

      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        ui_host:
          process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || "https://us.posthog.com",
        debug: process.env.NODE_ENV === "development",
        // Enable key features
        capture_pageview: false, // We'll handle this manually with our utility
        capture_pageleave: true,
        autocapture: true,
        session_recording: {
          enabled: true,
          minimum_duration: 1000,
        },
        // Use localStorage for anonymous user persistence
        persistence: "localStorage",
        // 👈 CRITICAL: Bootstrap data to prevent flicker in A/B tests
        bootstrap: {
          featureFlags: bootstrapFlags,
        },
      });

      console.log(
        "✅ [POSTHOG] PostHog initialized with flags:",
        Object.keys(bootstrapFlags)
      );
    }
  }, []); // Empty dependency array - only run once

  return (
    <BootstrapFlagsContext.Provider value={bootstrapFlags}>
      <PHProvider client={posthog}>
        <PostHogPageView />
        {children}
      </PHProvider>
    </BootstrapFlagsContext.Provider>
  );
}
