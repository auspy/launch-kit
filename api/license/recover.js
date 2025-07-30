import { NextResponse } from "next/server";
import { getLicensesCollection } from "@/adapters/license.db";
import { sendLicenseCreatedEmail } from "@/lib/notifications/email";
import { rateLimit, rateLimiters, getRateLimitStatus } from "@/lib/ratelimit";
import { headers } from "next/headers";

// Helper to get IP for rate limiting
function getIP() {
  const headersList = headers();
  return headersList.get("x-forwarded-for") || "127.0.0.1";
}

/**
 * Create a license recovery handler
 * @param {Object} config - Configuration object
 */
export function createRecoverHandler(config = {}) {
  const {
    logging = true,
    licenseStatus = "active",
    messages = {},
    onRecoveryRequested,
    onLicensesFound,
    onError
  } = config;

  const defaultMessages = {
    emailRequired: "Email is required",
    noLicensesFound: "No active licenses found for this email",
    recoverySuccess: "License details have been sent to your email",
    rateLimitExceeded: "Rate limit exceeded. Please try again later.",
    internalError: "Internal server error",
    ...messages
  };

  return async function recoverHandler(request) {
    if (logging) {
      console.log("🔄 License recovery API called");
    }

    // Apply rate limiting
    try {
      const ip = getIP();
      if (logging) {
        console.log("📍 Client IP:", ip);
      }

      const { remaining } = await rateLimit(rateLimiters.licenseRecovery, ip);
      if (logging) {
        console.log("⚡ Rate limit check passed, remaining:", remaining);
      }

      const headers = {
        "X-RateLimit-Remaining": remaining.toString(),
      };

      const { email } = await request.json();
      if (logging) {
        console.log("📧 License recovery requested for email:", email);
      }

      if (!email) {
        if (logging) {
          console.log("❌ Email validation failed - no email provided");
        }
        return NextResponse.json(
          { error: defaultMessages.emailRequired },
          { status: 400, headers }
        );
      }

      // Custom processing before recovery
      if (onRecoveryRequested) {
        await onRecoveryRequested(email, request);
      }

      // Find licenses for this email
      if (logging) {
        console.log("🔍 Searching for licenses for email:", email);
      }
      const collection = await getLicensesCollection();
      const licenses = await collection
        .find({ email, status: licenseStatus })
        .toArray();

      if (logging) {
        console.log("📊 Found licenses count:", licenses.length);
        console.log(
          "📝 License details:",
          licenses.map((l) => ({
            id: l._id,
            key: l.licenseKey?.substring(0, 8) + "...",
          }))
        );
      }

      if (!licenses || licenses.length === 0) {
        if (logging) {
          console.log("❌ No active licenses found for email:", email);
        }
        return NextResponse.json(
          { error: defaultMessages.noLicensesFound },
          { status: 404, headers }
        );
      }

      // Custom processing after finding licenses
      if (onLicensesFound) {
        await onLicensesFound(licenses, email);
      }

      // Send email with license details
      if (logging) {
        console.log("📤 Sending recovery emails for", licenses.length, "licenses");
      }
      for (const license of licenses) {
        if (logging) {
          console.log(
            "📨 Sending recovery email for license:",
            license.licenseKey?.substring(0, 8) + "..."
          );
        }
        await sendLicenseCreatedEmail(email, license.licenseKey, true);
        if (logging) {
          console.log("✅ Recovery email sent successfully");
        }
      }

      if (logging) {
        console.log("🎉 License recovery completed successfully");
      }
      return NextResponse.json(
        {
          success: true,
          message: defaultMessages.recoverySuccess,
          count: licenses.length,
        },
        { headers }
      );
    } catch (error) {
      if (logging) {
        console.log("💥 Error occurred in license recovery:", error.message);
      }

      // Check if it's a rate limit error by attempting to parse the JSON
      try {
        if (logging) {
          console.log("🔍 Attempting to parse error as rate limit error");
        }
        const errorData = JSON.parse(error.message);
        if (logging) {
          console.log("📊 Parsed error data:", errorData);
        }

        // Verify this is actually a rate limit error by checking for expected properties
        if (errorData.status === 429) {
          if (logging) {
            console.log("🚫 Rate limit exceeded, returning 429 response");
          }
          return NextResponse.json(
            {
              error: errorData.error,
              message: `${defaultMessages.rateLimitExceeded} Please try again in ${errorData.formattedReset}.`,
            },
            {
              status: errorData.status,
              headers: {
                "X-RateLimit-Reset": errorData.reset,
                "X-RateLimit-Remaining": errorData.remaining.toString(),
              },
            }
          );
        }
      } catch (parseError) {
        if (logging) {
          console.log(
            "❌ Error is not a rate limit error (parse failed):",
            parseError.message
          );
        }
        // Not a rate limit error (wasn't JSON) or missing expected properties
      }

      // Handle other types of errors
      if (logging) {
        console.error("💀 Unexpected error in license recovery:", error);
      }
      
      if (onError) {
        return await onError(error);
      }
      
      return NextResponse.json(
        { error: defaultMessages.internalError },
        { status: 500 }
      );
    }
  };
}

// Default handler for backward compatibility
export const POST = createRecoverHandler();