"use client";

import { Banner } from "@/components/ui/banner";
import { useState, useEffect } from "react";

// Calculate date 1 week from now for summer sale
const getDateOneWeekFromNow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// 🎨 BANNER THEMES - Easy campaign management
const BANNER_THEMES = {
  // 🌞 Summer Sale Theme
  summerSale: {
    id: "summer-sale-2024",
    title: "☀️ Summer Sale is Here!",
    description:
      "Focus more in your summer holidays and save time for your next trip",
    discount: "25% OFF",
    promoCode: process.env.NEXT_PUBLIC_SUMMER_PROMO_CODE || "FOCUSSUMMER25",
    variant: "summer",
    size: "default",
    expiryDate: getDateOneWeekFromNow(),
    showOnPages: ["/", "/pricing", "/features"],
    excludePages: [], // Pages to never show on
  },

  // 🖤 Black Friday Theme
  blackFriday: {
    id: "black-friday-2024",
    title: "🎉 Black Friday Sale is Live!",
    description: "Get Focusmo Pro with the biggest discount of the year",
    discount: "70% OFF",
    promoCode: "BLACKFRIDAY70",
    variant: "gradient",
    size: "default",
    expiryDate: "Nov 30, 2024",
    showOnPages: ["/pricing", "/", "/features"],
    excludePages: [],
  },

  // 🎯 Basic Theme (Default)
  basic: {
    id: "basic-promotion",
    title: "🚀 Get Focusmo Pro",
    description: "Unlock all premium features for better focus",
    discount: "30% OFF",
    promoCode: "GETFOCUSED30",
    variant: "default",
    size: "default",
    expiryDate: "Dec 31, 2024",
    showOnPages: ["/pricing", "/", "/features"],
    excludePages: [],
  },
};

const BANNER_CONFIG = {
  showBanner: process.env.NEXT_PUBLIC_SHOW_BANNER === "true",
  // Set this to true to show the banner globally
  showGlobal: process.env.NEXT_PUBLIC_SHOW_BANNER_GLOBAL === "true",

  // 🎯 ACTIVE THEME: Change this to switch campaigns instantly
  activeTheme: "summerSale", // Options: "summerSale", "blackFriday", "basic"

  // Get current promotion based on active theme
  get currentPromo() {
    return BANNER_THEMES[this.activeTheme] || BANNER_THEMES.basic;
  },
};

export default function PromoBanner({ currentPath }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const { currentPromo, showGlobal } = BANNER_CONFIG;

  useEffect(() => {
    // Check if banner was previously dismissed for this promo
    const dismissedBanners = JSON.parse(
      localStorage.getItem("dismissedBanners") || "[]"
    );
    setIsDismissed(dismissedBanners.includes(currentPromo.id));
  }, [currentPromo.id]);

  const handleDismiss = () => {
    setIsDismissed(true);

    // Remember dismissal in localStorage
    const dismissedBanners = JSON.parse(
      localStorage.getItem("dismissedBanners") || "[]"
    );
    dismissedBanners.push(currentPromo.id);
    localStorage.setItem("dismissedBanners", JSON.stringify(dismissedBanners));
  };

  // Don't show if dismissed
  if (isDismissed) return null;

  // Check if we should show the banner
  const isExcluded =
    currentPath && currentPromo.excludePages.includes(currentPath);
  const shouldShow =
    BANNER_CONFIG.showBanner &&
    !isExcluded &&
    (showGlobal ||
      (currentPath && currentPromo.showOnPages.includes(currentPath)));

  if (!shouldShow) return null;

  return (
    <Banner
      variant={currentPromo.variant}
      size={currentPromo.size}
      title={currentPromo.title}
      description={currentPromo.description}
      discount={currentPromo.discount}
      promoCode={currentPromo.promoCode}
      expiryDate={currentPromo.expiryDate}
      onDismiss={handleDismiss}
      dismissible={true}
    />
  );
}
