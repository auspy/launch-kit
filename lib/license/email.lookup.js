import { getLicensesCollection } from "@/adapters/license.db";

/**
 * Find license by email address
 * This enables Firebase users to access their license using the same email
 */
export async function findLicenseByEmail(email) {
  const collection = await getLicensesCollection();

  // Find active license by email
  const license = await collection.findOne({
    email: email.toLowerCase(),
    status: { $in: ["active", "trial"] }, // Only active or trial licenses
  });

  if (!license) {
    return null;
  }

  return {
    licenseKey: license.licenseKey,
    email: license.email,
    status: license.status,
    planType: license.planType || "basic",
    expiresAt: license.expiresAt,
    createdAt: license.createdAt,
  };
}

/**
 * Link Firebase UID to existing license
 * This helps track users across auth methods
 */
export async function linkFirebaseUidToLicense(email, firebaseUid) {
  const collection = await getLicensesCollection();

  const result = await collection.updateOne(
    {
      email: email.toLowerCase(),
      status: { $in: ["active", "trial"] },
    },
    {
      $set: {
        firebaseUid,
        lastFirebaseLoginAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}
