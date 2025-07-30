import { NextResponse } from "next/server";
import { activateDevice } from "@/lib/license/license.operations";
import { generateDeviceId } from "@/lib/license/license.utils";
import {
  commonDeviceSchema,
  validateRequest,
} from "@/lib/license/license.validation";
import { rateLimit, rateLimiters } from "@/lib/ratelimit";
import { headers } from "next/headers";
import { validateLicenseRequest } from "@/lib/middleware";

// Helper to get IP for rate limiting
function getIP() {
  const headersList = headers();
  return headersList.get("x-forwarded-for") || "127.0.0.1";
}

/**
 * Create a device activation handler
 * @param {Object} config - Configuration object
 */
export function createActivateHandler(config = {}) {
  const {
    logging = true,
    messages = {},
    onActivationSuccess,
    onActivationError,
    onError
  } = config;

  const defaultMessages = {
    success: "Device activated successfully",
    activationFailed: "Device activation failed due to an unknown error",
    maxDevicesReached: "You have reached the maximum number of devices allowed for this license. Visit focusmo.app/license/dashboard to manage your devices.",
    deviceAlreadyActivated: "This device has already been activated with this license",
    invalidLicense: "The provided license key is invalid or has been deactivated",
    rateLimitExceeded: "Too many activation attempts. Please try again later",
    internalError: "An unexpected error occurred during activation",
    ...messages
  };

  return async function activateHandler(request) {
    const startTime = Date.now();
    const ip = getIP();
    
    if (logging) {
      console.log(`[License Activation] Starting activation request from IP: ${ip}`);
    }
    
    // Apply rate limiting using both IP and license key
    try {
      // Validate request using middleware
      if (logging) {
        console.log("[License Activation] Validating request middleware");
      }
      const validationError = await validateLicenseRequest(request.clone());
      if (validationError) {
        if (logging) {
          console.warn("[License Activation] Middleware validation failed");
        }
        return validationError;
      }

      const body = await request.json();
      let parsedBody;

      // Validate request schema
      try {
        if (logging) {
          console.log("[License Activation] Validating request schema");
        }
        parsedBody = await validateRequest(commonDeviceSchema, body);
      } catch (validationError) {
        if (logging) {
          console.warn("[License Activation] Schema validation failed:", validationError.message);
        }
        return NextResponse.json(
          {
            error: "Validation error",
            details: JSON.parse(validationError.message),
          },
          { status: 400 }
        );
      }

      const { licenseKey, hardwareInfo, email } = parsedBody;
      if (logging) {
        console.log(`[License Activation] Processing license key: ${licenseKey.substring(0, 4)}...`);
      }

      // Rate limit by IP first
      if (logging) {
        console.log("[License Activation] Checking IP rate limit");
      }
      const { remaining: ipRemaining } = await rateLimit(
        rateLimiters.deviceActivation,
        ip
      );

      // Then rate limit by license key
      if (logging) {
        console.log("[License Activation] Checking license key rate limit");
      }
      const { remaining: licenseRemaining } = await rateLimit(
        rateLimiters.deviceActivation,
        `license:${licenseKey}`
      );

      // Add rate limit info to response headers
      const headers = {
        "X-RateLimit-Remaining-IP": ipRemaining.toString(),
        "X-RateLimit-Remaining-License": licenseRemaining.toString(),
      };

      // Generate device ID from hardware info
      if (logging) {
        console.log("[License Activation] Generating device ID");
      }
      const deviceId = await generateDeviceId(hardwareInfo);
      if (logging) {
        console.log(`[License Activation] Generated device ID: ${deviceId.substring(0, 8)}...`);
      }

      try {
        // Attempt to activate the device
        if (logging) {
          console.log("[License Activation] Attempting device activation");
        }
        const activated = await activateDevice({
          licenseKey,
          deviceId,
          email,
          ...hardwareInfo,
        });

        if (activated) {
          if (logging) {
            console.log(`[License Activation] Successfully activated device: ${deviceId.substring(0, 8)}...`);
          }
          const duration = Date.now() - startTime;
          if (logging) {
            console.log(`[License Activation] Completed successfully in ${duration}ms`);
          }

          // Convert dates to Unix timestamps before sending
          const deviceInfo = {
            ...activated.deviceInfo,
            activatedAt: new Date(activated.deviceInfo.activatedAt).getTime() / 1000,
            lastUsedAt: new Date(activated.deviceInfo.lastUsedAt).getTime() / 1000,
          };

          const response = {
            ...activated,
            deviceInfo,
            success: true,
            deviceId,
            message: defaultMessages.success,
            code: "ACTIVATION_SUCCESS",
          };

          // Custom success processing
          if (onActivationSuccess) {
            await onActivationSuccess(response, parsedBody);
          }

          return NextResponse.json(response, { headers });
        } else {
          if (logging) {
            console.error("[License Activation] Activation failed without error");
          }
          return NextResponse.json(
            {
              error: "Failed to activate device",
              code: "ACTIVATION_FAILED",
              message: defaultMessages.activationFailed,
            },
            { status: 500, headers }
          );
        }
      } catch (activationError) {
        // Handle specific activation errors
        if (activationError.message === "Maximum device limit reached") {
          if (logging) {
            console.warn(`[License Activation] Max device limit reached for license: ${licenseKey.substring(0, 4)}...`);
          }
          const error = {
            error: "Maximum number of devices already activated",
            code: "MAX_DEVICES_REACHED",
            message: defaultMessages.maxDevicesReached,
          };
          
          if (onActivationError) {
            await onActivationError(error, activationError, parsedBody);
          }
          
          return NextResponse.json(error, { status: 403, headers });
        } else if (activationError.message === "Device already activated") {
          if (logging) {
            console.warn(`[License Activation] Device already activated: ${deviceId.substring(0, 8)}...`);
          }
          const error = {
            error: "This device is already activated",
            code: "DEVICE_ALREADY_ACTIVATED",
            message: defaultMessages.deviceAlreadyActivated,
          };
          
          if (onActivationError) {
            await onActivationError(error, activationError, parsedBody);
          }
          
          return NextResponse.json(error, { status: 409, headers });
        } else if (activationError.message === "Invalid or inactive license") {
          if (logging) {
            console.warn(`[License Activation] Invalid or inactive license: ${licenseKey.substring(0, 4)}...`);
          }
          const error = {
            error: "Invalid or inactive license",
            code: "INVALID_LICENSE",
            message: defaultMessages.invalidLicense,
          };
          
          if (onActivationError) {
            await onActivationError(error, activationError, parsedBody);
          }
          
          return NextResponse.json(error, { status: 401, headers });
        }

        // Log unexpected errors
        if (logging) {
          console.error("[License Activation] Unexpected error:", activationError);
        }
        
        const error = {
          error: "Internal server error",
          code: "INTERNAL_ERROR",
          message: defaultMessages.internalError,
        };
        
        if (onActivationError) {
          await onActivationError(error, activationError, parsedBody);
        }
        
        return NextResponse.json(error, { status: 500, headers });
      }
    } catch (rateLimitError) {
      try {
        const errorData = JSON.parse(rateLimitError.message);
        if (logging) {
          console.warn("[License Activation] Rate limit exceeded:", rateLimitError.message);
        }
        return NextResponse.json(
          {
            error: errorData.error,
            code: "RATE_LIMIT_EXCEEDED",
            message: defaultMessages.rateLimitExceeded,
            reset: new Date(errorData.reset).toISOString(),
          },
          {
            status: errorData.status || 429,
            headers: {
              "X-RateLimit-Reset": new Date(errorData.reset).toISOString(),
            },
          }
        );
      } catch (error) {
        const duration = Date.now() - startTime;
        if (logging) {
          console.error(`[License Activation] Fatal error after ${duration}ms:`, error);
        }
        
        if (onError) {
          return await onError(error);
        }
        
        return NextResponse.json(
          {
            error: "Internal server error",
            code: "INTERNAL_ERROR",
            message: defaultMessages.internalError,
          },
          { status: 500 }
        );
      }
    }
  };
}

// Default handler for backward compatibility
export const POST = createActivateHandler();