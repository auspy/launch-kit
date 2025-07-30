import { getMongoClient } from "./mongodb";

export const WEBHOOK_DB = "focus_app";
export const WEBHOOK_EVENTS_COLLECTION = "webhook_events";

export async function initializeWebhookCollection() {
  const db = await getMongoClient(WEBHOOK_DB);

  await db.createCollection(WEBHOOK_EVENTS_COLLECTION);

  // Create indexes
  const collection = db.collection(WEBHOOK_EVENTS_COLLECTION);
  await collection.createIndex({ webhookId: 1 }, { unique: true });
  await collection.createIndex({ processedAt: 1 });
}

export async function getWebhookCollection() {
  const client = await getMongoClient(WEBHOOK_DB);
  return client.collection(WEBHOOK_EVENTS_COLLECTION);
}
