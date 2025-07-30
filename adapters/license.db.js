import { getMongoClient } from "./mongodb";

// Database name for licenses
export const LICENSE_DB = "focus_app";
export const LICENSES_COLLECTION = "licenses";

// Initialize license collection with schema validation and indexes
export async function initializeLicenseCollection() {
  const db = await getMongoClient(LICENSE_DB);

  await db.createCollection(LICENSES_COLLECTION);

  // Create indexes
  const collection = db.collection(LICENSES_COLLECTION);
  await collection.createIndex({ licenseKey: 1 }, { unique: true });
  await collection.createIndex({ email: 1 });
  await collection.createIndex({ status: 1 });
  await collection.createIndex({ "activeDevices.deviceId": 1 });
  await collection.createIndex({ "activeDevices.hardwareId": 1 });
  await collection.createIndex({ "activeDevices.lastUsedAt": 1 });
}

// Helper function to get the licenses collection
export async function getLicensesCollection() {
  const client = await getMongoClient(LICENSE_DB);
  return client.collection(LICENSES_COLLECTION);
}
