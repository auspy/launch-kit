import { NextResponse } from "next/server";
import { updateDeviceValidation } from "@/lib/license/license.operations";
import { rateLimit, rateLimiters } from "@/lib/ratelimit";
import { headers } from "next/headers";
import {
  commonDeviceSchema,
  validateRequest,
} from "@/lib/license/license.validation";
import { validateLicenseRequest } from "@/lib/middleware";
import { generateDeviceId } from "@/lib/license/license.utils";
import { supportEmail } from "@/constants";

// Helper to get IP for rate limiting
function getIP() {
  const headersList = headers();
  return headersList.get("x-forwarded-for") || "127.0.0.1";
}

/**
 * Create a license validation handler
 * @param {Object} config - Configuration object
 */
export function createValidateHandler(config = {}) {
  const {
    supportEmail: configSupportEmail = supportEmail,
    logging = true,
    messages = {},
    onValidationSuccess,
    onValidationError,
    onError
  } = config;

  const defaultMessages = {
    validationFailed: `Invalid license data. Please try again or contact our support team at ${configSupportEmail} for assistance.`,
    deviceNotFound: `Please activate your device using "Enter License Key". Still having issues? Contact ${configSupportEmail} for help.`,
    rateLimitExceeded: `Too many attempts. Please try again later or contact ${configSupportEmail}.`,
    unexpectedError: `Unexpected error. Please try again or contact ${configSupportEmail}.`,
    ...messages
  };

  return async function validateHandler(request) {
    try {
      const ip = getIP();
      // Clone the request first, before reading the body
      const requestClone = request.clone();
      const body = await request.json();

      // Validate request using middleware
      const validationError = await validateLicenseRequest(requestClone);
      if (validationError) {
        if (logging) {
          console.warn("[License Validation] Middleware validation failed");
        }
        return NextResponse.json(
          {
            error: "Validation failed",
            code: "VALIDATION_FAILED",
            message: defaultMessages.validationFailed,
          },
          { status: 400 }
        );
      }

      const { remaining } = await rateLimit(rateLimiters.licenseValidation, ip);
      const headers = {
        "X-RateLimit-Remaining": remaining.toString(),
      };

      // Validate request schema
      let parsedBody;
      try {
        parsedBody = await validateRequest(commonDeviceSchema, body);
      } catch (validationError) {
        if (logging) {
          console.error("[License Validation] Validation error:", validationError.message);
        }
        return NextResponse.json(
          {
            error: "Validation error",
            details: JSON.parse(validationError.message),
            code: "VALIDATION_ERROR",
            message: defaultMessages.validationFailed,
          },
          { status: 400, headers }
        );
      }

      const { licenseKey, hardwareInfo, email } = parsedBody;
      // Generate device ID from hardware info
      if (logging) {
        console.log("[License Validation] Generating device ID");
      }
      const deviceId = await generateDeviceId(hardwareInfo);
      if (logging) {
        console.log(`[License Validation] Generated device ID: ${deviceId.substring(0, 8)}...`);
      }

      // Verify and Update the last validation date for this device
      const validationResult = await updateDeviceValidation({
        licenseKey,
        deviceId,
        email,
      });
      if (logging) {
        console.log("[License Validation] Validation result:", validationResult);
      }

      if (!validationResult) {
        if (logging) {
          console.warn("[License Validation] Device not found or not activated for this license");
        }
        
        const error = {
          error: "Device not found or not activated for this license",
          code: "VALIDATION_FAILED",
          message: defaultMessages.deviceNotFound,
        };
        
        if (onValidationError) {
          await onValidationError(error, parsedBody);
        }
        
        return NextResponse.json(error, { status: 404, headers });
      }

      // Convert dates to Unix timestamps before sending
      const deviceInfo = {
        ...validationResult.deviceInfo,
        activatedAt: new Date(validationResult.deviceInfo.activatedAt).getTime() / 1000,
        lastUsedAt: new Date(validationResult.deviceInfo.lastUsedAt).getTime() / 1000,
      };

      // Return the full license response
      if (logging) {
        console.log(`[License Validation] Device validated successfully for license ${licenseKey}`);
      }
      
      const response = {
        ...validationResult,
        deviceInfo,
        nextValidation: validationResult.nextBillingDate
          ? new Date(validationResult.nextBillingDate).getTime() / 1000
          : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days in seconds
      };

      // Custom success processing
      if (onValidationSuccess) {
        await onValidationSuccess(response, parsedBody);
      }

      return NextResponse.json(response, { headers });
    } catch (rateLimitError) {
      try {
        const errorData = JSON.parse(rateLimitError.message);
        if (logging) {
          console.warn(`[License Validation] Rate limit exceeded for IP ${getIP()}: ${errorData.error}`);
        }
        return NextResponse.json(
          {
            error: errorData.error,
            code: "RATE_LIMIT_EXCEEDED",
            message: defaultMessages.rateLimitExceeded,
          },
          {
            status: errorData.status,
            headers: {
              "X-RateLimit-Reset": new Date(errorData.reset).toISOString(),
            },
          }
        );
      } catch (error) {
        if (logging) {
          console.error("License validation error:", rateLimitError);
        }
        
        if (onError) {
          return await onError(rateLimitError);
        }
        
        return NextResponse.json(
          {
            error: rateLimitError.message || "Device not found",
            code: "VALIDATION_ERROR",
            message: defaultMessages.unexpectedError,
          },
          { status: 500 }
        );
      }
    }
  };
}

// Default handler for backward compatibility
export const POST = createValidateHandler();