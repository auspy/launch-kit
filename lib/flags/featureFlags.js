/**
 * Feature Flags Enum
 * Store all PostHog feature flag names as constants to maintain consistency
 * and prevent typos across the codebase.
 */

export const FEATURE_FLAGS = {
  // CTA Button A/B Testing
  CTA_TEXT_VARIANT: "cta_text_variant",

  // Add more feature flags here as needed
  // EXAMPLE_FLAG: "example_flag",
};

/**
 * CTA Text Variant Options
 * Possible values for the CTA_TEXT_VARIANT feature flag
 */
export const CTA_VARIANTS = {
  TRY_FREE: "try_free", // "Try for Free"
  DOWNLOAD_FREE: "download_free", // "Download for Free"
};

/**
 * Helper function to get CTA text based on variant
 * @param {string} variant - The variant from PostHog feature flag
 * @returns {string} The CTA text to display
 */
export const getCTATextByVariant = (variant) => {
  switch (variant) {
    case CTA_VARIANTS.TRY_FREE:
      return "Try for Free";
    case CTA_VARIANTS.DOWNLOAD_FREE:
      return "Download for Free";
    default:
      return "Download for Mac";
  }
};
