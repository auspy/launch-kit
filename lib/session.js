import { z } from "zod";
import { NextResponse } from "next/server";

// Schema for session validation
export const sessionSchema = z.object({
  licenseKey: z
    .string()
    .regex(
      /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
      "Invalid license key format"
    ),
  email: z.string().email(),
});

// Consistent error response format
export function createErrorResponse(error, status = 500, headers = {}) {
  console.error(`API Error (${status}):`, error);
  return NextResponse.json(
    {
      error:
        typeof error === "string"
          ? error
          : error.message || "Internal server error",
      status,
      timestamp: new Date().toISOString(),
    },
    { status, headers }
  );
}

// Validate session and return parsed data
export async function validateSession(request) {
  try {
    const session = request.cookies.get("auth_token");

    if (!session?.value) {
      throw new Error("Authentication required");
    }
    const sessionData = JSON.parse(session.value);
    const validation = sessionSchema.safeParse(sessionData);

    if (!validation.success) {
      throw new Error("Invalid session data");
    }

    return validation.data;
  } catch (error) {
    console.error("Error validating session:", error);
    throw new Error(error.message || "Invalid session format");
  }
}
