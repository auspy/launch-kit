import crypto from "crypto";
import redisClient from "../redis/redis.config";
import { getMongoClient } from "@/adapters/mongodb";

// Function to decrypt payload
const decryptPayload = (encryptedPayload, secretKey) => {
  if (!secretKey) {
    throw new Error("Missing secretKey");
  }
  if (!encryptedPayload) {
    throw new Error("Missing encryptedPayload");
  }
  const [ivHex, encryptedData] = encryptedPayload.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.createHash("sha256").update(secretKey).digest();

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
};

// Function to check if timestamp is expired
const isTimestampExpired = (timestamp) => {
  const now = new Date();
  const acceptableRange = 600000; // 5 minutes in milliseconds
  return now - timestamp > acceptableRange;
};

// Function to check if nonce is used
const isNonceUsed = async (nonce) => {
  return new Promise((resolve, reject) => {
    redisClient.exists(nonce, (err, reply) => {
      if (err) reject(err);
      resolve(reply === 1);
    });
  });
};

// Function to store nonce in Redis with an expiration time
const storeNonce = async (nonce) => {
  return new Promise((resolve, reject) => {
    const expirationTime = 3600; // 1 hour in seconds
    redisClient.set(nonce, "used");
    redisClient.expire(nonce, expirationTime);
    resolve();
  });
};

// Function to verify the HMAC signature
const verifySignature = (message, signature, secretKey) => {
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(message);
  const expectedSignature = hmac.digest("hex");
  return signature === expectedSignature;
};

export default async function verifyUser(req) {
  try {
    console.log("--- Starting verification process");
    const authHeader = req.headers.get("authorization");
    // console.log("Authorization header:", authHeader);

    if (!authHeader) {
      // console.log("Authorization header missing");
      throw new Error("Authorization header missing");
    }

    // Extract appId and encryptedPayload from Authorization header
    const authMessage = authHeader.split(" ")[1];
    const [appId, ...rest] = authHeader.split(" ")[1].split(":");
    const secretKey =
      appId === "100xdevs"
        ? process.env.VIZOLV_SECRET_KEY_100XDEVS
        : process.env.VIZOLV_SECRET_KEY; // ! later secret key will be fetched from some key management system
    // console.log("Extracted appId:", appId);
    // console.log("Extracted appId:", appId);
    const encryptedPayload = rest.join(":");
    // console.log("Extracted encryptedPayload:", encryptedPayload);

    // verify the signature
    const signature = req.headers.get("x-vizolv");
    // console.log("Signature header:", signature);
    if (!signature) {
      // console.log("Signature header missing");
      throw new Error("Signature header missing");
    }

    if (!verifySignature(authMessage, signature, secretKey)) {
      // console.log("Invalid signature");
      throw new Error("Invalid signature");
    }

    // Connect to the database
    // console.log("Connecting to the database");
    const db = await getMongoClient("vizolv");

    // Find user by appId
    // console.log(`Finding user with appId: ${appId}`);
    const user = await db
      .collection("users")
      .findOne(
        { appId },
        { projection: { vectorIndex: 1, db: 1, apiKey: 1, _id: 0 } },
      );

    if (!user) {
      // console.log("User not found");
      throw new Error("User not found");
    }
    // console.log("User found:", user);

    // console.log("Decrypting payload with secret key");
    // Decrypt the payload using the secret key
    const decryptedPayload = decryptPayload(encryptedPayload, secretKey);
    // console.log("Decrypted payload:", decryptedPayload);

    const { apiKey, nonce, timestamp } = decryptedPayload;

    // Validate API key
    // console.log("Validating API key");
    if (apiKey !== user.apiKey) {
      // console.log("Invalid API key");
      throw new Error("Invalid API key");
    }
    // console.log("API key validated");

    // Validate timestamp
    // console.log("Validating timestamp");
    const timestampDate = new Date(timestamp);
    if (isTimestampExpired(timestampDate)) {
      // console.log("Timestamp expired");
      throw new Error("Timestamp expired");
    }
    // console.log("Timestamp validated");

    // Validate nonce
    // console.log("Validating nonce");
    if (await isNonceUsed(nonce)) {
      // console.log("Nonce already used");
      throw new Error("Nonce already used");
    }
    // console.log("Nonce validated");

    // Store the nonce
    // console.log("Storing nonce");
    await storeNonce(nonce);

    console.log("Verification successful");
    return [user.vectorIndex, user.db];
  } catch (e) {
    console.error("Error in verifyUser:", e.message);
    throw e;
  }
}
