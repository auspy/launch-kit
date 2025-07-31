/**
 * Configurable discount/coupon creation handler for Dodo Payments
 * Provides secure API for creating percentage-based discount codes
 */

import { dodo } from "@/lib/dodo/dodo.config";
import { z } from "zod";

export function createDiscountHandler(config = {}) {
  const {
    // API Key authentication
    discountApiKey = process.env.DODO_DISCOUNT_API_KEY,

    // Validation schema
    validationSchema = getDefaultDiscountSchema(),

    // Customization hooks
    onDiscountCreated = async (discount, requestData) => discount,
    onValidationError = async (error, requestData) => null,
    onAuthError = async (error, request) => null,
    onError = async (error, requestData) => null,

    // Logging
    logging = true,
  } = config;

  return async function discountHandler(request) {
    const requestId = Date.now().toString();

    try {
      if (logging) {
        console.log(`[Discount ${requestId}] Creating discount coupon`);
      }

      // Verify API key authentication
      if (!verifyApiKey(request, discountApiKey)) {
        const error = new Error("Unauthorized - Invalid or missing API key");
        const customResponse = await onAuthError(error, request);

        if (customResponse) return customResponse;

        return new Response(
          JSON.stringify({
            error: "Unauthorized - Invalid or missing API key",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      // Parse and validate request body
      const body = await request.json();
      const validationResult = validationSchema.safeParse(body);

      if (!validationResult.success) {
        const error = new Error("Validation failed");
        error.details = validationResult.error.errors.map((err) => err.message);

        const customResponse = await onValidationError(error, body);

        if (customResponse) return customResponse;

        return new Response(
          JSON.stringify({
            error: "Validation Error",
            details: error.details,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const {
        amount,
        type,
        name,
        code,
        expiresAt,
        usageLimit,
        restrictedTo,
        studentEmail,
      } = validationResult.data;

      // Prepare discount parameters for Dodo API
      const discountParams = {
        amount,
        type,
        // Optional parameters
        ...(name && { name }),
        ...(code && { code }),
        ...(expiresAt && { expires_at: expiresAt }),
        ...(usageLimit && { usage_limit: usageLimit }),
        ...(restrictedTo &&
          restrictedTo.length > 0 && { restricted_to: restrictedTo }),
      };

      if (logging) {
        console.log(
          `[Discount ${requestId}] Creating discount with params:`,
          JSON.stringify(discountParams)
        );
      }

      // Create discount using Dodo API
      const discount = await dodo.discounts.create(discountParams);

      // Allow customization of the response
      const finalDiscount = await onDiscountCreated(discount, {
        ...validationResult.data,
        requestId,
      });

      if (logging) {
        console.log(
          `[Discount ${requestId}] Discount created - ID: ${
            discount.discount_id
          }, Code: ${discount.code}${
            studentEmail ? `, for student: ${studentEmail}` : ""
          }`
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          discount: finalDiscount,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      if (logging) {
        console.error(
          `[Discount ${requestId}] Error creating discount:`,
          error
        );
      }

      const customResponse = await onError(error, {
        requestId,
        body: body || {},
      });
      if (customResponse) return customResponse;

      return new Response(
        JSON.stringify({
          error: "Failed to create discount",
          message: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  };
}

/**
 * Verify API key for security
 */
function verifyApiKey(request, validApiKey) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const providedApiKey = authHeader.split(" ")[1];

  if (!validApiKey || providedApiKey !== validApiKey) {
    return false;
  }

  return true;
}

/**
 * Default validation schema for discount creation
 */
function getDefaultDiscountSchema() {
  return z.object({
    amount: z.number().min(1, "Amount must be a positive number"),
    type: z.literal("percentage", {
      invalid_type_error: "Type must be 'percentage'",
    }),
    name: z.string().optional(),
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .nullable()
      .optional(),
    expiresAt: z.string().datetime().optional(),
    usageLimit: z.number().min(1, "Usage limit must be at least 1").optional(),
    restrictedTo: z.array(z.string()).optional(),
    studentEmail: z.string().email().optional(),
  });
}

/**
 * Default configuration for discount handler
 */
export const defaultDiscountConfig = {
  discountApiKey: process.env.DODO_DISCOUNT_API_KEY,
  validationSchema: getDefaultDiscountSchema(),
  logging: true,
};
