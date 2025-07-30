import { initializeLicenseCollection } from "@/adapters/license.db";
import { initializeWebhookCollection } from "@/adapters/webhook.db";
import { initializeOnboardingCollection } from "@/adapters/onboarding.db";

let isInitialized = false;

export async function initializeDb() {
  // Only initialize once
  if (isInitialized) return;

  try {
    await Promise.all([
      initializeLicenseCollection(),
      initializeWebhookCollection(),
      initializeOnboardingCollection(),
    ]);
    console.log("✅ Database collections initialized successfully");
    isInitialized = true;
  } catch (error) {
    console.error("❌ Failed to initialize database collections:", error);
    // if code is 48 dont throw error
    if (error.code === 48) {
      console.log("MongoDB collections already initialized");
    } else {
      console.log(error);
      throw error;
    }
  }
}
