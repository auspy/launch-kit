import { z } from "zod";
import { hardwareInfoSchema } from "@/lib/middleware/hardware.middleware";

// Email validation schema
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(5, "Email is too short")
  .max(255, "Email is too long");

// License key validation schema
export const licenseKeySchema = z
  .string()
  .regex(
    /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
    "Invalid license key format"
  );

// Create license request schema
export const createLicenseSchema = z.object({
  email: emailSchema,
});

// Activate device request schema
export const commonDeviceSchema = z.object({
  licenseKey: licenseKeySchema,
  hardwareInfo: hardwareInfoSchema,
  deviceId: z.string(),
  email: emailSchema,
});
// deviceid being sent from the client is useless, it is being generated on server side. it is here as decoy and i am tired to fix it.
// hardwareId is the one that is being sent from the client and is being used to validate the license. so it is generated on both sides. i am using client one to store.

// Validate request helper
export async function validateRequest(schema, data) {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error.errors) {
      const messages = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      throw new Error(JSON.stringify(messages));
    }
    throw error;
  }
}
