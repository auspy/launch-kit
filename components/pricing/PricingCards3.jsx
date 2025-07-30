"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import ButtonMainCTAClient from "@/components/buttons/ButtonMainCTA.client";
import {
  trackDownloadButtonClick,
  trackButtonClick,
  ButtonActions,
  DownloadMethods,
  Locations,
} from "@/lib/tracking";
import posthog from "posthog-js";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import SeatsTooltip from "@/components/ui/SeatsTooltip";
import DodoPaymentsOverlay from "@/components/payments/DodoPaymentsOverlay";

// Pricing Constants
export const PRICING = {
  LIFETIME: {
    DEVICES: {
      1: {
        PRICE: 24.99,
      },
      2: {
        PRICE: 39.99,
      },
      5: {
        PRICE: 79.99,
      },
    },
    UPDATES_PERIOD: "1 year",
  },
  LIFETIME_ALL_UPDATES: {
    DEVICES: {
      1: {
        PRICE: 59.99, // ~2x of 1-year price
      },
      2: {
        PRICE: 89.99, // ~$45 per seat
      },
      5: {
        PRICE: 179.99, // ~$36 per seat
      },
    },
    UPDATES_PERIOD: "lifetime",
  },
  // COMMENTED OUT: Indian pricing with purchasing power parity (temporarily disabled)
  // IN_LIFETIME: {
  //   DEVICES: {
  //     1: {
  //       PRICE: 799, // ~$9.5 → ~58% off
  //       DISCOUNT: 0,
  //     },
  //     2: {
  //       PRICE: 1299, // ~$15.5 → ~57% off
  //       DISCOUNT: 20,
  //     },
  //     5: {
  //       PRICE: 2999, // ~$35.9 → ~55% off
  //       DISCOUNT: 32,
  //     },
  //   },
  //   UPDATES_PERIOD: "1 year",
  //   CURRENCY: "₹",
  // },

  // IN_LIFETIME_ALL_UPDATES: {
  //   DEVICES: {
  //     1: {
  //       PRICE: 1899, // ~$22.7 → ~50% off
  //       DISCOUNT: 0,
  //     },
  //     2: {
  //       PRICE: 2899, // ~$34.6 → ~52% off
  //       DISCOUNT: 20,
  //     },
  //     5: {
  //       PRICE: 5999, // ~$71.7 → ~52% off
  //       DISCOUNT: 33,
  //     },
  //   },
  //   UPDATES_PERIOD: "lifetime",
  //   CURRENCY: "₹",
  // },
};

// Helper function to calculate discount percentage
const calculateDiscount = (deviceCount, price, singleDevicePrice) => {
  if (deviceCount === 1) return 0;
  const fullPrice = singleDevicePrice * deviceCount;
  return Math.round(((fullPrice - price) / fullPrice) * 100);
};

// Features for each plan - reduced to 3 key points
const PLAN_FEATURES = [
  {
    title: "Pay once, own it forever",
    desc: "No subscription, yours forever",
  },
  {
    title: (deviceCount, _) =>
      `${deviceCount} ${
        deviceCount === 1 ? "Seat (device)" : "Seats (devices)"
      }`,
    desc: "Use on your selected number of Macs",
    hasTooltip: true,
  },
  {
    title: (_, updateType) =>
      updateType === "one_year"
        ? "Free updates for 1 year"
        : "Lifetime free updates",
    desc: (updateType) =>
      updateType === "one_year"
        ? "Free updates for 1 year"
        : "Lifetime free updates",
  },
];

// Free plan features comparison
const FREE_PLAN_FEATURES = [
  {
    title: "Unlimited Focus Sessions",
    available: true,
    desc: "Focus as long as you need - no time limits",
  },
  {
    title: "Unlimited Tasks",
    available: true,
    desc: "Create and manage unlimited tasks",
  },
  {
    title: "Basic Pomodoro Timer",
    available: true,
    desc: "25-minute focus sessions with breaks",
  },
  {
    title: "1 Day Analytics",
    available: true,
    desc: "Track your daily focus and productivity",
  },
  {
    title: "1 Workspace",
    available: true,
    desc: "One workspace to block distractions and launch apps in single click",
  },
  {
    title: "Easy Access Tools",
    available: true,
    desc: "Timeline, Floating Button, Menu Bar Mode, Global Shortcuts and more",
  },
  {
    title: "Advanced features for power users",
    available: false,
    desc: "Unlimited workspaces, advanced analytics, integrations, and more",
  },
];

// Updates tab selector component
const UpdatesSelector = ({ selected, onSelect }) => {
  return (
    <div className="inline-flex flex-col sm:flex-row items-center rounded-3xl sm:rounded-full border border-gray-200 bg-white shadow-sm p-1.5 w-fit sm:mb-6 gap-2 sm:gap-0">
      <Button
        variant="ghost"
        onClick={() => onSelect("free")}
        className={`rounded-full text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-4 sm:px-8 transition-all sm:flex-1 sm:min-w-0 w-full sm:w-auto ${
          selected === "free"
            ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
            : "text-gray-600 hover:bg-blue-50"
        }`}
      >
        Free Forever
      </Button>
      <Button
        variant="ghost"
        onClick={() => onSelect("one_year")}
        className={`rounded-full text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-4 sm:px-8 transition-all sm:flex-1 sm:min-w-0 w-full sm:w-auto ${
          selected === "one_year"
            ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
            : "text-gray-600 hover:bg-blue-50"
        }`}
      >
        Focusmo Pro
      </Button>
      {/* <Button
        variant="ghost"
        onClick={() => onSelect("lifetime")}
        className={`rounded-full text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-4 sm:px-8 transition-all sm:flex-1 sm:min-w-0 w-full sm:w-auto ${
          selected === "lifetime"
            ? "bg-red-500 text-white hover:bg-red-600 hover:text-white"
            : "text-gray-600 hover:bg-red-50"
        }`}
      >
        Lifetime free updates
      </Button>*/}
    </div>
  );
};

// Money-back guarantee component
const MoneyBackGuarantee = () => {
  return (
    <div
      id="money-back-guarantee"
      className="relative w-full max-w-3xl overflow-hidden bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 shadow-sm px-8 py-10"
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
            Try our product risk-free. If for some reason you're not completely
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
  return (
    <div
      id="student-discount"
      className="flex items-center justify-between w-full max-w-3xl relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 shadow-sm p-8 mt-12"
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

        <div className="grid gap-8 items-center">
          <div>
            <div className="mb-6">
              <p className="text-lg text-gray-600 mb-2">
                We are committed to helping students and that's why we offer a{" "}
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
    </div>
  );
};

// Low-income countries discount component
const LowIncomeDiscount = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      id="low-income-discount"
      className="flex items-center justify-between w-full max-w-3xl relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm p-8"
    >
      <div className="relative w-full">
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
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Fair Pricing for Everyone
          </h3>
        </div>

        <div className="grid gap-6 items-center">
          <div>
            <p className="text-lg text-gray-600 mb-4">
              If you're from a low-income country and can't afford Focusmo at
              full price, email us at{" "}
              <Link
                href="/contact"
                className="text-blue-600 text-lg hover:text-blue-700 font-medium underline decoration-blue-300 decoration-2 underline-offset-2"
              >
                admin@focusmo.app
              </Link>{" "}
              or just use the chatbot for a fair discount based on Purchasing
              Power Parity. Just mention your country and attach any reasonable
              proof.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              <strong>Important:</strong> The email you use to contact us must
              match the email you'll use for purchase, as we'll send the
              discount code there for verification.
            </p>

            <p className="text-gray-600 my-2 mb-4 italic">
              Our payment provider doesn't support regional pricing yet, but
              we'll help you out manually.
            </p>

            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                ✅ View acceptable documentation
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Button>

              {isOpen && (
                <div className="mt-4 pl-4 border-l-2 border-blue-200">
                  <p className="text-gray-700 mb-2">
                    Acceptable "Proofs" (anything that doesn't invade your
                    privacy):
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>
                      Screenshot of another service showing regional pricing
                      (Spotify, Steam, Adobe, etc.)
                    </li>
                    <li>Student ID or enrollment proof</li>
                    <li>Document showing country (blur sensitive info)</li>
                    <li>Government benefit or scholarship letter</li>
                    <li>Pay slip (with private details blurred)</li>
                    <li>Mention of PPP or cost from platforms like Numbeo</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pricing Card component
const PricingCard = ({
  deviceCount,
  price,
  discount,
  buttonText,
  isHighlighted = false,
  updateType,
  beforeButtonNote,
  animationClass = "",
  currency = "$",
  locale = "default",
  deviceId = null,
  fromApp = false,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const { openCheckout } = DodoPaymentsOverlay();

  const handleButtonClick = async () => {
    // Track payment button click with enhanced attribution if available
    trackButtonClick(`purchase_lifetime`, ButtonActions.PURCHASE, {
      devices: deviceCount,
      is_highlighted: isHighlighted,
      location: Locations.PRICING,
      ...(deviceId && { device_id: deviceId }),
      ...(fromApp && { from_app: fromApp }),
    });

    setLoading(true);
    try {
      await openCheckout({
        planType: updateType,
        devices: deviceCount,
        locale: locale === "in" ? "in" : "default",
        deviceId,
        fromApp,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      // Error handling is done in the overlay component
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative w-full flex flex-col rounded-3xl border bg-white shadow-sm h-full transition-all duration-300 ${animationClass} ${
        isHighlighted
          ? "border-blue-500 ring-2 ring-blue-500 shadow-xl "
          : isHovering
          ? "border-blue-200 shadow-md transform scale-[1.01]"
          : "border-gray-200"
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative h-full">
        {isHighlighted && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            Most Popular
          </div>
        )}

        <div className="flex flex-col h-full py-6 px-4 md:p-6">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h3
                  className={`text-xl font-bold ${
                    isHighlighted ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {deviceCount} {deviceCount === 1 ? "device" : "devices"}
                </h3>

                <div className="mt-2">
                  <div className="flex items-baseline">
                    <span
                      className={`text-4xl font-bold ${
                        isHighlighted ? "text-blue-600" : "text-gray-900"
                      }`}
                    >
                      {currency}
                      {formatNumber(price)}
                    </span>
                  </div>
                  {/* Per-Mac pricing for multi-device plans */}
                  {deviceCount > 1 && (
                    <div className="mt-1">
                      <span className="text-sm text-gray-500">
                        ≈ {currency}
                        {formatNumber(price / deviceCount)} / Mac
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {discount > 0 && (
                <div className="text-[10px] md:text-xs mt-1 border bg-emerald-50 border-emerald-600 rounded-full px-1 md:px-2 py-1 font-medium text-emerald-600">
                  Save {discount}%
                </div>
              )}
            </div>

            <div className="h-px w-full bg-gray-100 my-4"></div>

            <ul className={cn("space-y-4 ", "mb-6")}>
              {PLAN_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="rounded-full border-2 border-blue-500 bg-blue-50 p-1 flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-blue-500"
                      fill="none"
                      strokeWidth="4"
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
                  <div className="flex flex-col relative">
                    {feature.hasTooltip ? (
                      <div className=" group">
                        <p className="text-base font-medium text-gray-800 border-b border-dotted border-gray-400 cursor-help hover:text-gray-600 hover:border-gray-600 transition-colors inline-block">
                          {typeof feature.title !== "string"
                            ? feature.title(deviceCount, updateType)
                            : feature.title}
                        </p>
                        <SeatsTooltip
                          deviceCount={deviceCount}
                          position={deviceCount === 1 ? "right" : "left"}
                        />
                      </div>
                    ) : (
                      <p className="text-base font-medium text-gray-800">
                        {typeof feature.title !== "string"
                          ? feature.title(deviceCount, updateType)
                          : feature.title}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={"mt-auto"}>
            <Button
              onClick={handleButtonClick}
              disabled={loading}
              className={`w-full py-2.5 px-4 text-sm font-medium transition-all duration-300 rounded-lg ${
                isHighlighted
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-[0.99] hover:brightness-105 active:scale-[0.98]"
                  : "border hover:scale-[0.99] active:scale-[0.98] border-primary/30 bg-white text-primary/90 hover:text-white hover:bg-primary hover:border-primary/40"
              }`}
            >
              {loading ? "Please wait..." : buttonText}
              {!loading && <ArrowRight className="ml-2 h-4 w-4 inline-block" />}
            </Button>
            <div
              className={cn(
                "text-xs font-semibold text-gray-500 text-center mt-3",
                beforeButtonNote ? "mt-0" : "mt-3"
              )}
            >
              {beforeButtonNote
                ? beforeButtonNote
                : deviceCount === 1 && "For users with a single Mac"}
              {deviceCount === 2 && "For users with a separate work Mac"}
              {deviceCount === 5 && "For small teams or multi-device setups"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Free Plan Card component
const FreePlanCard = ({ className = "", deviceId = null, fromApp = false }) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleDownloadClick = async () => {
    trackDownloadButtonClick(DownloadMethods.DIRECT, Locations.PRICING, {
      ...(deviceId && { device_id: deviceId }),
      ...(fromApp && { from_app: fromApp }),
    });

    setLoading(true);
    try {
      // Redirect to download page
      window.location.href = "/download";
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "Failed to start download. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-6xl mx-auto px-4", className)}>
      <div className="relative w-full rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Free Plan
              </h3>
              <p className="text-lg text-gray-600">
                Core focus features free forever - no credit card required
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="text-4xl font-bold text-blue-600 mb-2">$0</div>
              <div className="text-sm text-gray-500">Forever free</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FREE_PLAN_FEATURES.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {feature.available ? (
                    <div className="rounded-full border-2 border-blue-500 bg-blue-50 p-1">
                      <svg
                        className="w-3 h-3 text-blue-500"
                        fill="none"
                        strokeWidth="4"
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
                  ) : (
                    <div className="rounded-full border-2 border-red-500 bg-red-50 p-1">
                      <svg
                        className="w-3 h-3 text-red-500"
                        fill="none"
                        strokeWidth="4"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M18 6L6 18M6 6l12 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-base font-medium ${
                      feature.available ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {feature.title}
                  </p>
                  <p
                    className={`text-sm ${
                      feature.available ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                Includes 7-day trial of Pro features. No credit card required.
              </p>
            </div>
            <ButtonMainCTAClient
              disabled={loading}
              type="large"
              location={Locations.PRICING}
              text={
                <>
                  Get Focusmo Free
                  <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                </>
              }
              // className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-[0.99] hover:brightness-105 active:scale-[0.98] px-8 py-3 text-base font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PricingCards3({
  className = "",
  locale = "default",
  deviceId = null,
  fromApp = false,
}) {
  const [updateType, setUpdateType] = React.useState("free");
  const [animationDirection, setAnimationDirection] = React.useState("right");
  const [isChanging, setIsChanging] = React.useState(false);
  const router = useRouter();

  const handleSwitchToStandardPricing = () => {
    // Save preference in both cookie and localStorage for robustness
    setCookie("preferStandardPricing", "true", { maxAge: 60 * 60 * 24 });
    localStorage.setItem("preferStandardPricing", "true");

    // Redirect to standard pricing page
    router.push("/pricing");
  };

  // Select pricing data based on locale
  const getPricingData = () => {
    // COMMENTED OUT: Indian pricing logic (temporarily disabled)
    // if (locale === "in") {
    //   return updateType === "one_year"
    //     ? PRICING.IN_LIFETIME
    //     : PRICING.IN_LIFETIME_ALL_UPDATES;
    // }
    return updateType === "one_year"
      ? PRICING.LIFETIME
      : PRICING.LIFETIME_ALL_UPDATES;
  };

  const pricingData = getPricingData();
  const currencySymbol = pricingData.CURRENCY || "$";

  const handleUpdateTypeChange = (type) => {
    if (type !== updateType) {
      setAnimationDirection(
        type === "free"
          ? "left"
          : type === "one_year"
          ? updateType === "free"
            ? "right"
            : "left"
          : "right"
      );
      setIsChanging(true);
      setTimeout(() => {
        setUpdateType(type);
        setTimeout(() => setIsChanging(false), 50);
      }, 300);
    }
  };

  const getAnimationClass = (index) => {
    if (!isChanging) return "";

    const baseAnimation = "transition-all duration-300 ease-in-out";
    const slideOutClasses = {
      left: "translate-x-[-30px] opacity-0",
      right: "translate-x-[30px] opacity-0",
    };

    return `${baseAnimation} ${slideOutClasses[animationDirection]}`;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center mb-8 w-full max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Pricing</h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl text-center mb-6">
          We believe everyone deserves access to tools that help them focus and
          feel in control. That’s why the core of Focusmo will always be free.{" "}
          <Link
            href="/promise"
            className="text-blue-600 text-base hover:text-blue-700 font-medium underline decoration-blue-300 decoration-2 underline-offset-2"
            onClick={() =>
              trackButtonClick("promise_page", ButtonActions.NAVIGATE, {
                location: Locations.PRICING,
                context: "read promise",
              })
            }
          >
            Read our promise
          </Link>{" "}
        </p>

        <UpdatesSelector
          selected={updateType}
          onSelect={handleUpdateTypeChange}
        />

        {/* Informative notice for lifetime option */}
        {updateType === "lifetime" && (
          <div className="w-full max-w-2xl mt-3 md:my-0 lg:max-w-7xl mx-auto mb-0 md:mb-3 px-2 py-3 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Limited Time Offer
                </p>
                <p className="text-sm text-blue-700">
                  To celebrate Focusmo 5.0, we're offering lifetime updates
                  plans. These offers expire on July 14th, 2025.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render Free Plan Card or Pricing Cards based on selection */}
      {updateType === "free" ? (
        <FreePlanCard
          className={cn("mb-6", className)}
          deviceId={deviceId}
          fromApp={fromApp}
        />
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 w-full max-w-6xl mx-auto gap-5 px-4 mb-6",
            className
          )}
        >
          <div className="w-full">
            <PricingCard
              beforeButtonNote={null}
              deviceCount={1}
              price={pricingData.DEVICES[1].PRICE}
              discount={calculateDiscount(
                1,
                pricingData.DEVICES[1].PRICE,
                pricingData.DEVICES[1].PRICE
              )}
              buttonText={`Buy a license for 1 Mac`}
              updateType={updateType}
              animationClass={getAnimationClass(0)}
              currency={currencySymbol}
              locale={locale}
              deviceId={deviceId}
              fromApp={fromApp}
            />
          </div>

          <div className="w-full transform md:scale-[1.03] z-10">
            <PricingCard
              deviceCount={2}
              price={pricingData.DEVICES[2].PRICE}
              discount={calculateDiscount(
                2,
                pricingData.DEVICES[2].PRICE,
                pricingData.DEVICES[1].PRICE
              )}
              buttonText={`Buy a license for 2 Macs`}
              isHighlighted={true}
              updateType={updateType}
              animationClass={getAnimationClass(1)}
              currency={currencySymbol}
              locale={locale}
              deviceId={deviceId}
              fromApp={fromApp}
            />
          </div>

          <div className="w-full">
            <PricingCard
              deviceCount={5}
              price={pricingData.DEVICES[5].PRICE}
              discount={calculateDiscount(
                5,
                pricingData.DEVICES[5].PRICE,
                pricingData.DEVICES[1].PRICE
              )}
              buttonText={`Buy a license for 5 Macs`}
              updateType={updateType}
              animationClass={getAnimationClass(2)}
              currency={currencySymbol}
              locale={locale}
              deviceId={deviceId}
              fromApp={fromApp}
            />
          </div>
        </div>
      )}

      <div className="text-center w-full max-w-3xl mx-auto mt-2 mb-20">
        <p className="text-base text-gray-500">
          Prices in USD. Taxes may apply outside US. Requires macOS 13 or later.
          {/* COMMENTED OUT: Indian pricing text and switch button (temporarily disabled)
          Prices in {locale === "in" ? "INR" : "USD"}. Taxes may apply
          {locale === "in" ? " in India" : " outside US"}. Requires macOS 13 or
          later.
          {locale === "in" && (
            <button
              onClick={handleSwitchToStandardPricing}
              className="text-xs text-blue-500 hover:text-blue-700 underline"
            >
              Switch to USD pricing
            </button>
          )}
          */}
        </p>
        <p className="text-base text-gray-500 mb-6">
          Have questions or need more seats?{" "}
          <Link
            href={`/contact`}
            className="text-base text-gray-700 font-medium no-underline"
          >
            Contact us
          </Link>
        </p>
        {/* <ButtonMainCTA
          type="download_link"
          as="link"
          href="/download"
          location={Locations.PRICING}
          text={
            <>
              Try Focusmo for free for 7 days - no credit card required
              <ArrowRight className="flex-shrink-0 w-4 h-4 ml-2" />
            </>
          }
          className="text-blue-600 hover:text-blue-800 font-medium text-lg mb-10"
        /> */}
      </div>
      <div className="space-y-8">
        {/* Money-back guarantee section */}
        <MoneyBackGuarantee />

        {/* Student discount section */}
        <StudentDiscount />

        {/* Low-income countries discount section, hide for existing PPP */}
        {/* {locale !== "in" && <LowIncomeDiscount />} */}
      </div>
    </div>
  );
}
