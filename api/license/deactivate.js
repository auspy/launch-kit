import { NextResponse } from "next/server";
import {
  deactivateDevice,
  validateLicense,
} from "@/lib/license/license.operations";
import { rateLimit, rateLimiters } from "@/lib/ratelimit";
import { headers } from "next/headers";
import { validateRequest } from "@/lib/license/license.validation";
import { validateLicenseRequest } from "@/lib/middleware";
import { z } from "zod";
import { validateSession } from "@/lib/session";

// Deactivation request schema
const deactivationSchema = z.object({
  licenseKey: z
    .string()
    .regex(
      /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
      "Invalid license key format"
    ),
  deviceId: z.string().min(32).max(32),
});

// Helper to get IP for rate limiting
function getIP() {
  const headersList = headers();
  return headersList.get("x-forwarded-for") || "127.0.0.1";
}

/**
 * Create a device deactivation handler
 * @param {Object} config - Configuration object
 */
export function createDeactivateHandler(config = {}) {
  const {
    requireSession = true,
    useSessionValidation = true,
    messages = {},
    onDeactivationSuccess,
    onDeactivationError,
    onError
  } = config;

  const defaultMessages = {
    success: "Device deactivated successfully",
    notFound: "Device not found or already deactivated",
    ...messages
  };

  return async function deactivateHandler(request) {
    try {
      const ip = getIP();

      // Apply rate limiting
      try {
        // Session validation logic (exact same as original)
        if (useSessionValidation) {
          try {
            await validateSession(request);
          } catch (error) {
            console.log(error);
            // Validate request using middleware (no hardware info needed for deactivation)
            const validationError = await validateLicenseRequest(request.clone(), {
              requireHardware: false,
            });
            if (validationError) return validationError;
          }
        } else if (requireSession) {
          // Alternative session validation if needed
          const validationError = await validateLicenseRequest(request.clone(), {
            requireHardware: false,
          });
          if (validationError) return validationError;
        }

        // Use device activation rate limiter (shares the same limit)
        const { remaining } = await rateLimit(rateLimiters.deviceActivation, ip);
        const headers = {
          "X-RateLimit-Remaining": remaining.toString(),
        };

        const body = await request.json();

        // Validate request schema
        try {
          await validateRequest(deactivationSchema, body);
        } catch (validationError) {
          return NextResponse.json(
            {
              error: "Validation error",
              details: JSON.parse(validationError.message),
            },
            { status: 400, headers }
          );
        }

        const { licenseKey, deviceId } = body;

        // Attempt to deactivate the device
        const deactivated = await deactivateDevice({ licenseKey, deviceId });
        if (!deactivated) {
          const error = { error: defaultMessages.notFound };
          
          if (onDeactivationError) {
            await onDeactivationError(error, { licenseKey, deviceId });
          }
          
          return NextResponse.json(error, { status: 404, headers });
        }

        const response = {
          success: true,
          message: defaultMessages.success,
        };

        // Custom success processing
        if (onDeactivationSuccess) {
          await onDeactivationSuccess(response, { licenseKey, deviceId });
        }

        return NextResponse.json(response, { headers });
      } catch (rateLimitError) {
        const errorData = JSON.parse(rateLimitError.message);
        return NextResponse.json(
          { error: errorData.error },
          {
            status: errorData.status,
            headers: {
              "X-RateLimit-Reset": new Date(errorData.reset).toISOString(),
            },
          }
        );
      }
    } catch (error) {
      console.error("Device deactivation error:", error);
      
      if (onError) {
        return await onError(error);
      }
      
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

// Default handler for backward compatibility
export const DELETE = createDeactivateHandler();