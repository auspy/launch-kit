import { z } from "zod";

// Schema for the customer object
const customerSchema = z
  .object({
    customer_id: z.string(),
    name: z.string(),
    email: z.string().email(),
  })
  .strict();

// Schema for product cart items
const productCartItemSchema = z
  .object({
    product_id: z.string(),
    quantity: z.number().int().positive(),
  })
  .strict();

// Schema for subscription data
const subscriptionDataSchema = z.object({
  payload_type: z.literal("Subscription"),
  product_id: z.string(),
  payment_frequency_interval: z.enum(["Month", "Year"]),
  customer: customerSchema,
  subscription_id: z.string(),
  recurring_pre_tax_amount: z.number().positive(),
  created_at: z.string().datetime(),
  next_billing_date: z.string().datetime(),
});

// Schema for subscription active webhook
export const subscriptionActiveWebhookSchema = z.object({
  type: z.literal("subscription.active"),
  data: subscriptionDataSchema,
});

// Schema for the main webhook payload
export const webhookPayloadSchema = z
  .object({
    business_id: z.string(),
    type: z.string(),
    timestamp: z.string().datetime(),
    data: z
      .object({
        payload_type: z.string(),
        payment_id: z.string(),
        business_id: z.string(),
        status: z.string(),
        total_amount: z.number().positive(),
        currency: z.string(),
        payment_method: z.string(),
        payment_method_type: z.string().nullable(),
        created_at: z.string().datetime(),
        updated_at: z.string().datetime().nullable(),
        disputes: z.array(z.any()),
        refunds: z.array(z.any()),
        customer: customerSchema,
        subscription_id: z.string().nullable(),
        product_cart: z.array(productCartItemSchema).nullable(),
        payment_link: z.string().url(),
        tax: z.any().nullable(),
        metadata: z.record(z.any()).default({}),
      })
      .strict(),
  })
  .strict();

// Schema for webhook headers
export const webhookHeadersSchema = z
  .object({
    "webhook-id": z.string().min(1),
    "webhook-timestamp": z.string().min(1),
    "webhook-signature": z.string().regex(/^v1,[A-Za-z0-9+/=]+$/),
  })
  .strict();

// Schema for the document to be stored in MongoDB
export const webhookDocumentSchema = z
  .object({
    webhookId: z.string(),
    eventType: z.string(),
    processedAt: z.date(),
    status: z.enum(["success", "error"]),
    payload: z.object({}).passthrough(), // Allow any object structure for flexibility
  })
  .strict();

// Schema for payment succeeded data
const paymentSucceededDataSchema = z.object({
  payload_type: z.literal("Payment"),
  payment_id: z.string(),
  status: z.literal("succeeded"),
  total_amount: z.number().min(0),
  customer: customerSchema,
  // For subscription payments
  subscription_id: z.string().nullable(),
  // For one-time payments
  product_cart: z.array(productCartItemSchema).nullable(),
  // Custom metadata from checkout
  metadata: z.record(z.any()).default({}),
});

// Schema for payment failed data
const paymentFailedDataSchema = z.object({
  payload_type: z.literal("Payment"),
  payment_id: z.string(),
  status: z.literal("failed"),
  total_amount: z.number().min(0),
  customer: customerSchema,
  // For subscription payments
  subscription_id: z.string().nullable(),
  // For one-time payments
  product_cart: z.array(productCartItemSchema).nullable(),
  // Failure details
  error_code: z.string().optional(),
  error_message: z.string().optional(),
  // Custom metadata from checkout
  metadata: z.record(z.any()).default({}),
});

// Schema for refund succeeded data
const refundSucceededDataSchema = z.object({
  payload_type: z.literal("Refund"),
  refund_id: z.string(),
  payment_id: z.string().nullable(),
  status: z.literal("succeeded"),
  total_amount: z.number().positive(),
  customer: customerSchema,
  subscription_id: z.string().nullable(),
});

// Schema for refund succeeded webhook
export const refundSucceededWebhookSchema = z.object({
  type: z.literal("refund.succeeded"),
  data: refundSucceededDataSchema,
});

// Schema for payment succeeded webhook
export const paymentSucceededWebhookSchema = z.object({
  type: z.literal("payment.succeeded"),
  data: paymentSucceededDataSchema,
});

// Schema for payment failed webhook
export const paymentFailedWebhookSchema = z.object({
  type: z.literal("payment.failed"),
  data: paymentFailedDataSchema,
});

// Schema for subscription cancellation/expiry data
const subscriptionEndDataSchema = z.object({
  payload_type: z.literal("Subscription"),
  subscription_id: z.string(),
  customer: customerSchema,
  status: z.enum(["cancelled", "expired", "failed"]),
  next_billing_date: z.string().datetime().optional(),
});

// Schema for subscription cancelled webhook
export const subscriptionCancelledWebhookSchema = z.object({
  type: z.literal("subscription.cancelled"),
  data: subscriptionEndDataSchema,
});

// Schema for subscription expired webhook
export const subscriptionExpiredWebhookSchema = z.object({
  type: z.literal("subscription.expired"),
  data: subscriptionEndDataSchema,
});

// Schema for subscription failed webhook
export const subscriptionFailedWebhookSchema = z.object({
  type: z.literal("subscription.failed"),
  data: subscriptionEndDataSchema,
});

// Schema for subscription renewed webhook
export const subscriptionRenewedWebhookSchema = z.object({
  type: z.literal("subscription.renewed"),
  data: subscriptionDataSchema,
});

// Helper function to validate webhook payload with detailed error logging
export function validateWebhookPayload(payload) {
  try {
    return webhookPayloadSchema.parse(JSON.parse(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Webhook payload validation failed:", {
        issues: error.issues,
        payload: JSON.parse(payload),
      });
    }
    throw error;
  }
}

// Helper function to validate webhook headers with detailed error logging
export function validateWebhookHeaders(headers) {
  try {
    return webhookHeadersSchema.parse(headers);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Webhook headers validation failed:", {
        issues: error.issues,
        headers,
      });
    }
    throw error;
  }
}

// Helper function to validate subscription active webhook
export function validateSubscriptionActiveWebhook(payload) {
  try {
    return subscriptionActiveWebhookSchema.parse(JSON.parse(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Subscription active webhook validation failed:", {
        issues: error.issues,
        payload: JSON.parse(payload),
      });
    }
    throw error;
  }
}

// Helper function to validate payment succeeded webhook
export function validatePaymentSucceededWebhook(payload) {
  try {
    return paymentSucceededWebhookSchema.parse(JSON.parse(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Payment succeeded webhook validation failed:", {
        issues: error.issues,
        payload: JSON.parse(payload),
      });
    }
    throw error;
  }
}

// Helper function to validate payment failed webhook
export function validatePaymentFailedWebhook(payload) {
  try {
    return paymentFailedWebhookSchema.parse(JSON.parse(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Payment failed webhook validation failed:", {
        issues: error.issues,
        payload: JSON.parse(payload),
      });
    }
    throw error;
  }
}

// Helper functions for subscription end webhooks
export function validateSubscriptionCancelledWebhook(payload) {
  try {
    return subscriptionCancelledWebhookSchema.parse(JSON.parse(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Subscription cancelled webhook validation failed:", {
        issues: error.issues,
        payload: JSON.parse(payload),
      });
    }
    throw error;
  }
}

export function validateSubscriptionExpiredWebhook(payload) {
  try {
    return subscriptionExpiredWebhookSchema.parse(JSON.parse(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Subscription expired webhook validation failed:", {
        issues: error.issues,
        payload: JSON.parse(payload),
      });
    }
    throw error;
  }
}

// Helper function for subscription failed webhook
export function validateSubscriptionFailedWebhook(payload) {
  try {
    return subscriptionFailedWebhookSchema.parse(JSON.parse(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Subscription failed webhook validation failed:", {
        issues: error.issues,
        payload: JSON.parse(payload),
      });
    }
    throw error;
  }
}

// Helper function for refund succeeded webhook
export function validateRefundSucceededWebhook(payload) {
  try {
    return refundSucceededWebhookSchema.parse(JSON.parse(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Refund succeeded webhook validation failed:", {
        issues: error.issues,
        payload: JSON.parse(payload),
      });
    }
    throw error;
  }
}

export function validateSubscriptionRenewedWebhook(payload) {
  try {
    return subscriptionRenewedWebhookSchema.parse(JSON.parse(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Subscription renewed webhook validation failed:", {
        issues: error.issues,
        payload: JSON.parse(payload),
      });
    }
    throw error;
  }
}
