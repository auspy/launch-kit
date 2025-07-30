"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { ButtonMainCTAClient as ButtonMainCTA } from "@/components/buttons/ButtonMainCTA";
import {
  trackButtonClick,
  ButtonActions,
  TrackingEvents,
  Locations,
} from "@/lib/tracking";
import posthog from "posthog-js";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import SeatsTooltip from "@/components/ui/SeatsTooltip";
import DodoPaymentsOverlay from "@/components/payments/DodoPaymentsOverlay";

// Pricing Constants
export const PRICING = {
  PERSONAL: {
    SEATS: 2,
    PRICE: 44.99,
    DISCOUNT: 0,
    UPDATES_PERIOD: "one_year",
  },
  LIMITED_LIFETIME: {
    SEATS: 2,
    PRICE: 89.99,
    DISCOUNT: 0,
    UPDATES_PERIOD: "lifetime",
  },
  TEAM: {
    SEATS: 5,
    MIN_SEATS: 5,
    MAX_SEATS: 100,
    PRICE_PER_SEAT: 29.99,
    DISCOUNT: 32,
    UPDATES_PERIOD: "one_year",
  },
  BELIEVER: {
    SEATS: 5,
    PRICE: 149.99,
    DISCOUNT: 33,
    UPDATES_PERIOD: "lifetime",
  },
  // COMMENTED OUT: Indian pricing with purchasing power parity (temporarily disabled)
  // IN_PERSONAL: {
  //   SEATS: 2,
  //   PRICE: 1299, // ~$15.5 → ~57% off
  //   DISCOUNT: 20,
  //   UPDATES_PERIOD: "one_year",
  //   CURRENCY: "₹",
  // },
  // IN_TEAM: {
  //   SEATS: 5,
  //   MIN_SEATS: 5,
  //   MAX_SEATS: 100,
  //   PRICE_PER_SEAT: 599, // ~$7.2 per seat → ~55% off
  //   DISCOUNT: 32,
  //   UPDATES_PERIOD: "one_year",
  //   CURRENCY: "₹",
  // },
  // IN_BELIEVER: {
  //   SEATS: 5,
  //   PRICE: 5999, // ~$71.7 → ~52% off
  //   DISCOUNT: 33,
  //   UPDATES_PERIOD: "lifetime",
  //   CURRENCY: "₹",
  // },
};

// Features for each plan
const getFeatures = (planType, planData, seatCount, currency) => {
  const baseFeatures = [];

  // Add seat information based on plan type
  if (planType === "team") {
    const totalPrice = planData.PRICE_PER_SEAT * seatCount;
    baseFeatures.push({
      title: "Seats",
      desc: `${currency}${totalPrice.toFixed(2)} / once`,
      isSeatsCounter: true,
      seatCount: seatCount,
      minSeats: planData.MIN_SEATS,
      maxSeats: planData.MAX_SEATS,
    });
  } else {
    baseFeatures.push({
      title: `${planData.SEATS} ${
        planData.SEATS === 1 ? "seat (device)" : "seats (devices)"
      }`,
      desc: "Use on your selected number of Macs",
    });
  }

  // Add update period information
  baseFeatures.push({
    title:
      planData.UPDATES_PERIOD === "one_year"
        ? "Free updates for 1 year"
        : "Lifetime free updates",
    desc:
      planData.UPDATES_PERIOD === "one_year"
        ? "Free updates for 1 year"
        : "Lifetime free updates",
  });

  // Add common feature
  baseFeatures.push({
    title: "Pay once, use forever",
    desc: "No subscription, yours forever",
  });

  // Add plan-specific features
  if (planType === "team") {
    baseFeatures.push(
      {
        title: "Team stats",
        desc: "Coming soon",
        comingSoon: true,
      },
      {
        title: "High priority support",
        desc: "Priority customer support",
      }
    );
  } else if (planType === "believer") {
    baseFeatures.push({
      title: "Support development",
      desc: "Help us build amazing features",
    });
  }

  return baseFeatures;
};

// Updates tab selector component
const UpdatesSelector = ({ selected, onSelect }) => {
  return (
    <div className="inline-flex flex-col sm:flex-row items-center rounded-3xl sm:rounded-full border border-gray-200 bg-white shadow-sm p-1.5 w-fit sm:mb-6 gap-2 sm:gap-0">
      <Button
        variant="ghost"
        onClick={() => onSelect("one_year")}
        className={`rounded-full text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-4 sm:px-8 transition-all w-full sm:w-auto ${
          selected === "one_year"
            ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
            : "text-gray-600 hover:bg-blue-50"
        }`}
      >
        <div className="flex flex-col items-center">
          <span>Focusmo Pro</span>
          <span className="text-xs opacity-75">For professionals</span>
        </div>
      </Button>
      <Button
        variant="ghost"
        onClick={() => onSelect("lifetime")}
        className={`rounded-full text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-4 sm:px-8 transition-all w-full sm:w-auto ${
          selected === "lifetime"
            ? "bg-orange-500 text-white hover:bg-orange-600 hover:text-white"
            : "text-gray-600 hover:bg-orange-50"
        }`}
      >
        <div className="flex flex-col items-center">
          <span>Focusmo Believer</span>
          <span className="text-xs opacity-75">For supporters</span>
        </div>
      </Button>
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
                  50% educational discount
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

// Believer License Section component
const BelieverLicenseSection = ({
  currency,
  locale,
  deviceId,
  fromApp,
  believerData,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const { openCheckout } = DodoPaymentsOverlay();

  const handleBelieverLicenseClick = async () => {
    // Track believer license click
    trackButtonClick(`purchase_believer`, ButtonActions.PURCHASE, {
      devices: believerData.SEATS,
      location: Locations.PRICING,
      plan_type: "believer",
      ...(deviceId && { device_id: deviceId }),
      ...(fromApp && { from_app: fromApp }),
    });

    setLoading(true);
    try {
      await openCheckout({
        planType: "believer",
        devices: believerData.SEATS,
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
    <div className="text-center w-full max-w-3xl mx-auto">
      <p className="text-lg text-gray-600 mb-2 font-medium">
        Love Focusmo? The{" "}
        <button
          onClick={handleBelieverLicenseClick}
          disabled={loading}
          className={cn(
            "font-bold text-lg text-gray-800 hover:text-blue-600 decoration-2 underline-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            loading ? "" : "hover:underline"
          )}
        >
          {loading ? "Loading..." : `Believer License`}
        </button>{" "}
        gives you lifetime updates plus {believerData.SEATS} seats.
      </p>
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
  isTeamLicense = false,
  planType = "personal",
  planData = {},
  showBanner = true,
  seatsSelection = false,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [seatCount, setSeatCount] = React.useState(deviceCount);
  const { openCheckout } = DodoPaymentsOverlay();

  const handleButtonClick = async () => {
    // Track payment button click with enhanced attribution if available
    trackButtonClick(`purchase_${planType}`, ButtonActions.PURCHASE, {
      devices: planType === "team" ? seatCount : planData.SEATS,
      is_highlighted: isHighlighted,
      location: Locations.PRICING,
      plan_type: planType,
      ...(deviceId && { device_id: deviceId }),
      ...(fromApp && { from_app: fromApp }),
    });

    setLoading(true);
    try {
      await openCheckout({
        planType: planType === "believer" ? "lifetime" : updateType,
        devices: planType === "team" ? seatCount : planData.SEATS,
        locale: locale === "in" ? "in" : "default",
        deviceId,
        fromApp,
        seatCount: planType === "team" ? seatCount : undefined,
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
        {isHighlighted && showBanner && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            Limited Time Offer
          </div>
        )}

        <div className="flex flex-col h-full p-6">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="mb-2">
                  <div className="flex items-baseline">
                    <h3
                      className={` text-4xl md:text-[40px] font-bold my-3 ${
                        isHighlighted ? "text-blue-600" : "text-gray-900"
                      }`}
                    >
                      {currency}
                      {formatNumber(
                        planType === "team" ? planData.PRICE_PER_SEAT : price
                      )}
                    </h3>
                    <span className="text-gray-500 ml-2 text-base">
                      {planType === "team" ? "/ seat" : " / once"}
                    </span>
                  </div>
                </div>

                <h4
                  className={`text-xl font-semibold  ${
                    isHighlighted ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {planType === "personal"
                    ? "Personal License"
                    : planType === "team"
                    ? "Team License"
                    : "Believer License"}
                </h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  {planType === "personal"
                    ? "For personal and work computers"
                    : planType === "team"
                    ? `For orgs and teams. Min. ${
                        planData.MIN_SEATS || 5
                      } seats.`
                    : "For supporters who love Focusmo"}
                </p>
              </div>
              {discount > 0 && (
                <div className="text-xs mt-1 border bg-emerald-50 border-emerald-600 rounded-full px-2 py-1 font-medium text-emerald-600">
                  Save {discount}%
                </div>
              )}
            </div>

            <div className="h-px w-full bg-gray-100 my-4"></div>

            <ul className={cn("space-y-4 ", "mb-6")}>
              {getFeatures(planType, planData, seatCount, currency).map(
                (feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {feature.isSeatsCounter ? (
                      // Special styling for seat counter with hover tooltip
                      <>
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
                        <div className="flex items-center justify-between w-full relative">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setSeatCount(
                                  Math.max(feature.minSeats || 1, seatCount - 1)
                                )
                              }
                              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={seatCount <= (feature.minSeats || 1)}
                            >
                              −
                            </button>
                            <span className="font-medium text-gray-800 min-w-[20px] text-center">
                              {feature.seatCount || seatCount}
                            </span>
                            <button
                              onClick={() =>
                                setSeatCount(
                                  Math.min(
                                    feature.maxSeats || 100,
                                    seatCount + 1
                                  )
                                )
                              }
                              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={seatCount >= (feature.maxSeats || 100)}
                            >
                              +
                            </button>
                            <div className="relative group">
                              <span className="text-base font-medium text-gray-800 border-b border-dotted border-gray-400 cursor-help hover:text-gray-600 hover:border-gray-600 transition-colors">
                                Seats
                              </span>
                              <SeatsTooltip
                                deviceCount={feature.seatCount || seatCount}
                                position="center"
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            {feature.desc}
                          </span>
                        </div>
                      </>
                    ) : (
                      // Regular feature styling
                      <>
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
                          {feature.title.includes("seat") ? (
                            <div className="relative group">
                              <p className="text-base font-medium text-gray-800 border-b border-dotted border-gray-400 cursor-help hover:text-gray-600 hover:border-gray-600 transition-colors inline-block">
                                {feature.title}
                              </p>
                              <SeatsTooltip
                                deviceCount={
                                  planType === "team"
                                    ? seatCount
                                    : planData.SEATS
                                }
                                position="left"
                              />
                            </div>
                          ) : (
                            <p className="text-base font-medium text-gray-800">
                              {feature.title}
                              {feature.comingSoon && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  Coming soon
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </li>
                )
              )}
            </ul>

            {/* Optional renewal note for plans with 1 year updates */}
            {/* {planData.UPDATES_PERIOD === "one_year" && !isTeamLicense && (
              <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-100/80 rounded-lg">
                <p className="text-xs">
                  Optional renewal for another year at{" "}
                  {currency === "₹" ? "₹1299" : "$29"}. Renew to get the latest
                  updates or keep using the version you have forever.
                </p>
              </div>
            )} */}
            {planType === "limited_lifetime" && (
              <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-100/80 rounded-lg">
                <p className="text-xs">
                  To celebrate Focusmo 5.0, we're offering a temporary lifetime
                  deal. This is a one-time offer and will not be available after
                  14th July 2025.
                </p>
              </div>
            )}
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
            {beforeButtonNote && (
              <div className="text-xs font-semibold text-gray-500 text-center mt-3">
                {beforeButtonNote}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PricingCards4({
  className = "",
  locale = "default",
  deviceId = null,
  fromApp = false,
}) {
  const updateType = "one_year";
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

  // Get pricing data for all plans based on locale
  const getPricingData = () => {
    // COMMENTED OUT: Indian pricing logic (temporarily disabled)
    // if (locale === "in") {
    //   return {
    //     personal: PRICING.IN_PERSONAL,
    //     team: PRICING.IN_TEAM,
    //     believer: PRICING.IN_BELIEVER,
    //   };
    // }
    return {
      personal: PRICING.PERSONAL,
      limited_lifetime: PRICING.LIMITED_LIFETIME,
      team: PRICING.TEAM,
      believer: PRICING.BELIEVER,
    };
  };

  const allPricingData = getPricingData();
  const currencySymbol = allPricingData.personal.CURRENCY || "$";

  const handleUpdateTypeChange = (type) => {
    if (type !== updateType) {
      setAnimationDirection(type === "one_year" ? "left" : "right");
      setIsChanging(true);
      setTimeout(() => {
        // setUpdateType(type);
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
          Focusmo comes with a 7-day trial to explore all the features it
          provides and evaluate its usefulness. After the trial period ends, you
          can continue using free features forever, or purchase a license to
          unlock all premium features.
        </p>

        {/* <UpdatesSelector
          selected={updateType}
          onSelect={handleUpdateTypeChange}
        /> */}
      </div>

      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-2 w-full max-w-4xl mx-auto gap-6 px-4 mb-10",
          className
        )}
      >
        <div className="w-full">
          <PricingCard
            beforeButtonNote={null}
            deviceCount={allPricingData.personal.SEATS}
            price={allPricingData.personal.PRICE}
            discount={allPricingData.personal.DISCOUNT}
            buttonText={`Buy Personal License`}
            updateType={allPricingData.personal.UPDATES_PERIOD}
            animationClass={getAnimationClass(0)}
            currency={currencySymbol}
            locale={locale}
            deviceId={deviceId}
            fromApp={fromApp}
            isTeamLicense={false}
            planType="personal"
            planData={allPricingData.personal}
            isHighlighted={false}
            showBanner={false}
            seatsSelection={allPricingData.personal.SEATS_SELECTION}
          />
        </div>
        <div className="w-full">
          <PricingCard
            beforeButtonNote={null}
            deviceCount={allPricingData.limited_lifetime.SEATS}
            price={allPricingData.limited_lifetime.PRICE}
            discount={allPricingData.limited_lifetime.DISCOUNT}
            buttonText={`Buy Lifetime License`}
            updateType={allPricingData.limited_lifetime.UPDATES_PERIOD}
            animationClass={getAnimationClass(0)}
            currency={currencySymbol}
            locale={locale}
            deviceId={deviceId}
            fromApp={fromApp}
            isTeamLicense={false}
            planType="limited_lifetime"
            planData={allPricingData.limited_lifetime}
            isHighlighted={true}
          />
        </div>

        {/* <div className="w-full">
          <PricingCard
            deviceCount={allPricingData.team.SEATS}
            price={allPricingData.team.PRICE_PER_SEAT}
            discount={allPricingData.team.DISCOUNT}
            buttonText={`Buy Team License`}
            isHighlighted={false}
            updateType="team"
            animationClass={getAnimationClass(1)}
            currency={currencySymbol}
            locale={locale}
            deviceId={deviceId}
            fromApp={fromApp}
            isTeamLicense={true}
            planType="team"
            planData={allPricingData.team}
          />
        </div> */}
      </div>

      {/* Love Focusmo section with clickable Believer License */}
      {/* <BelieverLicenseSection
        currency={currencySymbol}
        locale={locale}
        deviceId={deviceId}
        fromApp={fromApp}
        believerData={allPricingData.believer}
      /> */}
      {/* <hr className="w-10 my-3" /> */}
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
