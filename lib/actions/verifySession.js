import { verifyCsrfToken } from "../crypto/csrfToken";
import { decrypt } from "../crypto/encryptDecrypt";
import { isDev } from "@/constants";
import { auth } from "@clerk/nextjs/server";
import redisClient from "../redis/redis.config";

const trustedDomains = ["https://www.vizolv.com"];
if (isDev) {
  trustedDomains.push("http://localhost:3000");
}

// returns an array of [appId, vectorIndex, db]
export default async function verifySession(req) {
  try {
    // Check if the user has a trusted domain
    const headers = req.headers;
    const origin = headers.get("origin");
    console.log("Verifying user session from url", origin);
    const trustedDomain = trustedDomains.includes(origin);

    if (trustedDomain) {
      // Check if the user is authenticated from the clerk
      const { userId } = auth();
      if (!userId) {
        throw new Error("User not authenticated");
      }
      return ["ytviz", "yt-vizolv", "yt_vizolv"];
    }
    // Verify session using auth header
    let sessionToken = headers.get("authorization")?.split(" ")[1];
    // console.log("headers", headers);
    if (!sessionToken) {
      throw new Error("Session token not found");
    }
    sessionToken = decodeURIComponent(sessionToken);
    console.log("sessionToken", sessionToken);
    const secretKey = process.env.VIZOLV_SESSION_SECRET_KEY;
    const decryptedSessionToken = decrypt(sessionToken, secretKey);
    console.log("decryptedSessionToken", decryptedSessionToken);
    if (!decryptedSessionToken) {
      throw new Error("Decryption failed");
    }

    // Check if the session data is in the cache
    let data = global.cacheSessions?.get(decryptedSessionToken);
    if (!data) {
      // If not in global.cacheSessions, fetch from Redis
      data = await redisClient.hgetall(decryptedSessionToken);
      if (!data) {
        throw new Error("Data not found in redis");
      }

      // Cache the data for future requests
      global.cacheSessions?.set(decryptedSessionToken, data);
    }
    console.log("data from redis", data);
    const { appId, vectorIndex, csrfToken, db } = data;

    // Check if the CSRF token is valid
    verifyCsrfToken(csrfToken);

    return [appId, vectorIndex, db];
  } catch (e) {
    console.error("Error in verifySession", e.message);
    throw e;
  }
}
