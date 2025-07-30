export const DODO_WEBHOOK_EVENT_TYPES = {
  // Payment events
  PAYMENT_SUCCEEDED: "payment.succeeded",
  PAYMENT_FAILED: "payment.failed", 
  PAYMENT_PROCESSING: "payment.processing",
  PAYMENT_CANCELLED: "payment.cancelled",

  // Refund events
  REFUND_SUCCEEDED: "refund.succeeded",
  REFUND_FAILED: "refund.failed",

  // Dispute events
  DISPUTE_OPENED: "dispute.opened",
  DISPUTE_EXPIRED: "dispute.expired",
  DISPUTE_ACCEPTED: "dispute.accepted", 
  DISPUTE_CANCELLED: "dispute.cancelled",
  DISPUTE_CHALLENGED: "dispute.challenged",
  DISPUTE_WON: "dispute.won",
  DISPUTE_LOST: "dispute.lost",

  // Subscription events
  SUBSCRIPTION_ACTIVE: "subscription.active",
  SUBSCRIPTION_ON_HOLD: "subscription.on_hold",
  SUBSCRIPTION_PAUSED: "subscription.paused",
  SUBSCRIPTION_CANCELLED: "subscription.cancelled",
  SUBSCRIPTION_FAILED: "subscription.failed",
  SUBSCRIPTION_EXPIRED: "subscription.expired"
};
