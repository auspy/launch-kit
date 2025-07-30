"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { urlBase } from "@/constants";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "lucide-react";
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

const DEVICE_OPTIONS = {
  2: {
    description: "For personal use",
  },
  4: {
    description: "For all your devices",
  },
  10: {
    description: "For teams & workgroups",
  },
};

// Pricing Constants
export const PRICING = {
  FREE: {
    PRICE: 0,
    TRIAL_DAYS: 7,
  },
  MONTHLY: {
    DEVICES: {
      2: {
        PRICE: 3.99,
        DISCOUNT: 25, // To get to $3 exactly
      },
      4: {
        PRICE: 7,
        DISCOUNT: 25, // To get to $6 exactly
      },
      10: {
        PRICE: 16,
        DISCOUNT: 25, // To get to $15 exactly
      },
    },
  },
  YEARLY: {
    DEVICES: {
      2: {
        PRICE: 24,
        DISCOUNT: 17, // To get to $19.9
      },
      4: {
        PRICE: 40,
        DISCOUNT: 17, // To get to $33
      },
      10: {
        PRICE: 80,
        DISCOUNT: 17, // To get to $66
      },
    },
  },
  LIFETIME_PRO: {
    DEVICES: {
      2: {
        PRICE: 60,
        DISCOUNT: 40, // To get to $35
      },
      4: {
        PRICE: 99.99,
        DISCOUNT: 40, // To get to $60
      },
      10: {
        PRICE: 200,
        DISCOUNT: 40, // To get to $120
      },
    },
    UPDATES_PERIOD: "1 year",
  },
};

// Plan Features
const ALL_FEATURES = [
  {
    freename: "Floating Timer",
    freeinfo: "(25-min limit)",
    basicname: "Floating Timer",
    proname: "Floating Timer",
  },
  // {
  //   freename: "Session Limit",
  //   freeinfo: "(5 sessions/day)",
  //   basicname: "1 Device per License",
  //   proname: (devices) => `${devices} Devices per License`,
  // },
  {
    basicname: "Basic Statistics",
    proname: "Advanced Statistics",
    basicinfo: "(1 day limit)",
    proinfo: "(Unlimited)",
  },
  {
    basicname: "Pomodoro Timer - Custom session and break durations",
    proname: "Pomodoro Timer - Custom session and break durations",
    basicinfo: null,
  },
  {
    freename: "Quick Access Panel: Spotlight-style Command Bar",
    proname: "Quick Access Panel: Spotlight-style Command Bar",
  },
  {
    freename: "Global Keyboard Shortcuts",
    proname: "Global Keyboard Shortcuts",
  },
  {
    // freename: "Custom Themes",
    // freeinfo: false,
    basicname: "Progress Bar Styles",
    proname: "Progress Bar & Timer Styles",
    basicinfo: "",
    proinfo: "",
  },
  {
    basicname: "Color Customization",
    proname: "Color Customization",
    basicinfo: false,
    proinfo: "",
  },
  {
    freename: "Upgrade Popups",
  },
  {
    freename: "Compact Mode: Menubar-only + Dock-free",
    proname: "Compact Mode: Menubar-only + Dock-free",
    isNew: true,
  },
  {
    proname: "Sync between devices",
    isNew: true,
  },
  {
    proname: "Daily Reminders",
    isNew: true,
  },

  {
    freename: "Notifications",
    proname: "Notification Styles",
    proinfo: "(+ fullscreen mode)",
    isNew: true,
  },
  {
    proname: "Block Apps & Websites",
    comingSoon: true,
  },
  {
    freename: "Weekly Updates",
    proname: "Weekly Updates",
  },
  {
    proname: "Experimental Features",
  },
];

export const FEATURES = {
  FREE: "free",
  MONTHLY: "pro",
  YEARLY: "pro",
  LIFETIME_PRO: "pro",
};

const FeatureText = ({ feature, plan, selectedDevices }) => {
  const name = feature[`${plan}name`];
  const info = feature[`${plan}info`];
  const nameText = typeof name === "function" ? name(selectedDevices) : name;
  const updatedText = feature[`${plan}updated`];
  const isNew = feature.isNew;
  const comingSoon = feature.comingSoon;
  if (info === false) {
    return <span className="text-gray-400  line-through">{nameText}</span>;
  }

  const infoText = typeof info === "function" ? info(selectedDevices) : info;

  return (
    <div className="flex items-center gap-0.5">
      <span>{nameText}</span>
      {infoText && (
        <span className="text-xs text-gray-500 ml-1 mt-0.5">{infoText}</span>
      )}
      {isNew && (
        <span className="ml-1 text-xs bg-accent text-white px-1 py-0.5 rounded">
          New
        </span>
      )}
      {comingSoon && (
        <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 py-0.5 rounded">
          Coming Soon
        </span>
      )}
      {updatedText && (
        <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
          Updated {updatedText}
        </span>
      )}
    </div>
  );
};

const PlanCard = ({
  title,
  description,
  price,
  features,
  savings,
  billingNote,
  isHighlighted,
  isPopular,
  isAvailable,
  buttonText,
  type,
  selectedDevices,
  onDevicesChange,
}) => {
  return (
    <div
      className={`relative rounded-xl border bg-card text-card-foreground shadow ${
        isHighlighted
          ? "border-2 border-[#F7B955] shadow-lg scale-105 bg-gradient-to-b from-[#FFF7EB] to-white"
          : isPopular
          ? "border-2 border-blue-500 shadow-md bg-gradient-to-b from-blue-50/30 to-white"
          : ""
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3 right-3 bg-[#F7B955] text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
          Best Value
        </div>
      )}
      {isPopular && (
        <div className="absolute -top-3 right-3 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
          Early Bird Special
        </div>
      )}
      <div className="flex flex-col h-full">
        <div className="p-3 pt-4">
          <h3
            className={`text-2xl font-semibold leading-none tracking-tight ${
              isHighlighted
                ? "text-[#D68A0C]"
                : isPopular
                ? "text-blue-600"
                : ""
            }`}
          >
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
        </div>
        <div className="p-3 pt-0 flex-1">
          <div className="mb-2">
            {typeof price === "function" ? price(selectedDevices) : price}
            {savings && (
              <span
                className={`block font-medium mt-2 ${
                  isHighlighted ? "text-[#D68A0C]" : "text-blue-500"
                }`}
              >
                {typeof savings === "function"
                  ? savings(selectedDevices)
                  : savings}
              </span>
            )}
            {billingNote && (
              <div className="text-sm text-gray-500 mt-0.5">{billingNote}</div>
            )}
          </div>
          <ul className="grid gap-1.5">
            {Array.isArray(features)
              ? features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-1.5">
                    <svg
                      className={`w-3 h-3 ${
                        isHighlighted ? "text-[#D68A0C]" : "text-blue-500"
                      }`}
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))
              : ALL_FEATURES.map(
                  (feature, index) =>
                    feature &&
                    features &&
                    feature[`${features}name`] && (
                      <li key={index} className="flex items-center gap-1.5">
                        <svg
                          className={`w-3 h-3 ${
                            isHighlighted ? "text-[#D68A0C]" : "text-blue-500"
                          } ${
                            feature[features] === false ? "text-gray-300" : ""
                          }`}
                          fill="none"
                          strokeWidth="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        <FeatureText
                          feature={feature}
                          plan={features}
                          selectedDevices={selectedDevices}
                        />
                      </li>
                    )
                )}
          </ul>
        </div>
        <div className="p-3 pt-0 mt-auto">
          {isHighlighted && (
            <div className="text-sm text-gray-600 text-center mb-3 italic">
              Better support + helps me develop more features 🙏
            </div>
          )}
          {isPopular && (
            <div className="text-sm text-gray-600 text-center mb-3 italic">
              This will support my development efforts ❤️
            </div>
          )}
          <DownloadButton
            type={type}
            isHighlighted={isHighlighted}
            isPopular={isPopular}
            isAvailable={isAvailable}
            buttonText={buttonText}
            selectedDevices={selectedDevices}
          />
        </div>
      </div>
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
    ? (discountedPrice / 12).toFixed(2)
    : discountedPrice.toFixed(2);
  const displayOriginalPrice = isYearly
    ? (originalPrice / 12).toFixed(2)
    : originalPrice.toFixed(2);

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center flex-row justify-between w-full">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold">${displayPrice}</span>
          {discountPercent > 0 && (
            <span className="text-gray-500 line-through">
              ${displayOriginalPrice}
            </span>
          )}
          {!isLifetime && <span className="text-sm text-gray-600">/month</span>}
        </div>
        {(isYearly || type === "monthly") && (
          <BillingSelector
            selected={isYearly ? "annually" : "monthly"}
            onSelect={(mode) => setIsYearly(mode === "annually")}
          />
        )}
        {isLifetime && onDevicesChange && (
          <DeviceSelectorForLifetime
            selected={selectedDevices}
            onSelect={onDevicesChange}
          />
        )}
      </div>

      {isYearly && (
        <div className="text-sm text-gray-600 mt-2">
          Billed ${discountedPrice.toFixed(2)} yearly
        </div>
      )}
    </div>
  );
};

const DownloadButton = ({
  type,
  isAvailable,
  buttonText,
  isHighlighted,
  isPopular,
  selectedDevices,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleDirectToPaymentLink = async () => {
    // Track payment button click with new approach
    trackButtonClick(`purchase_${type}`, ButtonActions.PURCHASE, {
      plan_type: type,
      devices: type === "lifetime" ? selectedDevices : 2,
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
          devices: type === "lifetime" ? selectedDevices : 2,
        }),
      });

      if (!response.ok) throw new Error("Failed to create payment link");

      const { paymentUrl } = await response.json();

      // Track successful payment link creation
      posthog.capture(TrackingEvents.PAYMENT_INITIATED, {
        plan_type: type,
        success: true,
        devices: type === "lifetime" ? selectedDevices : 2,
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

  if (type === "free") {
    return (
      <ButtonMainCTA
        type="small"
        size="lg"
        className="w-full h-9"
        text="Download for macOS"
        href="download"
        location={Locations.PRICING}
      />
    );
  } else {
    return (
      <Button
        onClick={() => {
          handleDirectToPaymentLink();
        }}
        disabled={!isAvailable || loading}
        variant={type === "free" ? "outline" : "default"}
        className={`w-full ${
          isHighlighted
            ? "bg-[#F7B955] hover:bg-[#D68A0C] text-white transition-all font-semibold"
            : isPopular
            ? "bg-blue-500 hover:bg-blue-600 text-white transition-all font-semibold"
            : "gap-2 border-primary text-primary hover:bg-primary hover:text-white"
        }`}
      >
        {type === "free" && <DownloadIcon size={16} />}
        {!isAvailable
          ? "Plan Coming Soon"
          : loading
          ? "Please wait"
          : buttonText}
      </Button>
    );
  }
};

export default function PricingCards({ className = "" }) {
  const [selectedDevices, setSelectedDevices] = React.useState(2);
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
    <div className="space-y-8">
      <div className={cn("grid gap-6 lg:grid-cols-3", className)}>
        <PlanCard
          type="free"
          title="Free Forever"
          description="Try Pro features for 7 days"
          price={
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold">$0</span>
              </div>
              <div className="text-sm text-blue-500 mt-1">
                No credit card required
              </div>
            </div>
          }
          features="free"
          isAvailable={true}
          buttonText="Download Now For Mac"
        />
        <PlanCard
          type={isYearly ? "yearly" : "monthly"}
          title="Pro Subscription"
          description="Invest in your productivity for less than your daily coffee ☕️"
          price={
            <div className="space-y-2">
              <PriceDisplay
                originalPrice={subscriptionPrice.PRICE}
                discountPercent={subscriptionPrice.DISCOUNT}
                isLifetime={false}
                type={isYearly ? "yearly" : "monthly"}
                isHighlighted={true}
                setIsYearly={setIsYearly}
                selectedDevices={selectedDevices}
              />
            </div>
          }
          features={FEATURES.MONTHLY}
          isPopular={true}
          billingNote={
            isYearly
            // ? `Save $${monthlySavings} per year compared to monthly`
            // : "Billed monthly"
          }
          savings={
            isYearly
              ? `Save $${monthlySavings} per year compared to monthly`
              : `Save ${subscriptionPrice.DISCOUNT}% on monthly as an early adopter`
          }
          isAvailable={true}
          buttonText={isYearly ? "Subscribe Yearly" : "Subscribe Monthly"}
          selectedDevices={selectedDevices}
        />
        <PlanCard
          type="lifetime"
          title="Pro Lifetime"
          description="Pay once, use forever"
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
              isHighlighted={false}
              selectedDevices={selectedDevices}
              onDevicesChange={setSelectedDevices}
            />
          }
          features={FEATURES.LIFETIME_PRO}
          savings={`Save $${(
            PRICING.LIFETIME_PRO.DEVICES[selectedDevices].PRICE *
            (PRICING.LIFETIME_PRO.DEVICES[selectedDevices].DISCOUNT / 100)
          ).toFixed(2)} as an early adopter`}
          billingNote={`${selectedDevices} devices, ${PRICING.LIFETIME_PRO.UPDATES_PERIOD} of updates`}
          isAvailable={true}
          buttonText="Get Lifetime License"
          selectedDevices={selectedDevices}
          isHighlighted={true}
        />
      </div>
    </div>
  );
}
