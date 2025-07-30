/**
 * Dodo Payments API client - SDK wrapper
 * Documentation: https://github.com/dodopayments/dodopayments-node/blob/main/api.md
 */
import { dodo } from "./dodo.config";

/**
 * Update a subscription status in Dodo Payments using the SDK
 * @param {string} subscriptionId - The subscription ID to update
 * @param {string} status - New status: "cancelled", "active", "paused", etc.
 * @returns {Promise<Object>} - Response from Dodo SDK
 */
export async function updateSubscriptionStatus(subscriptionId, status) {
  if (!subscriptionId) {
    throw new Error("Subscription ID is required");
  }

  try {
    console.log(
      `Updating Dodo subscription ${subscriptionId} to status: ${status}`
    );

    // Use the SDK to update subscription status
    const updatedSubscription = await dodo.subscriptions.update(
      subscriptionId,
      {
        status,
      }
    );

    console.log(
      "Dodo subscription updated successfully:",
      updatedSubscription.subscription_id
    );
    return updatedSubscription;
  } catch (error) {
    console.error("Error updating Dodo subscription:", error);
    throw error;
  }
}

/**
 * Get subscription details from Dodo Payments using the SDK
 * @param {string} subscriptionId - The subscription ID to fetch
 * @returns {Promise<Object>} - Subscription data from Dodo API
 */
export async function getSubscriptionDetails(subscriptionId) {
  if (!subscriptionId) {
    throw new Error("Subscription ID is required");
  }

  try {
    // Use the SDK to retrieve subscription details
    const subscription = await dodo.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error fetching Dodo subscription:", error);
    throw error;
  }
}
