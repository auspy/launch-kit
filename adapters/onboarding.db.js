import { getMongoClient } from "./mongodb";

export const ONBOARDING_DB = "focus_app";
export const ONBOARDING_COLLECTION = "onboarding_data";

// Initialize onboarding collection with schema validation and indexes
export async function initializeOnboardingCollection() {
  const db = await getMongoClient(ONBOARDING_DB);

  await db.createCollection(ONBOARDING_COLLECTION);

  // Create indexes
  const collection = db.collection(ONBOARDING_COLLECTION);
  await collection.createIndex({ hardwareId: 1 });
  await collection.createIndex({ timestamp: 1 });
  await collection.createIndex({ "challenges.title": 1 });
  await collection.createIndex({ goals: 1 });
  await collection.createIndex({ age: 1 });
  await collection.createIndex({ profession: 1 });
}

// Helper function to get the onboarding collection
export async function getOnboardingCollection() {
  const client = await getMongoClient(ONBOARDING_DB);
  return client.collection(ONBOARDING_COLLECTION);
}
