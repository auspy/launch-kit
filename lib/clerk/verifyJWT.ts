// import { createClerkClient } from "@clerk/backend";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_API_BASE = "https://api.clerk.com/v1";

// Cache to store session statuses
const sessionCache = new Map<string, { status: string; expiresAt: number }>();

export async function verifyJWT(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    console.log("No authorization header");
    return false;
  }

  const [, encryptedPayload] = authHeader.split(" ");

  // Decrypt payload
  const decryptedPayload = await decryptPayload(encryptedPayload);
  if (!decryptedPayload) {
    console.log("Decrypted payload is null");
    return false;
  }

  const [sessionId, timestamp, userDataString] =
    decryptedPayload.split("::||::");

  // Verify timestamp (e.g., within last 5 minutes)
  const now = Date.now();
  const payloadTime = parseInt(timestamp, 10);
  if (now - payloadTime > 5 * 60 * 1000) {
    console.log("Payload timestamp is too old");
    return false;
  }

  // Parse user data
  let userData: { id: string; type: string };
  try {
    userData = JSON.parse(userDataString);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return false;
  }

  // Verify session
  try {
    const isSessionActive = await checkSessionStatus(sessionId);
    if (!isSessionActive) {
      console.log("Session is not active");
      return false;
    }
    return { userId: userData.id, userType: userData.type };
  } catch (error) {
    console.error("Error verifying session:", error);
    return false;
  }
}

async function checkSessionStatus(sessionId: string): Promise<boolean> {
  const cachedSession = sessionCache.get(sessionId);
  if (cachedSession && cachedSession.expiresAt > Date.now()) {
    return cachedSession.status === "active";
  }

  try {
    const response = await fetch(`${CLERK_API_BASE}/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const sessionData = await response.json();
    const isActive = sessionData.status === "active";

    // Calculate cache expiry (1 day from now)
    const oneDayFromNow = Date.now() + 24 * 60 * 60 * 1000;

    // Parse session expiry from the response
    const sessionExpiry = new Date(sessionData.expire_at).getTime();

    // Use the earlier of the two expiry times
    const cacheExpiry = Math.min(oneDayFromNow, sessionExpiry);

    // Cache the result
    sessionCache.set(sessionId, {
      status: sessionData.status,
      expiresAt: cacheExpiry,
    });

    return isActive;
  } catch (error) {
    console.error("Error checking session status:", error);
    return false;
  }
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// export async function verifyJWTClerk(req: Request) {
//   const clerkClient = createClerkClient({
//     secretKey: process.env.CLERK_SECRET_KEY,
//     publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
//   });

//   const { isSignedIn } = await clerkClient.authenticateRequest(req, {
//     jwtKey: process.env.CLERK_JWT_KEY,
//   });

//   return isSignedIn;
// }

function base64ToPEM(base64: string): string {
  return atob(base64);
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const pemContents = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  return base64ToArrayBuffer(pemContents);
}

async function decryptPayload(
  encryptedPayload: string
): Promise<string | null> {
  try {
    const pemKey = base64ToPEM(PRIVATE_KEY);
    const privateKeyBuffer = pemToArrayBuffer(pemKey);
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false,
      ["decrypt"]
    );

    const encryptedBuffer = base64ToArrayBuffer(encryptedPayload);
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedBuffer
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error("Error decrypting payload:", error);
    return null;
  }
}
