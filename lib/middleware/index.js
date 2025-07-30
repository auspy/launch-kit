import { licenseMiddleware } from "./license.middleware";
import { hardwareMiddleware } from "./hardware.middleware";
import { NextResponse } from "next/server";

// Combine all middleware validations
export async function validateLicenseRequest(request, options = {}) {
  const startTime = Date.now();
  const { requireHardware = true, requireTimestamp = true } = options;

  try {
    const requestClone = request.clone();
    console.log("[License Validation] Starting middleware validation");

    // Always validate basic request headers
    console.log("[License Validation] Checking license headers");
    const licenseError = await licenseMiddleware(request);
    if (licenseError) {
      console.warn("[License Validation] License header validation failed");
      return licenseError;
    }

    // Validate hardware info if required
    if (requireHardware) {
      console.log("[License Validation] Checking hardware info");
      const hardwareError = await hardwareMiddleware(requestClone);
      if (hardwareError) {
        console.warn("[License Validation] Hardware validation failed");
        return hardwareError;
      }
    }

    // If all validations pass
    const duration = Date.now() - startTime;
    console.log(`[License Validation] Validation successful (${duration}ms)`);
    return null;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[License Validation] Fatal validation error after ${duration}ms:`,
      error
    );
    return NextResponse.json(
      {
        error: "Internal validation error",
        code: 500,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Export individual middleware for specific use cases
export { licenseMiddleware } from "./license.middleware";
export { hardwareMiddleware } from "./hardware.middleware";
