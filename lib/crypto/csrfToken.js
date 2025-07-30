import crypto from "crypto";
import { headers } from "next/headers";

export function generateCsrfToken() {
  const csrfToken = crypto.randomBytes(16).toString("hex");
  return csrfToken;
}

export function verifyCsrfToken(correctToken) {
  // check if the csrf token is valid
  const headersList = headers();
  const headerToken = headersList.get("x-csrf-token");
  console.log("headerToken", headerToken, correctToken);
  if (!headerToken || headerToken !== correctToken) {
    throw new Error("Invalid CSRF token");
  }
  return true;
}

// console.log("csrfToken", generateCsrfToken());
