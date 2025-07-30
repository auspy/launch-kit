import crypto from "crypto";

function generateApiKey() {
  try {
    // Generate a 32-byte random key
    const key = crypto.randomBytes(32);

    // Encode the binary key in base64
    const apiKey = key.toString("base64");

    return apiKey;
  } catch (error) {
    // Handle any errors that might occur
    console.error("Error generating API key:", error);
    return null;
  }
}

// Example usage:
const apiKey = generateApiKey();
if (apiKey) {
  console.log("Generated API key:", apiKey);
} else {
  console.log("Failed to generate API key.");
}
