"use client";
import { Button } from "@/components/ui/button";
import { urlBase } from "@/constants";
import { Gift, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  trackButtonClick,
  ButtonActions,
  Locations,
  TrackingEvents,
} from "@/lib/tracking";
import posthog from "posthog-js";

export default function ButtonGetLifetimeLicense({
  location = Locations.PRICING,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDirectToPaymentLink = async () => {
    // Track purchase button click
    trackButtonClick("lifetime_license_purchase", ButtonActions.PURCHASE, {
      location: location,
      devices: 2,
      plan_type: "lifetime",
    });

    setIsLoading(true);
    try {
      const response = await fetch(urlBase + "/api/create-payment/lifetime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: "lifetime",
          devices: 2,
        }),
      });

      if (!response.ok) throw new Error("Failed to create payment link");

      const { paymentUrl } = await response.json();

      // Track successful payment link creation
      posthog.capture(TrackingEvents.PAYMENT_INITIATED, {
        plan_type: "lifetime",
        success: true,
        devices: 2,
        location: location,
      });

      window?.open(paymentUrl, "_blank");
    } catch (error) {
      console.error("Payment link error:", error);

      // Track error
      posthog.capture(TrackingEvents.PAYMENT_ERROR, {
        plan_type: "lifetime",
        error_message: error.message || "Unknown error",
        devices: 2,
        location: location,
      });

      toast({
        title: "Error creating payment link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[300px]">
      <Button
        size="lg"
        onClick={handleDirectToPaymentLink}
        disabled={isLoading}
        className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:brightness-105 text-white transition-all font-semibold flex items-center justify-center gap-2`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Get Lifetime License{" "}
            <Image
              src="/target_icon.png"
              className="w-4 h-4 mb-0.5"
              alt="Target"
              width={16}
              height={16}
            />
          </>
        )}
      </Button>

      <p className="text-sm font-medium text-gray-600 flex gap-1 items-center">
        <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent flex items-center">
          <Gift className="w-4 h-4 text-blue-500 mr-0.5" /> $11 off
        </span>{" "}
        for first 201 users(9 left)
      </p>
    </div>
  );
}
