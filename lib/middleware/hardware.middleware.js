import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";

// Constants
const REQUIRED_HARDWARE_FIELDS = ["os", "hostname", "arch", "platform"];
const HARDWARE_ID_LENGTH = 64; // SHA-256 hash length

// Hardware info schema (matching the validation route schema)
export const hardwareInfoSchema = z.object({
  os: z.string().min(1, "OS information is required"),
  hostname: z.string().min(1, "Hostname is required"),
  arch: z.string().min(1, "Architecture information is required"),
  platform: z.string().min(1, "Platform information is required"),
  hardwareId: z.string(),
  cpus: z.number().optional(),
  networkInterfaces: z.record(z.any()).optional(),
  totalMemory: z.string().optional(),
});

// Error response helper
function errorResponse(message, status = 400, details = null) {
  const error = {
    error: message,
    code: status,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    error.details = details;
  }

  return NextResponse.json(error, { status });
}

// Generate hardware ID from hardware info
export function generateHardwareId(hardwareInfo) {
  // Get required fields in sorted order
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error("SECRET_KEY is not set");
  }
  const sortedValues = REQUIRED_HARDWARE_FIELDS.sort()
    .map((key) => hardwareInfo[key])
    .join("");

  // Create hash of concatenated values
  const hash = crypto.createHash("sha256");
  hash.update(sortedValues + secretKey);
  return hash.digest("hex");
}

// Validate hardware info format
export function validateHardwareInfo(hardwareInfo) {
  if (!hardwareInfo || typeof hardwareInfo !== "object") {
    console.error(
      "[Hardware Middleware] Invalid hardware info format:",
      hardwareInfo
    );
    return errorResponse("Invalid hardware info format", 400);
  }

  try {
    // Validate using Zod schema
    return hardwareInfoSchema.parse(hardwareInfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[Hardware Middleware] Hardware info validation failed:", {
        errors: error.errors,
        hardwareInfo,
      });
      throw new Error("Invalid hardware info");
    }
    throw error;
  }
}

// Validate hardware ID consistency
export function validateHardwareIdConsistency(
  hardwareInfo,
  providedHardwareId
) {
  if (!providedHardwareId || providedHardwareId.length !== HARDWARE_ID_LENGTH) {
    console.error("[Hardware Middleware] Invalid hardware ID format:", {
      providedId: providedHardwareId,
      expectedLength: HARDWARE_ID_LENGTH,
      actualLength: providedHardwareId?.length,
    });
    return errorResponse("Invalid hardware ID format", 400);
  }

  const calculatedHardwareId = generateHardwareId(hardwareInfo);
  console.log(
    "[Hardware Middleware] Calculated hardware ID:",
    calculatedHardwareId,
    providedHardwareId
  );
  if (calculatedHardwareId !== providedHardwareId) {
    console.error("[Hardware Middleware] Hardware ID mismatch:", {
      provided: providedHardwareId,
      calculated: calculatedHardwareId,
      hardwareInfo,
    });
    return errorResponse("Hardware ID mismatch", 400);
  }

  return null;
}

// Main hardware validation middleware
export async function hardwareMiddleware(request) {
  const startTime = Date.now();
  console.log("[Hardware Middleware] Starting hardware validation");
  try {
    const body = await request.json();
    console.log("[Hardware Middleware] Hardware body:", body);

    if (!body.hardwareInfo) {
      console.error(
        "[Hardware Middleware] Missing hardware info in request body:",
        {
          body,
          requestHeaders: Object.fromEntries(request.headers),
        }
      );
      return errorResponse("Missing hardware info", 400);
    }

    // Validate hardware info format
    console.log("[Hardware Middleware] Validating hardware info format");
    const hardwareInfo = validateHardwareInfo(body.hardwareInfo);
    // If hardware ID is provided, validate consistency
    if (hardwareInfo.hardwareId) {
      console.log("[Hardware Middleware] Validating hardware ID consistency");
      const consistencyError = validateHardwareIdConsistency(
        hardwareInfo,
        hardwareInfo.hardwareId
      );
      if (consistencyError) {
        console.error(
          "[Hardware Middleware] Hardware ID consistency check failed:",
          {
            providedId: hardwareInfo.hardwareId,
            hardwareInfo: hardwareInfo,
            error: consistencyError,
          }
        );
        return consistencyError;
      }
    } else {
      console.warn("[Hardware Middleware] No hardware ID provided");
      throw new Error("No hardware ID provided");
    }

    // If all validations pass, continue
    const duration = Date.now() - startTime;
    console.log(
      `[Hardware Middleware] Hardware validation successful (${duration}ms)`
    );
    return null;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("[Hardware Middleware] Error processing request:", {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      duration,
      requestHeaders: Object.fromEntries(request.headers),
    });
    return errorResponse("Invalid request body", 400);
  }
}
