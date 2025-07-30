/**
 * Configurable payment creation handler for generating payment URLs
 * Supports multiple payment types and device configurations
 */

export function createPaymentHandler(config = {}) {
  const {
    // Payment URL mappings
    paymentUrls = {},
    
    // Device count validation
    validDeviceCounts = {},
    
    // Environment settings
    environment = process.env.NODE_ENV,
    baseUrl = 'checkout.dodopayments.com',
    redirectUrl = process.env.PAYMENT_REDIRECT_URL,
    
    // Customization hooks
    onPaymentCreated = async (paymentUrl, requestData) => paymentUrl,
    onValidationError = async (error, requestData) => null,
    onError = async (error, requestData) => null,
    
    // Logging
    logging = true,
  } = config;

  return async function paymentHandler(request, { params } = {}) {
    const requestId = Date.now().toString();
    
    try {
      if (logging) {
        console.log(`[Payment ${requestId}] Creating payment for type: ${params?.type}`);
      }

      const { type } = params || {};
      const body = await request.json();
      const {
        devices,
        locale = "default",
        totalPrice,
        device_id,
        from_app,
      } = body;

      if (logging) {
        console.log(`[Payment ${requestId}] Request body:`, { type, devices, locale });
      }

      // Validate device count
      if (!validateDeviceCount(type, devices, validDeviceCounts)) {
        const error = new Error(`Invalid device count: ${devices} for type: ${type}`);
        const customResponse = await onValidationError(error, { type, devices, locale });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({ error: "Invalid device count" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Generate payment URL
      const paymentUrl = generatePaymentUrl({
        type,
        devices,
        locale,
        paymentUrls,
        environment,
        baseUrl,
        redirectUrl,
      });

      if (!paymentUrl || paymentUrl.includes("undefined")) {
        const error = new Error(`Missing product ID for ${type} plan with ${devices} devices`);
        if (logging) {
          console.error(`[Payment ${requestId}] ${error.message} (locale: ${locale})`);
        }
        
        const customResponse = await onError(error, { type, devices, locale });
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({ error: `Product not configured for ${type} plan` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Allow customization of payment URL
      const finalPaymentUrl = await onPaymentCreated(paymentUrl, {
        type,
        devices,
        locale,
        totalPrice,
        device_id,
        from_app,
      });

      if (logging) {
        console.log(`[Payment ${requestId}] Payment URL generated successfully`);
      }

      return new Response(
        JSON.stringify({ paymentUrl: finalPaymentUrl }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      if (logging) {
        console.error(`[Payment ${requestId}] Payment creation error:`, error);
      }
      
      const customResponse = await onError(error, { params, body: body || {} });
      if (customResponse) return customResponse;
      
      return new Response(
        JSON.stringify({ error: "Failed to create payment link" }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

/**
 * Generate payment URL based on configuration
 */
function generatePaymentUrl({
  type,
  devices,
  locale,
  paymentUrls,
  environment,
  baseUrl,
  redirectUrl,
}) {
  // Get the appropriate product mapping
  const productMapping = paymentUrls[type];
  if (!productMapping) {
    return null;
  }

  // Handle team plans with quantity-based pricing
  if (type === "team") {
    const productId = productMapping.default;
    if (!productId) return null;

    const checkoutUrl = `https://${environment === "production" ? "" : "test."}${baseUrl}/buy/${productId}?quantity=${devices}&redirect_url=${redirectUrl}`;
    return checkoutUrl;
  }

  // Handle regular plans with fixed device counts
  const productId = productMapping[devices];
  if (!productId) return null;

  const checkoutUrl = `https://${environment === "production" ? "" : "test."}${baseUrl}/buy/${productId}?quantity=1&redirect_url=${redirectUrl}`;
  return checkoutUrl;
}

/**
 * Validate device count for payment type
 */
function validateDeviceCount(type, devices, validDeviceCounts) {
  if (!validDeviceCounts[type]) {
    return false;
  }

  const validation = validDeviceCounts[type];
  
  // Handle function-based validation (e.g., for team plans)
  if (typeof validation === 'function') {
    return validation(devices);
  }
  
  // Handle array-based validation
  if (Array.isArray(validation)) {
    return validation.includes(devices);
  }
  
  return false;
}

/**
 * Default configuration for Focusmo-style pricing
 */
export const defaultPaymentConfig = {
  paymentUrls: {
    one_year: {
      1: process.env.ONE_YEAR_1_DEVICES_PRODUCT_ID,
      2: process.env.ONE_YEAR_2_DEVICES_PRODUCT_ID,
      5: process.env.ONE_YEAR_5_DEVICES_PRODUCT_ID,
      10: process.env.ONE_YEAR_10_DEVICES_PRODUCT_ID,
    },
    lifetime: {
      1: process.env.LIFETIME_1_DEVICES_PRODUCT_ID,
      2: process.env.LIFETIME_2_DEVICES_PRODUCT_ID,
      5: process.env.LIFETIME_5_DEVICES_PRODUCT_ID,
      10: process.env.LIFETIME_10_DEVICES_PRODUCT_ID,
    },
    believer: {
      5: process.env.BELIEVER_5_DEVICES_PRODUCT_ID,
    },
    yearly: {
      1: process.env.YEARLY_1_DEVICES_PRODUCT_ID,
    },
    monthly: {
      1: process.env.MONTHLY_1_DEVICES_PRODUCT_ID,
    },
    team: {
      default: process.env.TEAM_PRODUCT_ID,
    },
  },
  
  validDeviceCounts: {
    believer: [5],
    lifetime: [1, 2, 5, 10],
    one_year: [1, 2, 5, 10],
    yearly: [1],
    monthly: [1],
    team: (devices) => devices >= 5 && devices <= 100,
  },
};