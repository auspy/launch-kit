import { cookies, headers } from "next/headers";
import Header from "./Header";

export default async function ServerHeader() {
  // Read PostHog flags from middleware-set cookie (single source of truth)
  let bootstrap = { featureFlags: {}, distinctID: "" };
  
  try {
    const cookieStore = cookies();
    console.log("🔍 [ServerHeader] Cookie store obtained successfully");
    
    // Get all cookies for debugging
    const allCookies = cookieStore.getAll();
    console.log("🍪 [ServerHeader] All cookies:", allCookies.map(c => c.name));
    
    const bootstrapCookie = cookieStore.get("ph_bootstrap");
    console.log("🎯 [ServerHeader] Bootstrap cookie lookup result:", {
      found: !!bootstrapCookie,
      value: bootstrapCookie?.value ? `${bootstrapCookie.value.substring(0, 100)}...` : 'none'
    });

    let bootstrapData = null;
    
    if (bootstrapCookie) {
      try {
        bootstrapData = JSON.parse(bootstrapCookie.value);
        console.log("📖 [ServerHeader] Successfully parsed PostHog flags from cookie");
      } catch (error) {
        console.error("❌ [ServerHeader] Error parsing bootstrap cookie:", error);
      }
    } else {
      // Try to get from headers if cookie is not available
      const headerStore = headers();
      const bootstrapHeader = headerStore.get("x-ph-bootstrap");
      console.log("🔍 [ServerHeader] Checking headers for bootstrap data:", {
        found: !!bootstrapHeader,
        value: bootstrapHeader ? `${bootstrapHeader.substring(0, 100)}...` : 'none'
      });
      
      if (bootstrapHeader) {
        try {
          bootstrapData = JSON.parse(bootstrapHeader);
          console.log("📖 [ServerHeader] Successfully parsed PostHog flags from header");
        } catch (error) {
          console.error("❌ [ServerHeader] Error parsing bootstrap header:", error);
        }
      } else {
        console.log("⚠️ [ServerHeader] No PostHog bootstrap cookie or header found");
      }
    }
    
    if (bootstrapData) {
      bootstrap = {
        featureFlags: bootstrapData.flags || {},
        distinctID: bootstrapData.distinctId || "",
      };
      console.log(
        "✅ [ServerHeader] PostHog flags loaded:",
        Object.keys(bootstrap.featureFlags)
      );
    }
  } catch (error) {
    // This happens during static generation when cookies() is not available
    console.log("📦 [ServerHeader] Static generation mode - no cookies available, error:", error.message);
  }

  // Pass bootstrap data to the client Header component
  return <Header bootstrap={bootstrap} />;
}
