import crypto from "crypto";
import { getLicensesCollection } from "@/adapters/license.db";

// Generate a unique license key
export async function generateLicenseKey() {
  const collection = await getLicensesCollection();
  let isUnique = false;
  let licenseKey;

  while (!isUnique) {
    // Generate a random key in format: XXXX-XXXX-XXXX-XXXX
    const segments = Array.from({ length: 4 }, () =>
      crypto.randomBytes(2).toString("hex").toUpperCase()
    );
    licenseKey = segments.join("-");

    // Check if it's unique
    const exists = await collection.findOne({ licenseKey });
    if (!exists) {
      isUnique = true;
    }
  }

  return licenseKey;
}

// Generate device ID and hardware hash from hardware info
export async function generateDeviceId(hardwareInfo) {
  // Create a deterministic device ID from hardware info
  const deviceIdSource = JSON.stringify({
    os: hardwareInfo.os,
    hostname: hardwareInfo.hostname,
    cpus: hardwareInfo.cpus?.length,
    arch: hardwareInfo.arch,
    platform: hardwareInfo.platform,
  });

  // Generate deterministic device ID (will be same for same device)
  const deviceId = crypto
    .createHash("sha256")
    .update(deviceIdSource)
    .digest("hex")
    .slice(0, 32); // Use first 32 chars

  return deviceId;
}

// Validate hardware info format
export function validateHardwareInfo(hardwareInfo) {
  const requiredFields = ["os", "hostname", "arch", "platform"];

  for (const field of requiredFields) {
    if (!hardwareInfo[field]) {
      throw new Error(`Missing required hardware info: ${field}`);
    }
  }

  return true;
}

// Format error messages for client
export function formatErrorMessage(error) {
  // Add any custom error formatting logic here
  return {
    message: error.message,
    code: error.code || "UNKNOWN_ERROR",
  };
}

// Map licenseType to plan type for API responses
export function getPlanFromLicenseType(licenseType) {
  switch (licenseType) {
    case "lifetime":
      return "pro";
    case "lifetime_basic":
      return "basic";
    case "monthly":
      return "pro";
    case "yearly":
      return "pro";
    default:
      return "free";
  }
}

// Helper to determine license type from product ID
export function getLicenseTypeFromProduct(productId) {
  // Check for team products first
  // if (
  //   productId === process.env.TEAM_PRODUCT_ID ||
  //   productId === process.env.TEAM_IN_PRODUCT_ID ||
  //   process.env.ONE_YEAR_UPDATES_PRODUCT_IDS?.includes(productId)
  // ) {
  //   return "one_year"; // Team plans are pro plans with one-year updates
  // }

  if (process.env.PRO_PRODUCT_IDS?.includes(productId)) {
    return "lifetime"; // Pro plan
  } else if (process.env.BASIC_PRODUCT_IDS?.includes(productId)) {
    return "lifetime_basic"; // Basic plan
  }
  // Default to basic if no match (fallback)
  return "lifetime";
}

// Check if a license is eligible for updates based on its updatesEndDate
export function isEligibleForUpdates(license) {
  // If no updatesEndDate is set, it means lifetime updates
  if (!license.updatesEndDate) {
    return true;
  }

  // Check if the current date is before the updatesEndDate
  const now = new Date();
  const endDate = new Date(license.updatesEndDate);

  return now < endDate;
}

export function getMaxDevicesFromProductId(type, productId) {
  if (!type) {
    throw new Error(`Missing required type`);
  }
  if (!productId) {
    throw new Error(`Missing required productId`);
  }
  // Get environment variable name based on type and device count
  const envKey = (num) => `${type.toUpperCase()}_${num}_DEVICES_PRODUCT_ID`;
  if (process.env[envKey(10)]?.includes(productId)) {
    return 10; // 10 Devices
  } else if (process.env[envKey(5)]?.includes(productId)) {
    return 4; // 4 Devices
  } else if (process.env[envKey(2)]?.includes(productId)) {
    return 2; // 2 Devices
  } else if (process.env[envKey(1)]?.includes(productId)) {
    return 1; // 1 Device
  }

  // Default to basic if no match (fallback)
  return 2;
}
