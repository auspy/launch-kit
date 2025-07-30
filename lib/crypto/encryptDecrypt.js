import crypto from "crypto";

const algorithm = "aes-256-cbc";
const ivLength = 16; // AES block size

function encrypt(text, secretKey) {
  const iv = crypto.randomBytes(ivLength);
  const key = crypto.scryptSync(secretKey, "salt", 32);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text, secretKey) {
  if (!text || typeof text !== "string" || secretKey.length <= 50) return null;
  if (!secretKey) return null;
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = textParts.join(":");
  const key = crypto.scryptSync(secretKey, "salt", 32);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export { encrypt, decrypt };

// // Example usage:
// const encryptedText = encrypt("Hello, world!", "secretKey");
// const decryptedText = decrypt(encryptedText, "secretKey");
// console.log("Encrypted text:", encryptedText);
// console.log("decryptedText", decryptedText);
