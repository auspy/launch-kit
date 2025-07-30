// import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";

// Define event types as constants to ensure consistency
export const TrackingEvents = {
  // Core events
  PAGE_VIEW: "$pageview",
  BUTTON_CLICK: "button_click",
  ELEMENT_VIEW: "element_view",
  ELEMENT_INTERACTION: "element_interaction",

  // Form events
  FORM_SUBMIT: "form_submit",
  FORM_ERROR: "form_error",

  // Conversion events
  DOWNLOAD_INITIATED: "download_initiated",
  DOWNLOAD_SUCCESS: "download_success",
  DOWNLOAD_ERROR: "download_error",
  PAYMENT_INITIATED: "payment_initiated",
  PAYMENT_COMPLETED: "payment_completed",
  PAYMENT_ERROR: "payment_error",
  PAYMENT_FAILED: "payment_failed",
  PAYMENT_OVERLAY_OPENED: "payment_overlay_opened",
  PAYMENT_OVERLAY_CLOSED: "payment_overlay_closed",
  PAYMENT_CHECKOUT_REDIRECT: "payment_checkout_redirect",
  PAYMENT_SUCCESS: "payment_success",

  // Subscription events
  SUBSCRIPTION_ACTIVATED: "subscription_activated",
  SUBSCRIPTION_RENEWED: "subscription_renewed",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",
  SUBSCRIPTION_EXPIRED: "subscription_expired",
  SUBSCRIPTION_FAILED: "subscription_failed",

  // Refund events
  REFUND_SUCCEEDED: "refund_succeeded",

  // Webhook events
  WEBHOOK_PROCESSING_ERROR: "webhook_processing_error",

  // Discount events
  STUDENT_DISCOUNT_REQUESTED: "student_discount_requested",

  // Attribution events
  ATTRIBUTION_LINKED: "attribution_linked",
};

// Define screen types for consistency with the Mac app
export const ScreenTypes = {
  LANDING: "landing",
  PRICING: "pricing",
  FEATURES: "features",
  ABOUT: "about",
  DOWNLOAD: "download",
  FAQ: "faq",
  HOW_TO_USE: "how_to_use",
};

// Define button actions for consistency
export const ButtonActions = {
  // Navigation actions
  NAVIGATE: "navigate",
  SCROLL_TO: "scroll_to",

  // Core actions
  DOWNLOAD: "download",
  PURCHASE: "purchase",
  CONTACT: "contact",
  SIGN_UP: "sign_up",
  LOGIN: "login",
  LOGOUT: "logout",

  // UI actions
  OPEN_MODAL: "open_modal",
  CLOSE_MODAL: "close_modal",
  TOGGLE: "toggle",
  EXPAND: "expand",
  COLLAPSE: "collapse",

  // Content actions
  PLAY: "play",
  PAUSE: "pause",
  VIEW_MORE: "view_more",
};

// Define common location names for consistency
export const Locations = {
  HEADER: "header",
  FOOTER: "footer",
  HERO: "hero",
  PRICING: "pricing",
  FAQ: "faq",
  FEATURES: "features",
  SIDEBAR: "sidebar",
  MODAL: "modal",
  CTA_SECTION: "cta_section",
  EMAIL: "email",
  RELEASE_DETAIL: "release_detail",
  FEATURE_BANNER: "feature_banner",
  PROMISE_PAGE: "promise_page",
  PROMISE_ALERT: "promise_alert",
};

// Download tracking constants for consistent event naming
export const DownloadEvents = {
  // Standard download funnel events
  DOWNLOAD_BUTTON_CLICKED: "download_button_clicked",
  DOWNLOAD_INITIATED: "download_initiated",
  DOWNLOAD_EMAIL_SENT: "download_email_sent",
  DOWNLOAD_EMAIL_CLICKED: "download_email_clicked",
  DOWNLOAD_SUCCESS: "download_success",
  DOWNLOAD_ERROR: "download_error",
};

// Download methods for consistent tracking
export const DownloadMethods = {
  DIRECT: "direct",
  EMAIL: "email",
  MODAL: "modal",
};

// Attribution helpers - now using PostHog's built-in distinct ID system
export const getAttributionData = () => {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);

  return {
    // Get device_id from URL params (app attribution)
    device_id: urlParams.get("device_id"),
    // UTM parameters
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
    utm_content: urlParams.get("utm_content"),
    utm_term: urlParams.get("utm_term"),
    // Page context
    referrer: document.referrer,
    landing_page: window.location.pathname,
    landing_timestamp: new Date().toISOString(),
  };
};

// Store attribution data for download attribution
export const storeDownloadAttribution = (additionalData = {}) => {
  if (typeof window === "undefined") return;

  const attributionData = {
    ...getAttributionData(),
    download_timestamp: new Date().toISOString(),
    ...additionalData,
  };

  localStorage.setItem("download_attribution", JSON.stringify(attributionData));
  return attributionData;
};

export const getStoredDownloadAttribution = () => {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("download_attribution");
  return stored ? JSON.parse(stored) : null;
};

// Reuse common properties for all events
const getCommonProperties = () => {
  if (typeof window === "undefined") return {};

  const attributionData = getAttributionData();

  return {
    page_path: window.location.pathname,
    page_url: window.location.href,
    referrer: document.referrer,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    timestamp: new Date().toISOString(),
    ...attributionData,
  };
};

// React hook for tracking in React components (RECOMMENDED)
// export const useTracking = () => {
//   const posthog = usePostHog();

//   const track = (eventName, properties = {}) => {
//     if (!posthog) return;

//     const enhancedProperties = {
//       ...getCommonProperties(),
//       ...properties,
//     };

//     posthog.capture(eventName, enhancedProperties);
//   };

//   return {
//     trackEvent: (eventName, properties = {}) => track(eventName, properties),
//     trackButtonClick: (buttonName, buttonAction, properties = {}) =>
//       track(TrackingEvents.BUTTON_CLICK, {
//         button_name: buttonName,
//         button_action: buttonAction,
//         ...properties,
//       }),
//     trackPageView: (screenType, url, properties = {}) =>
//       track(TrackingEvents.PAGE_VIEW, {
//         screen_type: screenType,
//         $current_url: url,
//         ...properties,
//       }),
//     trackElementInteraction: (elementName, action, properties = {}) =>
//       track(TrackingEvents.ELEMENT_INTERACTION, {
//         element_name: elementName,
//         action: action,
//         ...properties,
//       }),
//     trackDownload: (planType = "free", properties = {}) =>
//       track(TrackingEvents.DOWNLOAD_INITIATED, {
//         plan_type: planType,
//         ...properties,
//       }),
//     trackPayment: (planType, selectedDevices, properties = {}) =>
//       track(TrackingEvents.PAYMENT_INITIATED, {
//         plan_type: planType,
//         devices: selectedDevices,
//         ...properties,
//       }),
//   };
// };

export const trackEvent = (eventName, properties = {}) => {
  if (typeof window === "undefined") return;

  const enhancedProperties = {
    ...getCommonProperties(),
    ...properties,
  };

  posthog.capture(eventName, enhancedProperties);
};

export const trackButtonClick = (buttonName, buttonAction, properties = {}) => {
  trackEvent(TrackingEvents.BUTTON_CLICK, {
    button_name: buttonName,
    button_action: buttonAction,
    ...properties,
  });
};

export const trackPageView = (screenType, url, properties = {}) => {
  trackEvent(TrackingEvents.PAGE_VIEW, {
    screen_type: screenType,
    $current_url: url,
    ...properties,
  });
};

export const trackElementInteraction = (
  elementName,
  action,
  properties = {}
) => {
  trackEvent(TrackingEvents.ELEMENT_INTERACTION, {
    element_name: elementName,
    action: action,
    ...properties,
  });
};

export const trackDownload = (planType = "free", properties = {}) => {
  trackEvent(TrackingEvents.DOWNLOAD_INITIATED, {
    ...properties,
  });
};

export const trackDownloadSuccess = (planType = "free", properties = {}) => {
  trackEvent(TrackingEvents.DOWNLOAD_SUCCESS, {
    ...properties,
  });
};

// Standardized download tracking helpers
export const trackDownloadButtonClick = (method, location, properties = {}) => {
  trackButtonClick(
    DownloadEvents.DOWNLOAD_BUTTON_CLICKED,
    ButtonActions.DOWNLOAD,
    {
      method: method,
      location: location,
      ...properties,
    }
  );
};

export const trackDownloadInitiated = (method, location, properties = {}) => {
  trackEvent(DownloadEvents.DOWNLOAD_INITIATED, {
    method: method,
    location: location,
    ...properties,
  });
};

export const trackDownloadEmailSent = (location, properties = {}) => {
  trackEvent(DownloadEvents.DOWNLOAD_EMAIL_SENT, {
    method: DownloadMethods.EMAIL,
    location: location,
    ...properties,
  });
};

export const trackDownloadEmailClicked = (location, properties = {}) => {
  trackEvent(DownloadEvents.DOWNLOAD_EMAIL_CLICKED, {
    method: DownloadMethods.EMAIL,
    location: location,
    ...properties,
  });
};

export const trackDownloadCompleted = (method, location, properties = {}) => {
  trackEvent(DownloadEvents.DOWNLOAD_SUCCESS, {
    method: method,
    location: location,
    ...properties,
  });
};

export const trackDownloadFailed = (
  method,
  location,
  error,
  properties = {}
) => {
  trackEvent(DownloadEvents.DOWNLOAD_ERROR, {
    method: method,
    location: location,
    error_message: error,
    ...properties,
  });
};

export const trackPayment = (planType, selectedDevices, properties = {}) => {
  trackEvent(TrackingEvents.PAYMENT_INITIATED, {
    plan_type: planType,
    devices: selectedDevices,
    ...properties,
  });
};
