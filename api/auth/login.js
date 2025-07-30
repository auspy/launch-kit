import { validatePassword } from "@/lib/license/password.operations";
import { rateLimit, rateLimiters } from "@/lib/ratelimit";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Helper to get IP for rate limiting
function getIP() {
  const headersList = headers();
  return headersList.get("x-forwarded-for") || "127.0.0.1";
}

/**
 * Create a configurable login handler
 * @param {Object} config - Configuration object
 * @param {string} config.supportEmail - Support email for error messages
 * @param {Object} config.validation - Custom validation functions
 * @param {Object} config.cookie - Cookie configuration
 * @param {Function} config.onSuccess - Custom success handler
 * @param {Function} config.onError - Custom error handler
 */
export function createLoginHandler(config = {}) {
  const {
    supportEmail = "support@example.com",
    validation = {},
    cookie = {},
    onSuccess,
    onError
  } = config;

  const cookieConfig = {
    name: "auth_token",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    ...cookie
  };

  return async function loginHandler(request) {
    try {
      const ip = getIP();
      const body = await request.json();
      const { email, password, licenseKey } = body;

      // Validation
      if (!email || !password || !licenseKey) {
        return NextResponse.json(
          {
            error: "Missing required fields",
            code: "VALIDATION_FAILED",
            message: "Please provide email, password, and license key.",
          },
          { status: 400 }
        );
      }

      // Custom validation if provided
      if (validation.validateRequest) {
        const validationResult = await validation.validateRequest(body);
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

      // Authenticate
      const license = await validatePassword({ email, password, licenseKey });

      // Custom success processing
      let processedLicense = license;
      if (onSuccess) {
        processedLicense = await onSuccess(license, body);
      }

      const response = NextResponse.json(
        {
          message: "Login successful",
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
      console.error("[Password Login] Error:", error.message);
      
      // Custom error handling
      if (onError) {
        return await onError(error, supportEmail);
      }

      return NextResponse.json(
        {
          error: "Authentication failed",
          code: "AUTH_FAILED",
          message: `Invalid email or password. Please try again or contact our support team at ${supportEmail} for assistance.`,
        },
        { status: 400 }
      );
    }
  };
}

// Default handler for backward compatibility
export const POST = createLoginHandler();