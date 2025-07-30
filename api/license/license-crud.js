import { initializeDb } from "@/lib/db/initDb";
import { NextResponse } from "next/server";
import {
  createLicense,
  getLicenseDetails,
  validateLicense,
} from "@/lib/license/license.operations";
import { generateLicenseKey } from "@/lib/license/license.utils";
import {
  createLicenseSchema,
  licenseKeySchema,
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
 * Create a license CRUD handler (GET/POST for /api/license)
 * @param {Object} config - Configuration object
 */
export function createLicenseCRUDHandler(config = {}) {
  const {
    initDb = true,
    postEnabled = false, // License creation disabled by default (as in original)
    onLicenseCreated,
    onLicenseRetrieved,
    onError
  } = config;

  // POST handler - Create a new license
  const postHandler = async function(request) {
    try {
      if (initDb) {
        await initializeDb();
      }
      
      // License creation is disabled by default (matching original logic)
      if (!postEnabled) {
        return NextResponse.json({ message: "Hello World" }, { status: 200 });
      }

      const ip = getIP();

      // Apply rate limiting
      try {
        // Validate request using middleware (no hardware info needed for creation)
        const validationError = await validateLicenseRequest(request.clone(), {
          requireHardware: false,
        });
        if (validationError) return validationError;

        const { remaining } = await rateLimit(rateLimiters.licenseCreation, ip);
        // Add rate limit info to response headers
        const headers = {
          "X-RateLimit-Remaining": remaining.toString(),
        };

        const body = await request.json();

        // Validate request schema
        try {
          await validateRequest(createLicenseSchema, body);
        } catch (validationError) {
          return NextResponse.json(
            {
              error: "Validation error",
              details: JSON.parse(validationError.message),
            },
            { status: 400, headers }
          );
        }

        const { email } = body;

        // Generate a unique license key
        const licenseKey = await generateLicenseKey();

        // Create the license
        const license = await createLicense({ licenseKey, email });

        if (!license) {
          return NextResponse.json(
            { error: "Failed to create license" },
            { status: 500, headers }
          );
        }

        // Custom success processing
        if (onLicenseCreated) {
          await onLicenseCreated(license, body);
        }

        return NextResponse.json({ license }, { status: 201, headers });
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
      console.error("License creation error:", error);
      
      if (onError) {
        return await onError(error, 'create');
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };

  // GET handler - Get license details
  const getHandler = async function(request) {
    try {
      const ip = getIP();

      // Apply rate limiting
      try {
        // Validate request using middleware (no hardware info or timestamp needed for GET)
        const validationError = await validateLicenseRequest(request.clone(), {
          requireHardware: false,
          requireTimestamp: false,
        });
        if (validationError) return validationError;

        const { remaining } = await rateLimit(rateLimiters.licenseValidation, ip);
        // Add rate limit info to response headers
        const headers = {
          "X-RateLimit-Remaining": remaining.toString(),
        };

        const { searchParams } = new URL(request.url);
        const licenseKey = searchParams.get("key");

        // Validate license key format
        try {
          await validateRequest(licenseKeySchema, licenseKey);
        } catch (validationError) {
          return NextResponse.json(
            { error: "Invalid license key format" },
            { status: 400, headers }
          );
        }

        const license = await getLicenseDetails(licenseKey);

        if (!license) {
          return NextResponse.json(
            { error: "License not found" },
            { status: 404, headers }
          );
        }

        // Custom success processing
        if (onLicenseRetrieved) {
          await onLicenseRetrieved(license, request);
        }

        return NextResponse.json({ license }, { headers });
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
      console.error("License retrieval error:", error);
      
      if (onError) {
        return await onError(error, 'get');
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };

  return {
    POST: postHandler,
    GET: getHandler
  };
}

// Default handlers for backward compatibility
const defaultHandlers = createLicenseCRUDHandler();
export const POST = defaultHandlers.POST;
export const GET = defaultHandlers.GET;