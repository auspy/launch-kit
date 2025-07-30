"use client";

import { useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import posthog from "posthog-js";
import { TrackingEvents, Locations } from "@/lib/tracking";

// Product ID mapping - move this to environment variables or constants file
const PRODUCT_IDS = {
  one_year: {
    1: process.env.ONE_YEAR_1_DEVICES_PRODUCT_ID,
    2: process.env.ONE_YEAR_2_DEVICES_PRODUCT_ID,
    5: process.env.ONE_YEAR_5_DEVICES_PRODUCT_ID,
    10: process.env.ONE_YEAR_10_DEVICES_PRODUCT_ID,
  },
  lifetime: {
    1: process.env.LIFETIME_1_DEVICES_PRODUCT_ID,
    2: process.env.LIFETIME_2_DEVICES_PRODUCT_ID,
    5: process.env.LIFETIME_5_DEVICES_PRODUCT_ID,
    10: process.env.LIFETIME_10_DEVICES_PRODUCT_ID,
  },
  believer: {
    5: process.env.BELIEVER_5_DEVICES_PRODUCT_ID,
  },
  team: {
    default: process.env.TEAM_PRODUCT_ID,
  },
  // India-specific product IDs
  in_one_year: {
    1: process.env.ONE_YEAR_1_DEVICES_IN_PRODUCT_ID,
    2: process.env.ONE_YEAR_2_DEVICES_IN_PRODUCT_ID,
    5: process.env.ONE_YEAR_5_DEVICES_IN_PRODUCT_ID,
    10: process.env.ONE_YEAR_10_DEVICES_IN_PRODUCT_ID,
  },
  in_lifetime: {
    1: process.env.LIFETIME_1_DEVICES_IN_PRODUCT_ID,
    2: process.env.LIFETIME_2_DEVICES_IN_PRODUCT_ID,
    5: process.env.LIFETIME_5_DEVICES_IN_PRODUCT_ID,
    10: process.env.LIFETIME_10_DEVICES_IN_PRODUCT_ID,
  },
  in_believer: {
    5: process.env.BELIEVER_5_DEVICES_IN_PRODUCT_ID,
  },
  in_team: {
    default: process.env.TEAM_IN_PRODUCT_ID,
  },
};

let isSDKInitialized = false;

const DodoPaymentsOverlay = () => {
  const { toast } = useToast();

  // Initialize Dodo Payments SDK
  useEffect(() => {
    if (isSDKInitialized) return;

    const initializeSDK = async () => {
      try {
        // Dynamically import the SDK to avoid SSR issues
        const { DodoPayments } = await import("dodopayments-checkout");

        DodoPayments.Initialize({
          mode: process.env.NODE_ENV === "production" ? "live" : "test",
          displayType: "overlay",
          theme: "light",
          linkType: "static",
          onEvent: (event) => {
            console.log("Dodo Payments event:", event);

            switch (event.event_type) {
              case "checkout.opened":
                // Track checkout opened
                posthog.capture(TrackingEvents.PAYMENT_OVERLAY_OPENED, {
                  location: Locations.PRICING,
                });
                break;
              case "checkout.closed":
                // Track checkout closed
                posthog.capture(TrackingEvents.PAYMENT_OVERLAY_CLOSED, {
                  location: Locations.PRICING,
                });
                break;
              case "checkout.redirect":
                // Track successful payment redirect
                posthog.capture(TrackingEvents.PAYMENT_CHECKOUT_REDIRECT, {
                  location: Locations.PRICING,
                });
                break;
              case "checkout.error":
                // Track payment error
                posthog.capture(TrackingEvents.PAYMENT_ERROR, {
                  error_message: event.data?.message || "Unknown error",
                  location: Locations.PRICING,
                });

                toast({
                  title: "Payment Error",
                  description:
                    event.data?.message || "An error occurred during payment",
                  variant: "destructive",
                });
                break;
            }
          },
        });

        isSDKInitialized = true;
        console.log("Dodo Payments SDK initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Dodo Payments SDK:", error);
        toast({
          title: "Payment System Error",
          description: "Failed to initialize payment system. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeSDK();
  }, [toast]);

  // Function to get product ID based on plan type and locale
  const getProductId = useCallback((planType, devices, locale = "default") => {
    const productType = locale === "in" ? `in_${planType}` : planType;

    // For team plans, use the default product
    if (planType === "team") {
      return (
        PRODUCT_IDS[productType]?.default || PRODUCT_IDS[planType]?.default
      );
    }

    // For other plans, use device-specific product
    return (
      PRODUCT_IDS[productType]?.[devices] || PRODUCT_IDS[planType]?.[devices]
    );
  }, []);

  // Function to open checkout overlay
  const openCheckout = useCallback(
    async ({
      planType,
      devices,
      locale = "default",
      deviceId = null,
      fromApp = false,
      seatCount = null,
    }) => {
      try {
        if (!isSDKInitialized) {
          throw new Error("Payment system not initialized");
        }

        const { DodoPayments } = await import("dodopayments-checkout");

        const productId = getProductId(planType, devices, locale);

        if (!productId) {
          throw new Error(
            `Product not configured for ${planType} plan with ${devices} devices`
          );
        }

        // For team plans, use quantity, for others use 1
        const quantity = planType === "team" ? seatCount || devices : 1;

        // Get PostHog distinct_id for attribution linking
        const posthogDistinctId = posthog.get_distinct_id();
        console.log(
          "🔍 [DODO-PAYMENT] PostHog distinct_id:",
          posthogDistinctId
        );

        // Get Affonso referral ID for affiliate tracking
        const affonsoReferral = typeof window !== "undefined" ? window.affonso_referral : null;
        if (affonsoReferral) {
          console.log("🔗 [DODO-PAYMENT] Affonso referral ID:", affonsoReferral);
        }

        // Track payment initiation
        posthog.capture(TrackingEvents.PAYMENT_INITIATED, {
          plan_type: planType,
          devices: planType === "team" ? seatCount || devices : devices,
          location: Locations.PRICING,
          locale: locale === "in" ? "in" : "default",
          posthog_distinct_id: posthogDistinctId,
          ...(deviceId && { device_id: deviceId }),
          ...(fromApp && { from_app: fromApp }),
        });

        // Open checkout overlay
        await DodoPayments.Checkout.open({
          products: [
            {
              productId: productId,
              quantity: quantity,
            },
          ],
          redirectUrl: `${window.location.origin}/payment-status?success=true`,

          // 🔧 FIX: Use metadata_ prefix in queryParams (per Dodo Payments docs)
          // Any query parameter starting with metadata_ will be passed as metadata to webhooks
          queryParams: {
            // Regular query params
            plan_type: planType,
            devices: planType === "team" ? seatCount || devices : devices,
            locale: locale,
            ...(deviceId && { device_id: deviceId }),
            ...(fromApp && { from_app: fromApp }),

            // 🎯 PostHog Attribution: metadata_ prefix for webhook metadata
            metadata_posthog_distinct_id: posthogDistinctId,
            metadata_device_id: deviceId || "null",
            metadata_from_app: fromApp ? "true" : "false",
            metadata_plan_type: planType,
            metadata_devices:
              planType === "team" ? seatCount || devices : devices,
            metadata_locale: locale,
            
            // 🔗 Affonso Affiliate Tracking
            ...(affonsoReferral && { metadata_affonso_referral: affonsoReferral }),
          },
        });
      } catch (error) {
        console.error("Checkout error:", error);

        // Track error
        posthog.capture(TrackingEvents.PAYMENT_ERROR, {
          plan_type: planType,
          error_message: error.message,
          devices: planType === "team" ? seatCount || devices : devices,
          location: Locations.PRICING,
          locale: locale === "in" ? "in" : "default",
          ...(deviceId && { device_id: deviceId }),
          ...(fromApp && { from_app: fromApp }),
        });

        toast({
          title: "Error opening checkout",
          description: error.message || "Failed to open payment overlay",
          variant: "destructive",
        });
      }
    },
    [getProductId, toast]
  );

  // Function to close checkout overlay
  const closeCheckout = useCallback(async () => {
    try {
      if (!isSDKInitialized) return;

      const { DodoPayments } = await import("dodopayments-checkout");
      DodoPayments.Checkout.close();
    } catch (error) {
      console.error("Error closing checkout:", error);
    }
  }, []);

  // Function to check if checkout is open
  const isCheckoutOpen = useCallback(async () => {
    try {
      if (!isSDKInitialized) return false;

      const { DodoPayments } = await import("dodopayments-checkout");
      return DodoPayments.Checkout.isOpen();
    } catch (error) {
      console.error("Error checking checkout status:", error);
      return false;
    }
  }, []);

  return {
    openCheckout,
    closeCheckout,
    isCheckoutOpen,
    isInitialized: isSDKInitialized,
  };
};

export default DodoPaymentsOverlay;
