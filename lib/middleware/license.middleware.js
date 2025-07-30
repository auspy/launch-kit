import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Constants
const MAX_REQUEST_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds
const REQUIRED_HEADERS = ["content-type", "x-request-timestamp"];

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

// Validate request timestamp
export function validateTimestamp(request) {
  const headersList = headers();
  const timestamp = headersList.get("x-request-timestamp");

  if (!timestamp) {
    console.warn("[License Middleware] Missing request timestamp header");
    return errorResponse("Missing request timestamp", 400);
  }

  const requestTime = parseInt(timestamp) * 1000; // Convert to milliseconds
  if (isNaN(requestTime)) {
    console.warn("[License Middleware] Invalid timestamp format:", timestamp);
    return errorResponse("Invalid timestamp format", 400);
  }

  const now = Date.now();
  const age = now - requestTime;

  if (age > MAX_REQUEST_AGE || age < 0) {
    console.warn(
      `[License Middleware] Invalid timestamp age: ${age}ms, timestamp: ${timestamp}, now: ${now}`
    );
    return errorResponse("Request timestamp expired or invalid", 400);
  }

  return null;
}

// Validate required headers
export function validateHeaders(request) {
  const headersList = headers();
  const contentType = headersList.get("content-type");

  // Check content type
  if (!contentType || !contentType.includes("application/json")) {
    console.warn("[License Middleware] Invalid content type:", contentType);
    return errorResponse("Invalid content type", 400);
  }

  // Check required headers
  const missingHeaders = REQUIRED_HEADERS.filter(
    (header) => !headersList.get(header)
  );

  if (missingHeaders.length > 0) {
    console.warn(
      "[License Middleware] Missing required headers:",
      missingHeaders
    );
    return errorResponse("Missing required headers", 400, {
      missingHeaders,
    });
  }

  return null;
}

// Main middleware handler
export async function licenseMiddleware(request) {
  console.log("[License Middleware] Starting request validation");

  // Validate headers first
  const headerError = validateHeaders(request);
  if (headerError) {
    console.warn("[License Middleware] Header validation failed");
    return headerError;
  }

  // Validate timestamp
  const timestampError = validateTimestamp(request);
  if (timestampError) {
    console.warn("[License Middleware] Timestamp validation failed");
    return timestampError;
  }

  // If all validations pass, continue
  console.log("[License Middleware] Request validation successful");
  return null;
}
