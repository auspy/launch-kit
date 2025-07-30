import { getLicensesCollection } from "@/adapters/license.db";
import {
  sendLicenseCreatedEmail,
  sendDeviceActivationEmail,
  sendDeviceDeactivationEmail,
  sendSubscriptionCancelledEmail,
} from "@/lib/notifications/email";
import { z } from "zod";
import { hardwareInfoSchema } from "@/lib/middleware/hardware.middleware";
import { getPlanFromLicenseType } from "@/lib/license/license.utils";
import {
  updateSubscriptionStatus,
  getSubscriptionDetails,
} from "@/lib/dodo/dodo-client";

// Zod schema for license validation
const licenseSchema = z.object({
  licenseKey: z.string(),
  email: z.string().email(),
  status: z.enum(["active", "revoked"]),
  maxDevices: z.number().int().min(1),
  activeDevices: z
    .array(
      hardwareInfoSchema.extend({
        activatedAt: z.date(),
        lastUsedAt: z.date(),
      })
    )
    .default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
  purchaseId: z.string(),
  purchaseAmount: z.number(),
  purchaseDate: z.date(),
  licenseType: z
    .enum(["monthly", "yearly", "lifetime", "lifetime_basic"])
    .default("lifetime"),
  updatesEndDate: z.date().optional().nullable(),
  nextBillingDate: z.date().optional().nullable(),
  subscription_id: z.string().optional().nullable(),
  // Add password-related fields
  passwordHash: z.string().optional(),
  passwordSetAt: z.date().optional(),
  lastLoginAt: z.date().optional(),
  // cancelled fields
  cancelled: z.boolean().optional(),
  cancelledAt: z.date().optional(),
});

// Grace period constants (in milliseconds)
const GRACE_PERIOD_MS = 48 * 60 * 60 * 1000; // 48 hours

export function getLicenseType(productId, amount) {
  try {
    if (process.env.LIFETIME_PRODUCT_IDS?.includes(productId)) {
      return "lifetime";
    } else if (process.env.YEARLY_PRODUCT_IDS?.includes(productId)) {
      return "yearly";
    }
    return "monthly";
  } catch (error) {
    console.error("Failed to get license type:", error);
    if (amount > 99) {
      return "lifetime";
    } else if (amount > 50) {
      return "yearly";
    } else {
      return "monthly";
    }
  }
}

// Create a new license
export async function createLicense({
  licenseKey,
  email,
  maxDevices,
  purchaseId,
  purchaseAmount,
  purchaseDate,
  productId,
  licenseType,
  subscription_id,
  nextBillingDate,
  updatesEndDate,
}) {
  const collection = await getLicensesCollection();

  const license = {
    licenseKey,
    email,
    status: "active",
    maxDevices: parseInt(maxDevices, 10),
    activeDevices: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    purchaseId,
    purchaseAmount: parseFloat(purchaseAmount),
    purchaseDate,
    licenseType: licenseType || getLicenseType(productId, purchaseAmount),
    updatesEndDate,
    subscription_id,
    nextBillingDate,
  };

  try {
    // Validate with Zod before inserting
    const validatedLicense = licenseSchema.parse(license);

    console.log("Attempting to insert license:", {
      validatedLicense: JSON.stringify(validatedLicense, null, 2),
      maxDevices: typeof validatedLicense.maxDevices,
      purchaseAmount: typeof validatedLicense.purchaseAmount,
    });

    const result = await collection.insertOne(validatedLicense);

    if (result.insertedId) {
      // Send welcome email with license details
      await sendLicenseCreatedEmail(email, licenseKey, false, licenseType);
      return validatedLicense;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("License validation failed:", {
        issues: error.issues,
        license,
      });
    }
    throw error;
  }

  return null;
}

// Validate a license key
export async function validateLicense(licenseKey, email) {
  const collection = await getLicensesCollection();

  const license = await collection.findOne({
    licenseKey,
    email,
    status: "active",
  });

  return license !== null;
}

const returnObjectForActivateDevice = (license, deviceInfo, name) => {
  if (!license) {
    return null;
  }
  return {
    status: license.status,
    email: license.email,
    maxDevices: license.maxDevices,
    activeDevices: license.activeDevices.length,
    deviceInfo: {
      name,
      activatedAt: deviceInfo?.activatedAt || new Date(),
      lastUsedAt: deviceInfo?.lastUsedAt || new Date(),
    },
    updatesEndDate: license.updatesEndDate,
    plan: getPlanFromLicenseType(license.licenseType),
  };
};

// Activate a device for a license
export async function activateDevice({
  licenseKey,
  deviceId,
  email,
  ...hardwareInfo
}) {
  try {
    const name = hardwareInfo.name || hardwareInfo.hostname || "Unknown Device";
    const collection = await getLicensesCollection();

    // Find the license and check device count
    const license = await collection.findOne({
      licenseKey,
      email,
      status: "active",
    });

    if (!license) {
      throw new Error("Invalid or inactive license");
    }

    // Check if device is already activated (fixed deviceId check)
    const deviceExists = license.activeDevices.some(
      (device) => device.deviceId === deviceId
    );

    let deviceInfo = null;

    if (deviceExists) {
      // Instead of throwing error, return the device info
      deviceInfo = license.activeDevices.find(
        (device) => device.deviceId === deviceId
      );
      return returnObjectForActivateDevice(license, deviceInfo, name);
    } else {
      // Check if we've reached max devices
      if (license.activeDevices.length >= license.maxDevices) {
        throw new Error("Maximum device limit reached");
      }
    }

    // Add new device with required fields
    const result = await collection.updateOne(
      { licenseKey, email }, // Added email to ensure ownership
      {
        $push: {
          activeDevices: {
            deviceId,
            ...hardwareInfo,
            activatedAt: new Date(),
            lastUsedAt: new Date(),
          },
        },
        $set: { updatedAt: new Date() },
      }
    );

    if (result.modifiedCount > 0) {
      // Send activation confirmation email
      const response = returnObjectForActivateDevice(license, deviceInfo, name);
      console.log("Response from activateDevice:", response);
      await sendDeviceActivationEmail(license.email, licenseKey, name);
      return response;
    }

    return false;
  } catch (error) {
    console.error("Error activating device:", error);
    throw error;
  }
}

// Deactivate a device
export async function deactivateDevice({ licenseKey, deviceId }) {
  const collection = await getLicensesCollection();

  // Get license first for email notification
  const license = await collection.findOne({ licenseKey });
  if (!license) {
    return false;
  }

  const result = await collection.updateOne(
    { licenseKey },
    {
      $pull: {
        activeDevices: { deviceId },
      },
      $set: { updatedAt: new Date() },
    }
  );

  if (result.modifiedCount > 0) {
    // Send deactivation confirmation email
    await sendDeviceDeactivationEmail(license.email, licenseKey, deviceId);
    return true;
  }

  return false;
}

// Update device last validation date
export async function updateDeviceValidation({ licenseKey, deviceId, email }) {
  const collection = await getLicensesCollection();
  const now = new Date();

  console.log(
    `[License Validation] Updating device validation for license ${licenseKey}, device ${deviceId}`
  );

  // First, get the license to check if it's a subscription
  const license = await collection.findOneAndUpdate(
    {
      licenseKey,
      email,
    },
    {
      $set: {
        lastValidationDate: now,
      },
    },
    { returnDocument: "after" }
  );

  if (!license) {
    console.warn(
      `[License Validation] No matching license found for key ${licenseKey}, email ${email}`
    );
    return false;
  }

  if (
    license.status !== "active" ||
    (license.cancelled &&
      license.nextBillingDate &&
      new Date(license.nextBillingDate).getTime() + GRACE_PERIOD_MS <=
        now.getTime())
  ) {
    console.warn(
      `[License Validation] License is not active for key ${licenseKey}, email ${email}`
    );
    return false;
  }

  // Check device id
  const deviceInfo = license.activeDevices.find(
    (device) => device.deviceId === deviceId
  );

  if (!deviceInfo) {
    console.warn(
      `[License Validation] Device ${deviceId} not found in active devices for license ${licenseKey}`
    );
    return false;
  }

  if (
    license &&
    ["monthly", "yearly"].includes(license.licenseType) &&
    license.subscription_id
  ) {
    // If license exists and is a subscription type, check with Dodo API
    try {
      // Get subscription status from Dodo using the SDK
      const subscriptionDetails = await getSubscriptionDetails(
        license.subscription_id
      );
      const subscriptionNextBillingDate = new Date(
        subscriptionDetails.next_billing_date
      );
      const licenseNextBillingDate = new Date(license.nextBillingDate);

      // If subscription is active and has a different nextBillingDate than our record
      console.log(
        "Subscription details:",
        subscriptionDetails,
        subscriptionNextBillingDate.getTime(),
        licenseNextBillingDate.getTime()
      );
      if (
        subscriptionDetails.status === "active" &&
        subscriptionNextBillingDate.getTime() !==
          licenseNextBillingDate.getTime()
      ) {
        console.log(
          `[License Validation] Updating nextBillingDate from ${license.nextBillingDate} to ${subscriptionDetails.next_billing_date}`
        );

        // Update the nextBillingDate
        await collection.updateOne(
          { licenseKey },
          {
            $set: {
              nextBillingDate: subscriptionNextBillingDate,
              updatedAt: now,
            },
          }
        );

        // Use the new date for validation
        license.nextBillingDate = subscriptionNextBillingDate;
        license.updatedAt = now;
      } else if (subscriptionDetails.status === "cancelled") {
        console.log(
          `[License Validation] Subscription is cancelled for license ${licenseKey}`,
          license
        );
        if (!(license.cancelled && license.cancelledAt)) {
          // Update the nextBillingDate to null if the subscription is cancelled
          console.log(
            `[License Validation] Cancelling subscription for license ${licenseKey} in mongodb`
          );
          const [result, isUpdated] = await cancelSubscriptionMongodb(
            licenseKey,
            collection
          );
          console.log(
            `[License Validation] Subscription cancelled for license ${licenseKey}`,
            result,
            isUpdated
          );
        }
        return false;
      }
    } catch (error) {
      // Log error but continue with validation using existing data
      console.error(
        `[License Validation] Error checking subscription with Dodo: ${error.message}`
      );
    }
  }

  console.log(
    `[License Validation] Successfully updated device ${deviceId} for license ${licenseKey}`
  );

  // Return the response in the format expected by the Mac app
  return {
    status: license.status,
    email: license.email,
    maxDevices: license.maxDevices,
    activeDevices: license.activeDevices.length,
    deviceInfo: {
      name: deviceInfo.name || deviceInfo.hostname || "Unknown Device",
      activatedAt: deviceInfo.activatedAt,
      lastUsedAt: deviceInfo.lastUsedAt,
    },
    nextBillingDate: license.nextBillingDate,
    updatesEndDate: license.updatesEndDate,
    plan: getPlanFromLicenseType(license.licenseType),
  };
}

// Get license details
export async function getLicenseDetails(licenseKey) {
  const collection = await getLicensesCollection();
  return await collection.findOne({ licenseKey });
}

// Revoke a license
export async function revokeLicense(licenseKey) {
  const collection = await getLicensesCollection();

  const result = await collection.updateOne(
    { licenseKey },
    {
      $set: {
        status: "revoked",
        activeDevices: [],
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

// Update subscription type and dates
export async function updateSubscription(
  licenseKey,
  { licenseType, nextBillingDate }
) {
  const collection = await getLicensesCollection();

  const setValue = {
    updatedAt: new Date(),
  };
  if (licenseType) {
    setValue.licenseType = licenseType;
  }
  if (nextBillingDate) {
    setValue.nextBillingDate = nextBillingDate;
  }

  const result = await collection.updateOne(
    { licenseKey },
    {
      $set: setValue,
    }
  );

  return result.modifiedCount > 0;
}

// Revoke subscription license
export async function revokeLicenseBySubsId(subscription_id) {
  const collection = await getLicensesCollection();

  const result = await collection.updateOne(
    { subscription_id: subscription_id },
    {
      $set: {
        status: "revoked",
        activeDevices: [],
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

// Revoke license by payment ID
export async function revokeLicenseByPaymentId(payment_id) {
  const collection = await getLicensesCollection();

  const result = await collection.updateOne(
    { purchaseId: payment_id },
    {
      $set: {
        status: "revoked",
        activeDevices: [],
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

// Cancel a subscription license (updates both DB and Dodo)
export async function cancelSubscription(licenseKey) {
  const collection = await getLicensesCollection();

  // First, get the license details to retrieve subscription_id
  const license = await collection.findOne({ licenseKey });

  if (!license) {
    throw new Error("License not found");
  }

  if (license.status === "revoked") {
    throw new Error("License already revoked");
  }

  if (!license.subscription_id) {
    throw new Error("No subscription ID found for this license");
  }

  try {
    // Get full subscription details from Dodo using SDK
    const subscriptionDetails = await getSubscriptionDetails(
      license.subscription_id
    );
    console.log("Got subscription details:", {
      subscription_id: license.subscription_id,
      status: subscriptionDetails.status,
      next_billing_date: subscriptionDetails.next_billing_date,
    });

    // Check if already cancelled
    if (subscriptionDetails.status === "cancelled") {
      console.log(
        `Subscription ${license.subscription_id} is already cancelled`
      );
    } else {
      // Update the subscription status in Dodo using SDK
      const updatedSubscription = await updateSubscriptionStatus(
        license.subscription_id,
        "cancelled"
      );
      console.log(
        "Subscription cancelled in Dodo:",
        updatedSubscription.subscription_id
      );
    }

    // Mark as cancelled in our database (but don't revoke yet)
    // This allows user to continue using the service until subscription period ends
    const [result, isUpdated] = await cancelSubscriptionMongodb(
      licenseKey,
      collection
    );

    if (isUpdated) {
      return {
        success: true,
        message: "Subscription cancelled successfully",
        endDate: license.nextBillingDate,
        subscription_id: license.subscription_id,
      };
    }

    return { success: false, message: "Failed to update license" };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
}

// Cancel subscription mongodb only
export async function cancelSubscriptionMongodb(
  licenseKey,
  collection = null,
  setValue = {}
) {
  const collectionIs = collection || (await getLicensesCollection());
  const result = await collectionIs.updateOne(
    { licenseKey },
    {
      $set: {
        cancelled: true,
        cancelledAt: new Date(),
        updatedAt: new Date(),
        ...setValue,
      },
    }
  );

  return [result, result.modifiedCount > 0];
}
