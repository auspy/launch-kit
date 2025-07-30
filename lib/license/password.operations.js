import { getLicensesCollection } from "@/adapters/license.db";
import { hash, compare } from "bcryptjs";
import { z } from "zod";

const SALT_ROUNDS = 10;

// Schema for password validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long");

/**
 * Set password for a license
 */
export async function setPassword({ licenseKey, email, password }) {
  const collection = await getLicensesCollection();

  // Validate password
  passwordSchema.parse(password);

  // Find license
  const license = await collection.findOne({ licenseKey, email });
  if (!license) {
    throw new Error("Invalid license key or email");
  }

  if (license.passwordSetAt) {
    throw new Error("Password already set");
  }

  // Hash password
  const passwordHash = await hash(password, SALT_ROUNDS);

  // Update license with password
  const result = await collection.updateOne(
    { licenseKey },
    {
      $set: {
        passwordHash,
        passwordSetAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

/**
 * Validate password for a license
 */
export async function validatePassword({ email, password, licenseKey }) {
  const collection = await getLicensesCollection();

  // Find license by email
  const license = await collection.findOne({
    email,
    licenseKey,
    passwordHash: { $exists: true },
  });

  if (!license) {
    throw new Error("Invalid email or password not set");
  }

  // Verify password
  const isValid = await compare(password, license.passwordHash);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  // Update last login time
  await collection.updateOne(
    { _id: license._id },
    { $set: { lastLoginAt: new Date() } }
  );

  return {
    licenseKey: license.licenseKey,
    email: license.email,
    status: license.status,
  };
}

/**
 * Reset password using license key
 */
export async function resetPassword({ licenseKey, email, newPassword }) {
  const collection = await getLicensesCollection();

  // Validate new password
  passwordSchema.parse(newPassword);

  // Find license
  const license = await collection.findOne({ licenseKey, email });
  if (!license) {
    throw new Error("Invalid license key or email");
  }

  // Hash new password
  const passwordHash = await hash(newPassword, SALT_ROUNDS);

  // Update license with new password
  const result = await collection.updateOne(
    { licenseKey },
    {
      $set: {
        passwordHash,
        passwordSetAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}
