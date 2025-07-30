import { NextResponse } from "next/server";
import { getLicensesCollection } from "@/adapters/license.db";
import { validateLicenseRequest } from "@/lib/middleware";
import { validateSession, createErrorResponse } from "@/lib/session";

/**
 * Create a license info handler
 * @param {Object} config - Configuration object
 */
export function createInfoHandler(config = {}) {
  const {
    requireSession = true,
    useMiddlewareValidation = false,
    projection = {},
    onInfoRetrieved,
    onError
  } = config;

  const defaultProjection = {
    licenseKey: 1,
    email: 1,
    status: 1,
    maxDevices: 1,
    activeDevices: 1,
    createdAt: 1,
    updatedAt: 1,
    licenseType: 1,
    nextBillingDate: 1,
    cancelled: 1,
    cancelledAt: 1,
    ...projection
  };

  return async function infoHandler(request) {
    try {
      // Optional middleware validation (commented out in original)
      if (useMiddlewareValidation) {
        const validationError = await validateLicenseRequest(request.clone(), {
          requireHardware: false,
        });
        if (validationError) return validationError;
      }

      // Validate session and get license key
      const session = await validateSession(request);

      const collection = await getLicensesCollection();

      // Find the license and its devices using index
      const license = await collection.findOne(
        {
          licenseKey: session.licenseKey,
          // status: "active", // Commented out in original
        },
        {
          projection: defaultProjection,
        }
      );

      if (!license) {
        return createErrorResponse("License not found or inactive", 404);
      }

      // Prepare response data
      const response = {
        license: {
          licenseKey: license.licenseKey,
          email: license.email,
          status: license.status,
          activationLimit: license.maxDevices,
          activatedDevices: license.activeDevices?.length || 0,
          createdAt: license.createdAt,
          updatedAt: license.updatedAt,
          licenseType: license.licenseType,
          nextBillingDate: license.nextBillingDate,
          cancelled: license.cancelled,
          cancelledAt: license.cancelledAt,
        },
        devices: license.activeDevices || [],
      };

      // Custom success processing
      if (onInfoRetrieved) {
        await onInfoRetrieved(response, session);
      }

      return NextResponse.json(response);
    } catch (error) {
      if (onError) {
        return await onError(error);
      }

      return createErrorResponse(
        error,
        error.message.includes("Authentication") ? 401 : 500
      );
    }
  };
}

// Set dynamic rendering (same as original)
export const dynamic = "force-dynamic";

// Default handler for backward compatibility
export const GET = createInfoHandler();