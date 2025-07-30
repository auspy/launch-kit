"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { urlBase } from "@/constants";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowRight, DownloadIcon } from "lucide-react";
import { ButtonMainCTAClient as ButtonMainCTA } from "@/components/buttons/ButtonMainCTA";
import BillingSelector from "./BillingSelector";
import DeviceSelectorForLifetime from "./DeviceSelectorForLifetime";
import {
  trackButtonClick,
  ButtonActions,
  TrackingEvents,
  Locations,
} from "@/lib/tracking";
import posthog from "posthog-js";

// Pricing Constants
export const PRICING = {
  FREE: {
    PRICE: 0,
    TRIAL_DAYS: 3,
  },
  MONTHLY: {
    DEVICES: {
      2: {
        PRICE: 4,
        DISCOUNT: 0,
      },
      4: {
        PRICE: 5.25,
        DISCOUNT: 0,
      },
      10: {
        PRICE: 12.0,
        DISCOUNT: 0,
      },
    },
  },
  YEARLY: {
    DEVICES: {
      2: {
        PRICE: 19.99,
        DISCOUNT: 0,
      },
      4: {
        PRICE: 33.0,
        DISCOUNT: 0,
      },
      10: {
        PRICE: 66.0,
        DISCOUNT: 0,
      },
    },
  },
  LIFETIME_PRO: {
    DEVICES: {
      1: {
        PRICE: 29,
        DISCOUNT: 0,
      },
      2: {
        PRICE: 49,
        DISCOUNT: 0,
      },
      5: {
        PRICE: 109,
        DISCOUNT: 0,
      },
      10: {
        PRICE: 199,
        DISCOUNT: 0,
      },
    },
    UPDATES_PERIOD: "1 year",
  },
};

// Simplified key features list for each plan, based on CleanShot X style
const PLAN_FEATURES = {
  FREE: [
    "Floating Timer (25-min limit)",
    "Quick Access Panel",
    "Global Keyboard Shortcuts",
  ],
  PRO: [
    {
      title: "Cancel anytime",
      desc: "No commitment, no hassle",
    },
    {
      title: "All Pro Features Included",
      desc: "Get everything in Pro, forever",
    },
    {
      title: "Priority Support",
      desc: "Get help when you need it most",
    },
  ],
  LIFETIME: [
    {
      title: "The Mac app — yours forever",
      desc: "You will receive a license key to activate the app",
    },
    {
      title: "All Pro Features Included",
      desc: "Get everything in Pro",
    },
    {
      title: "Lifetime Updates",
      desc: "Stay up to date with latest features",
    },
    {
      title: "Lifetime Priority Support",
      desc: "Direct access to our support team",
    },
  ],
};

const calculateLifetimeDiscount = (deviceCount) => {
  let correctedDeviceCount = deviceCount;
  // compare price with 1 device
  const price = PRICING.LIFETIME_PRO.DEVICES[1].PRICE;
  if (deviceCount === 1) {
    correctedDeviceCount = 2;
  }
  const discount = PRICING.LIFETIME_PRO.DEVICES[correctedDeviceCount].PRICE;
  return price * correctedDeviceCount - discount;
};

// Money-back guarantee component
const MoneyBackGuarantee = () => {
  return (
    <div
      id="money-back-guarantee"
      className="relative  w-full max-w-3xl overflow-hidden bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 shadow-sm px-8 py-10 mb-12"
    >
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              30-Day Money-Back Guarantee
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
            Try Focusmo risk-free. If for some reason you're not completely
            satisfied, simply{" "}
            <Link
              href="/contact"
              className="text-blue-600 text-lg hover:text-blue-700 font-medium underline decoration-blue-300 decoration-2 underline-offset-2"
            >
              contact our support team
            </Link>{" "}
            within 30 days for a full refund.
          </p>
        </div>
      </div>
    </div>
  );
};

// Student discount component
const StudentDiscount = () => {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const { toast } = useToast();

  // Cache validation results
  const [validationCache, setValidationCache] = React.useState(new Map());

  const validateEmail = (email) => {
    if (validationCache.has(email)) {
      return validationCache.get(email);
    }

    const isValid =
      email.endsWith(".edu") ||
      email.includes(".ac.") ||
      email.includes(".edu.");

    setValidationCache(new Map(validationCache.set(email, isValid)));
    return isValid;
  };

  const handleStudentDiscount = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your university email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please use your university email address");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      posthog.capture(TrackingEvents.STUDENT_DISCOUNT_REQUESTED, {
        email_domain: email.split("@")[1],
        location: Locations.PRICING,
      });

      // Simulate API call with loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Verification email sent!",
        description: "Please check your inbox to get your discount code",
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Student discount error:", error);
      setError("Something went wrong. Please try again.");

      toast({
        title: "Error requesting student discount",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="student-discount"
      className=" flex items-center justify-between w-full max-w-3xl relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 shadow-sm p-8 mt-12"
    >
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Student Discount
          </h3>
        </div>

        <div className="grid  gap-8 items-center">
          <div>
            <div className="mb-6">
              <p className="text-lg text-gray-600 mb-2">
                We are committed to helping students and that’s why we offer a{" "}
                <span className="font-bold text-blue-600">
                  30% educational discount
                </span>
                . Just{" "}
                <Link
                  href="/contact"
                  className="text-blue-600 text-lg hover:text-blue-700 font-medium underline decoration-blue-300 decoration-2 underline-offset-2"
                >
                  send us a email
                </Link>{" "}
                using your university email.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* {!submitted ? (
        <form onSubmit={handleStudentDiscount} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="your.email@university.edu"
                className={cn(
                  "w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:ring-offset-2 transition-all duration-200",
                  error
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                )}
                disabled={isSubmitting}
              />
              {isSubmitting && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {isSubmitting ? "Verifying..." : "Get Student Discount"}
          </Button>
        </form>
      ) : (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Email Sent!</span>
          </div>
          <p className="text-green-600">
            Check your inbox for the verification link and discount code.
          </p>
        </div>
      )} */}
    </div>
  );
};

const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  const discount = originalPrice * (discountPercent / 100);
  return originalPrice - discount;
};

const PriceDisplay = ({
  originalPrice,
  discountPercent,
  isLifetime,
  type,
  isHighlighted,
  selectedDevices,
  setIsYearly,
  onDevicesChange = null,
}) => {
  const discountedPrice = calculateDiscountedPrice(
    originalPrice,
    discountPercent
  );

  // For yearly plans, show monthly price
  const isYearly = type === "yearly";
  const displayPrice = isYearly
    ? formatNumber(discountedPrice / 12)
    : formatNumber(discountedPrice);

  const yearlyPerMonthPruce = formatNumber(
    PRICING.YEARLY.DEVICES[2].PRICE / 12
  );
  const lifetimeDiscount = calculateLifetimeDiscount(selectedDevices);

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center flex-row justify-between w-full">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl md:text-5xl font-bold">
            ${displayPrice}
          </span>
          {!isLifetime && (
            <span className="text-base text-gray-600">/month</span>
          )}
        </div>
        {(isYearly || type === "monthly") && (
          <BillingSelector
            size="large"
            selected={isYearly ? "annually" : "monthly"}
            onSelect={(mode) => setIsYearly(mode === "annually")}
          />
        )}
        {isLifetime && onDevicesChange && (
          <DeviceSelectorForLifetime
            size="large"
            selected={selectedDevices}
            onSelect={onDevicesChange}
            devices={Object.keys(PRICING.LIFETIME_PRO.DEVICES).map((key) =>
              parseInt(key)
            )}
          />
        )}
      </div>

      {isYearly ? (
        <div className="text-base text-gray-600 mt-2">
          Billed ${formatNumber(discountedPrice)} yearly
        </div>
      ) : type === "monthly" ? (
        <div className="text-base text-gray-600 mt-2">
          or ${yearlyPerMonthPruce}/month in annual
        </div>
      ) : (
        selectedDevices > 1 && (
          <div className="text-base font-semibold text-green-600 mt-2">
            Save ${formatNumber(lifetimeDiscount)} ( $
            {formatNumber(lifetimeDiscount / selectedDevices)} per device)
          </div>
        )
      )}
    </div>
  );
};

const PricingCard = ({
  title,
  subtitle,
  price,
  features,
  buttonText,
  buttonAction,
  type,
  isPopular = false,
  isHighlighted = false,
  addNote = "",
  secondaryNote = "",
  selectedDevices,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleButtonClick = async () => {
    if (type === "free") {
      return;
    }

    const devices = type === "lifetime" ? selectedDevices : 1;

    // Track payment button click
    trackButtonClick(`purchase_${type}`, ButtonActions.PURCHASE, {
      plan_type: type,
      devices,
      is_highlighted: isHighlighted,
      is_popular: isPopular,
      location: Locations.PRICING,
    });

    setLoading(true);
    try {
      const response = await fetch(urlBase + "/api/create-payment/" + type, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          planType: type,
          devices,
        }),
      });

      if (!response.ok) throw new Error("Failed to create payment link");

      const { paymentUrl } = await response.json();

      // Track successful payment link creation
      posthog.capture(TrackingEvents.PAYMENT_INITIATED, {
        plan_type: type,
        success: true,
        devices,
        location: Locations.PRICING,
      });

      window?.open(paymentUrl, "_blank");
    } catch (error) {
      console.error("Payment link error:", error);

      // Track error
      posthog.capture(TrackingEvents.PAYMENT_ERROR, {
        plan_type: type,
        error_message: error.message,
        devices: type === "lifetime" ? selectedDevices : 2,
        location: Locations.PRICING,
      });

      toast({
        title: "Error creating payment link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative w-full flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm h-full ${
        isHighlighted
          ? "border-2 border-[#F7B955] bg-gradient-to-b from-[#FFF7EB]/30 to-white"
          : isPopular
          ? "border-2 border-blue-500 bg-gradient-to-b from-blue-50/30 to-white"
          : ""
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3 right-8 bg-[#F7B955] text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
          Best Value
        </div>
      )}
      {isPopular && (
        <div className="absolute -top-3 right-8 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
          Most Popular
        </div>
      )}

      <div className="p-4 md:p-8 flex flex-col h-full">
        <div className="flex-1">
          <h3
            className={`text-2xl font-bold leading-tight ${
              isHighlighted
                ? "text-[#D68A0C]"
                : isPopular
                ? "text-blue-600"
                : ""
            }`}
          >
            {title}
          </h3>
          <p className="text-lg text-muted-foreground mt-1">{subtitle}</p>

          <hr
            className={`mt-6 ${
              isHighlighted
                ? "border-[#D68A0C]/20"
                : isPopular
                ? "border-blue-500/20"
                : "border-gray-200"
            }`}
          />
          <div className="my-6">{price}</div>

          <div className="space-y-4">
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div
                    className={`rounded-full p-0.5 ${
                      isHighlighted ? "bg-[#F7B955]/10" : "bg-blue-50"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 border-2 rounded-full  ${
                        isHighlighted
                          ? "text-[#D68A0C] border-[#D68A0C]"
                          : "text-blue-500 border-blue-500"
                      }`}
                      fill="none"
                      strokeWidth="3"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col ">
                    {feature.title && (
                      <span className="text-base font-semibold">
                        {feature.title}
                      </span>
                    )}
                    {feature.desc && (
                      <span className="text-sm text-gray-500">
                        {feature.desc}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          {addNote && addNote}

          {type === "free" ? (
            <ButtonMainCTA
              type="small"
              size="lg"
              className="w-full"
              text="Download for macOS"
              href="download"
              location={Locations.PRICING}
            />
          ) : (
            <Button
              onClick={handleButtonClick}
              disabled={loading}
              className={`w-full py-6 text-lg ${
                isHighlighted
                  ? "bg-[#F7B955] hover:bg-[#D68A0C] text-white"
                  : isPopular
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "border-primary text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {loading ? "Please wait..." : buttonText}
            </Button>
          )}

          {secondaryNote && (
            <div className="text-sm text-gray-500 text-center mt-3">
              {secondaryNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function PricingCards2({ className = "" }) {
  const [selectedDevices, setSelectedDevices] = React.useState(1);
  const [isYearly, setIsYearly] = React.useState(true);

  const subscriptionPrice = isYearly
    ? PRICING.YEARLY.DEVICES[2]
    : PRICING.MONTHLY.DEVICES[2];

  // Calculate savings only if both prices exist
  const monthlySavings = React.useMemo(() => {
    const yearlyPrice = PRICING.YEARLY.DEVICES[2];
    const monthlyPrice = PRICING.MONTHLY.DEVICES[2];
    if (!yearlyPrice || !monthlyPrice) return 0;

    return ((monthlyPrice.PRICE - yearlyPrice.PRICE / 12) * 12).toFixed(2);
  }, [selectedDevices]);

  return (
    <div className="space-y-10 flex flex-col items-center">
      <div
        className={cn(
          "grid gap-8 grid-cols-1 md:grid-cols-2 max-w-5xl w-full mx-auto",
          className
        )}
      >
        {/* <PricingCard
          type="free"
          title="Free"
          subtitle="Perfect for basic needs"
          price={
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold">$0</span>
              </div>
              <div className="text-sm font-medium text-blue-500 mt-1">
                Free trial of Pro for 7 days
              </div>
            </div>
          }
          features={PLAN_FEATURES.FREE}
          buttonText="Download Now"
          secondaryNote="No credit card required"
        /> */}

        <PricingCard
          type="lifetime"
          title="Pro Lifetime"
          subtitle="Pay once, use forever"
          price={
            <PriceDisplay
              originalPrice={
                PRICING.LIFETIME_PRO.DEVICES[selectedDevices].PRICE
              }
              discountPercent={
                PRICING.LIFETIME_PRO.DEVICES[selectedDevices].DISCOUNT
              }
              isLifetime={true}
              type="lifetime"
              selectedDevices={selectedDevices}
              onDevicesChange={setSelectedDevices}
            />
          }
          selectedDevices={selectedDevices}
          features={PLAN_FEATURES.LIFETIME}
          buttonText={`Get Lifetime Access (${selectedDevices} devices)`}
          addNote=<p className="text-base text-gray-600 text-center mb-4 italic">
            This will support our development efforts ❤️
          </p>
          isHighlighted={true}
          //   secondaryNote={`${selectedDevices} devices`}
        />
        <PricingCard
          type={isYearly ? "yearly" : "monthly"}
          title="Pro Subscription"
          subtitle="Perfect for trying out Focusmo"
          price={
            <PriceDisplay
              originalPrice={subscriptionPrice.PRICE}
              discountPercent={subscriptionPrice.DISCOUNT}
              isLifetime={false}
              type={isYearly ? "yearly" : "monthly"}
              isHighlighted={false}
              setIsYearly={setIsYearly}
              selectedDevices={selectedDevices}
            />
          }
          features={PLAN_FEATURES.PRO}
          buttonText={isYearly ? "Subscribe Yearly" : "Subscribe Monthly"}
          addNote={
            <div className="text-base not-italic w-full text-center mb-2">
              Are you a student?{" "}
              <Button
                variant="link"
                className="text-blue-600 inline px-0 text-base hover:text-blue-800"
                onClick={() => {
                  const href = "#student-discount";
                  const element = document.querySelector(href);
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              >
                Get a discount
              </Button>
            </div>
          }
          isPopular={true}
          //   secondaryNote={
          //     isYearly ? "Billed annually, cancel anytime" : "Cancel anytime"
          //   }
        />
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-500 mb-10 -mt-10">
          Prices in USD. Taxes may apply outside US. Focusmo requires macOS 11+.
        </div>
        <ButtonMainCTA
          type="download_link"
          href="/download"
          location={Locations.PRICING}
          text={
            <>
              Or try Focusmo Pro for free for 3 days - no credit card required
              <ArrowRight className="flex-shrink-0 w-4 h-4 ml-2" />
            </>
          }
          className="text-blue-600 hover:text-blue-800 font-medium text-lg mb-6"
        />
      </div>

      {/* Money-back guarantee section */}
      <MoneyBackGuarantee />

      <StudentDiscount />
    </div>
  );
}
