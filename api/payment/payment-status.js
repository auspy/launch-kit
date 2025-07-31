/**
 * Configurable payment status handler for checking payment and subscription status
 */

import { dodo as dodoClient } from "@/lib/dodo/dodo.config";
import { mapPaymentStatus } from "@/lib/dodo/payment-status";

export function createPaymentStatusHandler(config = {}) {
  const {
    // Status mapping configuration
    statusMapping = mapPaymentStatus,

    // Customization hooks
    onStatusRetrieved = async (status, requestData) => status,
    onError = async (error, requestData) => null,

    // Logging
    logging = true,
  } = config;

  return async function paymentStatusHandler(request) {
    const requestId = Date.now().toString();

    try {
      if (logging) {
        console.log(`[PaymentStatus ${requestId}] Checking payment status`);
      }

      const body = await request.json();
      const { paymentId, subscriptionId } = body;

      if (!paymentId && !subscriptionId) {
        const error = new Error("Missing paymentId or subscriptionId");
        const customResponse = await onError(error, {
          paymentId,
          subscriptionId,
        });

        if (customResponse) return customResponse;

        return new Response(
          JSON.stringify({
            error: "Payment ID or Subscription ID is required",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (logging) {
        console.log(`[PaymentStatus ${requestId}] Looking up:`, {
          paymentId,
          subscriptionId,
        });
      }

      let result;

      // Check payment status
      if (paymentId) {
        const payment = await dodoClient.payments.get(paymentId);
        result = {
          type: "payment",
          id: paymentId,
          status: statusMapping(payment.status),
          amount: payment.total_amount,
          currency: payment.currency,
          customer: payment.customer,
          created_at: payment.created_at,
          raw: payment,
        };
      }

      // Check subscription status
      if (subscriptionId) {
        const subscription = await dodoClient.subscriptions.get(subscriptionId);
        result = {
          type: "subscription",
          id: subscriptionId,
          status: statusMapping(subscription.status),
          amount: subscription.recurring_pre_tax_amount,
          currency: subscription.currency,
          customer: subscription.customer,
          created_at: subscription.created_at,
          next_billing_date: subscription.next_billing_date,
          raw: subscription,
        };
      }

      // Allow customization of the result
      const finalResult = await onStatusRetrieved(result, {
        paymentId,
        subscriptionId,
        requestId,
      });

      if (logging) {
        console.log(`[PaymentStatus ${requestId}] Status retrieved:`, {
          type: finalResult.type,
          id: finalResult.id,
          status: finalResult.status,
        });
      }

      return new Response(JSON.stringify(finalResult), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      if (logging) {
        console.error(
          `[PaymentStatus ${requestId}] Status check error:`,
          error
        );
      }

      const customResponse = await onError(error, {
        paymentId,
        subscriptionId,
      });
      if (customResponse) return customResponse;

      return new Response(
        JSON.stringify({
          error: "Failed to retrieve payment status",
          message: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  };
}

/**
 * Handler for retrieving customer email from payment or subscription
 */
export function createPaymentEmailHandler(config = {}) {
  const {
    // Privacy settings
    maskEmailInLogs = true,

    // Customization hooks
    onEmailRetrieved = async (email, requestData) => ({ email }),
    onError = async (error, requestData) => null,

    // Logging
    logging = true,
  } = config;

  return async function paymentEmailHandler(request) {
    const requestId = Date.now().toString();

    try {
      if (logging) {
        console.log(`[PaymentEmail ${requestId}] Retrieving customer email`);
      }

      const body = await request.json();
      const { paymentId, subscriptionId } = body;

      if (!paymentId && !subscriptionId) {
        const error = new Error("Missing payment_id or subscription_id");
        const customResponse = await onError(error, {
          paymentId,
          subscriptionId,
        });

        if (customResponse) return customResponse;

        return new Response(
          JSON.stringify({
            error: "Payment ID or Subscription ID is required",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      let email;

      // Get email from payment
      if (paymentId) {
        const payment = await dodoClient.payments.get(paymentId);
        email = payment.customer?.email;
      }

      // Get email from subscription
      if (subscriptionId) {
        const subscription = await dodoClient.subscriptions.get(subscriptionId);
        email = subscription.customer?.email;
      }

      if (!email) {
        const error = new Error("Customer email not found");
        const customResponse = await onError(error, {
          paymentId,
          subscriptionId,
        });

        if (customResponse) return customResponse;

        return new Response(
          JSON.stringify({ error: "Customer email not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      if (logging) {
        const displayEmail = maskEmailInLogs
          ? email.replace(/(.{2}).*(@.*)/, "$1***$2")
          : email;
        console.log(
          `[PaymentEmail ${requestId}] Email retrieved: ${displayEmail}`
        );
      }

      // Allow customization of response
      const result = await onEmailRetrieved(email, {
        paymentId,
        subscriptionId,
        requestId,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      if (logging) {
        console.error(
          `[PaymentEmail ${requestId}] Email retrieval error:`,
          error
        );
      }

      const customResponse = await onError(error, {
        paymentId,
        subscriptionId,
      });
      if (customResponse) return customResponse;

      return new Response(
        JSON.stringify({
          error: "Failed to retrieve customer email",
          message: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  };
}
