import crypto from "crypto";
import redisClient from "../redis/redis.config";
import { getMongoClient } from "@/adapters/mongodb";
import { auth } from "@clerk/nextjs/server";

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
    const authHeader = req.headers.get("authorization");
    console.log("authHeader", authHeader);
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    // Extract appId and encryptedPayload from Authorization header
    const authMessage = authHeader.split(" ")[1];
    const [appId, ...rest] = authHeader.split(" ")[1].split(":");
    const secretKey =
      appId === "100xdevs"
        ? process.env.VIZOLV_SECRET_KEY_100XDEVS
        : process.env.VIZOLV_SECRET_KEY; // ! later secret key will be fetched from some key management system
    const encryptedPayload = rest.join(":");

    // verify the signature
    const signature = req.headers.get("x-vizolv");
    if (!signature) {
      throw new Error("Signature header missing");
    }

    if (!verifySignature(authMessage, signature, secretKey)) {
      throw new Error("Invalid signature");
    }

    // Decrypt the payload using the secret key
    const decryptedPayload = decryptPayload(encryptedPayload, secretKey);

    const { apiKey, nonce, timestamp } = decryptedPayload;

    // Validate timestamp
    const timestampDate = new Date(timestamp);
    if (isTimestampExpired(timestampDate)) {
      throw new Error("Timestamp expired");
    }

    // Validate nonce
    if (await isNonceUsed(nonce)) {
      throw new Error("Nonce already used");
    }
    // Connect to the database
    const db = await getMongoClient("vizolv");

    // Find user by appId
    const user = await db
      .collection("users")
      .findOne(
        { appId, apiKey },
        { projection: { vectorIndex: 1, appId: 1, db: 1, _id: 0 } },
      );

    if (!user) {
      throw new Error("User not found");
    }
    // Store the nonce
    await storeNonce(nonce);

    return user;
  } catch (e) {
    console.error("Error in verifyUser:", e.message);
    throw e;
  }
}
