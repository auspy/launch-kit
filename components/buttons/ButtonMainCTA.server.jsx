import { cookies, headers } from "next/headers";
import { getCTATextByVariant, FEATURE_FLAGS } from "@/lib/flags/featureFlags";
import ButtonMainCTAClient from "./ButtonMainCTA.client";

/**
 * Server-side wrapper for ButtonMainCTA that eliminates A/B test flicker
 * This component runs on the server and reads the CTA variant from the
 * middleware-set cookie, preventing any flash of unchanged content.
 */
export default async function ButtonMainCTA(props) {
  // Read PostHog flags from the same cookie that middleware sets
  let variant = "control";
  let payload = {};

  try {
    const cookieStore = cookies();
    console.log("🔍 [ButtonMainCTA.server] Cookie store obtained successfully");
    
    // Get all cookies for debugging
    const allCookies = cookieStore.getAll();
    console.log("🍪 [ButtonMainCTA.server] All cookies:", allCookies.map(c => c.name));
    
    const bootstrapCookie = cookieStore.get("ph_bootstrap");
    console.log("🎯 [ButtonMainCTA.server] Bootstrap cookie lookup result:", {
      found: !!bootstrapCookie,
      value: bootstrapCookie?.value ? `${bootstrapCookie.value.substring(0, 100)}...` : 'none'
    });

    let bootstrapData = null;
    
    if (bootstrapCookie) {
      try {
        bootstrapData = JSON.parse(bootstrapCookie.value);
        console.log("📖 [ButtonMainCTA.server] Successfully parsed PostHog flags from cookie");
      } catch (error) {
        console.error("❌ [ButtonMainCTA.server] Error parsing bootstrap cookie:", error);
      }
    } else {
      // Try to get from headers if cookie is not available
      const headerStore = headers();
      const bootstrapHeader = headerStore.get("x-ph-bootstrap");
      console.log("🔍 [ButtonMainCTA.server] Checking headers for bootstrap data:", {
        found: !!bootstrapHeader,
        value: bootstrapHeader ? `${bootstrapHeader.substring(0, 100)}...` : 'none'
      });
      
      if (bootstrapHeader) {
        try {
          bootstrapData = JSON.parse(bootstrapHeader);
          console.log("📖 [ButtonMainCTA.server] Successfully parsed PostHog flags from header");
        } catch (error) {
          console.error("❌ [ButtonMainCTA.server] Error parsing bootstrap header:", error);
        }
      } else {
        console.log("⚠️ [ButtonMainCTA.server] No PostHog bootstrap cookie or header found");
      }
    }
    
    if (bootstrapData) {
      const ctaFlagData =
        bootstrapData.flags?.[FEATURE_FLAGS.CTA_TEXT_VARIANT] || {};
      variant = ctaFlagData.variant || "control";
      payload = ctaFlagData.payload || {};
      console.log("✅ [ButtonMainCTA.server] CTA flag data loaded:", {
        variant,
        payload,
        hasFlags: Object.keys(bootstrapData.flags || {}).length > 0
      });
    }
  } catch (error) {
    // This happens during static generation when cookies() is not available
    console.log("📦 [ButtonMainCTA.server] Static generation mode - using default variant, error:", error.message);
  }

  // Determine the CTA text using the same logic as the client component
  const ctaText = payload?.text || getCTATextByVariant(variant);

  // Determine download method from payload
  const effectiveDownloadMethod =
    payload?.direct === true ? "direct" : props.downloadMethod || "modal";

  console.log(
    "🚀 [ButtonMainCTA.server] Rendering with middleware A/B test data:",
    {
      variant,
      ctaText,
      downloadMethod: effectiveDownloadMethod,
      hasPayload: !!Object.keys(payload || {}).length,
    }
  );

  // Pass the pre-computed values to the client component
  return (
    <ButtonMainCTAClient
      {...props}
      // Override text with server-computed value to prevent flicker
      text={ctaText}
      // Pass A/B test data for tracking (now redundant but kept for compatibility)
      initialVariant={variant}
      initialPayload={payload}
      // Override download method if needed
      downloadMethod={effectiveDownloadMethod}
    />
  );
}
