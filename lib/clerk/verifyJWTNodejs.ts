import crypto from "crypto";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_API_BASE = "https://api.clerk.com/v1";

// Cache to store session statuses
const sessionCache = new Map<string, { status: string; expiresAt: number }>();

export async function verifyJWT(req: Request) {
  if (!req) {
    console.log("No authorization header");
    return false;
  }
  const authHeader = req.headers.get("Authorization");
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

function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, "base64");
}

function pemToBuffer(pem: string): Buffer {
  return Buffer.from(
    pem
      .replace(/-----BEGIN PRIVATE KEY-----/, "")
      .replace(/-----END PRIVATE KEY-----/, "")
      .replace(/\s/g, ""),
    "base64"
  );
}

async function decryptPayload(
  encryptedPayload: string
): Promise<string | null> {
  try {
    const privateKey = crypto.createPrivateKey({
      key: pemToBuffer(Buffer.from(PRIVATE_KEY, "base64").toString("ascii")),
      format: "der",
      type: "pkcs8",
    });

    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      base64ToBuffer(encryptedPayload)
    );

    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Error decrypting payload:", error);
    return null;
  }
}
