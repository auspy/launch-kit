import crypto from "crypto";

function generateKey(prefix = "vsk_live_", length = 64) {
  // Generate a secure random string
  const randomString = crypto.randomBytes(length / 2).toString("hex");

  // Create the final key
  const finalKey = `${prefix}${randomString}`;

  return finalKey;
}

const key = generateKey();
console.log(key);
