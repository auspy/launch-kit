import { NextResponse } from "next/server";
import {
  findLicenseByEmail,
  linkFirebaseUidToLicense,
} from "@/lib/license/email.lookup";
import { rateLimit, rateLimiters } from "@/lib/ratelimit";
import { headers } from "next/headers";

// Helper to get IP for rate limiting
function getIP() {
  const headersList = headers();
  return headersList.get("x-forwarded-for") || "127.0.0.1";
}

/**
 * Create a configurable Firebase login handler
 * @param {Object} config - Configuration object
 * @param {Object} config.validation - Custom validation functions
 * @param {Object} config.cookie - Cookie configuration
 * @param {Object} config.messages - Custom messages
 * @param {Function} config.onSuccess - Custom success handler
 * @param {Function} config.onError - Custom error handler
 */
export function createFirebaseLoginHandler(config = {}) {
  const {
    validation = {},
    cookie = {},
    messages = {},
    onSuccess,
    onError
  } = config;

  const defaultMessages = {
    missingFields: "Firebase UID and email are required",
    licenseNotFound: (email) => `No active license found for ${email}. Please use the same email you purchased the license with.`,
    success: "Firebase login successful",
    authFailed: "Failed to authenticate with Firebase. Please try again.",
    ...messages
  };

  const cookieConfig = {
    name: "auth_token",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    ...cookie
  };

  return async function firebaseLoginHandler(request) {
    try {
      const ip = getIP();
      const body = await request.json();
      const { firebaseUid, email, displayName, providerId } = body;

      // Validation
      if (!firebaseUid || !email) {
        return NextResponse.json(
          {
            error: "Missing required fields",
            code: "VALIDATION_FAILED",
            message: defaultMessages.missingFields,
          },
          { status: 400 }
        );
      }

      // Custom validation if provided
      if (validation.validateFirebaseRequest) {
        const validationResult = await validation.validateFirebaseRequest(body);
        if (!validationResult.valid) {
          return NextResponse.json(
            {
              error: "Validation failed",
              code: "VALIDATION_FAILED",
              message: validationResult.message,
            },
            { status: 400 }
          );
        }
      }

      // Rate limiting
      const { remaining } = await rateLimit(rateLimiters.passwordLogin, ip);
      const responseHeaders = {
        "X-RateLimit-Remaining": remaining.toString(),
      };

      // Find license by email
      const license = await findLicenseByEmail(email);

      if (!license) {
        return NextResponse.json(
          {
            error: "No license found",
            code: "LICENSE_NOT_FOUND",
            message: defaultMessages.licenseNotFound(email),
          },
          { status: 404 }
        );
      }

      // Link Firebase UID to license
      await linkFirebaseUidToLicense(email, firebaseUid);

      // Prepare license data
      const licenseData = {
        ...license,
        authMethod: "firebase",
        firebaseUid,
      };

      // Custom success processing
      let processedLicense = licenseData;
      if (onSuccess) {
        processedLicense = await onSuccess(licenseData, body);
      }

      const response = NextResponse.json(
        {
          message: defaultMessages.success,
          license: processedLicense,
        },
        {
          status: 200,
          headers: responseHeaders,
        }
      );

      // Set the auth cookie
      response.cookies.set({
        ...cookieConfig,
        value: JSON.stringify(processedLicense),
      });

      return response;
    } catch (error) {
      console.error("[Firebase Login] Error:", error.message);
      
      // Custom error handling
      if (onError) {
        return await onError(error);
      }

      return NextResponse.json(
        {
          error: "Authentication failed",
          code: "AUTH_FAILED",
          message: defaultMessages.authFailed,
        },
        { status: 500 }
      );
    }
  };
}

// Default handler for backward compatibility
export const POST = createFirebaseLoginHandler();