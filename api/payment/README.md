# Payment API Handlers

Configurable payment processing API handlers for LaunchKit applications, supporting payment creation, status checking, email retrieval, and discount management with Dodo Payments integration.

## Overview

The payment handlers provide a complete payment processing system including payment URL generation, status monitoring, customer email retrieval, and discount coupon management. All handlers preserve original functionality while adding extensive customization capabilities.

## Handlers

### createPaymentHandler

Creates configurable payment URL generation handler for multiple subscription types and device configurations.

```javascript
import { createPaymentHandler, defaultPaymentConfig } from '@/api/payment/create-payment';

const config = {
  ...defaultPaymentConfig,
  logging: true,
  onPaymentCreated: async (paymentUrl, requestData) => {
    // Custom processing after payment URL creation
    console.log(`Payment URL created for ${requestData.type} with ${requestData.devices} devices`);
    return paymentUrl;
  },
  onValidationError: async (error, requestData) => {
    // Custom validation error handling
    return null; // Use default error response
  }
};

export const POST = createPaymentHandler(config);
```

### createPaymentStatusHandler

Creates a payment and subscription status checking handler.

```javascript
import { createPaymentStatusHandler } from '@/api/payment/payment-status';

const config = {
  logging: true,
  onStatusRetrieved: async (status, requestData) => {
    // Custom processing after status retrieval
    return {
      status: status.status,
      type: status.type,
      amount: status.amount,
      currency: status.currency,
    };
  }
};

export const POST = createPaymentStatusHandler(config);
```

### createPaymentEmailHandler

Creates a customer email retrieval handler for payments and subscriptions.

```javascript
import { createPaymentEmailHandler } from '@/api/payment/payment-status';

const config = {
  logging: true,
  maskEmailInLogs: true,
  onEmailRetrieved: async (email, requestData) => {
    // Custom processing after email retrieval
    return { email };
  }
};

export const POST = createPaymentEmailHandler(config);
```

### createDiscountHandler

Creates a secure discount/coupon creation handler with API key authentication.

```javascript
import { createDiscountHandler, defaultDiscountConfig } from '@/api/payment/discount';

const config = {
  ...defaultDiscountConfig,
  logging: true,
  onDiscountCreated: async (discount, requestData) => {
    // Custom processing after discount creation
    console.log(`Discount created: ${discount.code}`);
    return discount;
  },
  onAuthError: async (error, request) => {
    // Custom authentication error handling
    return null; // Use default error response
  }
};

export const POST = createDiscountHandler(config);
```

## Configuration Options

### Payment Creation Handler Options

```javascript
{
  // Payment URL mappings by type and device count
  paymentUrls: {
    lifetime: {
      1: process.env.LIFETIME_1_DEVICES_PRODUCT_ID,
      2: process.env.LIFETIME_2_DEVICES_PRODUCT_ID,
      // ... more device counts
    },
    team: {
      default: process.env.TEAM_PRODUCT_ID,
    },
    // ... more payment types
  },
  
  // Device count validation rules
  validDeviceCounts: {
    lifetime: [1, 2, 5, 10],
    team: (devices) => devices >= 5 && devices <= 100,
    // ... more validation rules
  },
  
  // Environment settings
  environment: process.env.NODE_ENV,
  baseUrl: 'checkout.dodopayments.com',
  redirectUrl: process.env.PAYMENT_REDIRECT_URL,
  
  // Customization hooks
  onPaymentCreated: async (paymentUrl, requestData) => paymentUrl,
  onValidationError: async (error, requestData) => null,
  onError: async (error, requestData) => null,
  
  // Logging
  logging: true,
}
```

### Payment Status Handler Options

```javascript
{
  // Status mapping configuration
  statusMapping: mapPaymentStatus, // Custom status mapping function
  
  // Customization hooks
  onStatusRetrieved: async (status, requestData) => {
    // Process and customize status response
    return {
      status: status.status,
      type: status.type,
      amount: status.amount,
      // ... custom fields
    };
  },
  onError: async (error, requestData) => null,
  
  // Logging
  logging: true,
}
```

### Payment Email Handler Options

```javascript
{
  // Privacy settings
  maskEmailInLogs: true, // Mask email addresses in log output
  
  // Customization hooks
  onEmailRetrieved: async (email, requestData) => {
    // Process and customize email response
    return { email, customerInfo: customData };
  },
  onError: async (error, requestData) => null,
  
  // Logging
  logging: true,
}
```

### Discount Handler Options

```javascript
{
  // API Key authentication
  discountApiKey: process.env.DODO_DISCOUNT_API_KEY,
  
  // Validation schema (Zod schema)
  validationSchema: z.object({
    amount: z.number().min(1),
    type: z.literal("percentage"),
    code: z.string().min(3).optional(),
    expiresAt: z.string().datetime().optional(),
    usageLimit: z.number().min(1).optional(),
    restrictedTo: z.array(z.string()).optional(),
    studentEmail: z.string().email().optional(),
  }),
  
  // Customization hooks
  onDiscountCreated: async (discount, requestData) => {
    // Process after discount creation
    return discount;
  },
  onValidationError: async (error, requestData) => null,
  onAuthError: async (error, request) => null,
  onError: async (error, requestData) => null,
  
  // Logging
  logging: true,
}
```

## Product Configuration

### Payment Types and Device Mapping

The payment handler supports multiple subscription types:

- **lifetime**: One-time lifetime licenses (1, 2, 5, 10 devices)
- **one_year**: One-year subscriptions (1, 2, 5, 10 devices)
- **yearly**: Annual subscriptions (typically 1 device)
- **monthly**: Monthly subscriptions (typically 1 device)
- **believer**: Special believer tier (5 devices)
- **team**: Team subscriptions (5-100 devices, quantity-based)

### Environment Variables Required

```bash
# Product IDs for different subscription types
LIFETIME_1_DEVICES_PRODUCT_ID=prod_xxx
LIFETIME_2_DEVICES_PRODUCT_ID=prod_xxx
LIFETIME_5_DEVICES_PRODUCT_ID=prod_xxx
LIFETIME_10_DEVICES_PRODUCT_ID=prod_xxx

ONE_YEAR_1_DEVICES_PRODUCT_ID=prod_xxx
ONE_YEAR_2_DEVICES_PRODUCT_ID=prod_xxx
ONE_YEAR_5_DEVICES_PRODUCT_ID=prod_xxx
ONE_YEAR_10_DEVICES_PRODUCT_ID=prod_xxx

YEARLY_1_DEVICES_PRODUCT_ID=prod_xxx
MONTHLY_1_DEVICES_PRODUCT_ID=prod_xxx
BELIEVER_5_DEVICES_PRODUCT_ID=prod_xxx
TEAM_PRODUCT_ID=prod_xxx

# Payment configuration
PAYMENT_REDIRECT_URL=https://yoursite.com/success
DODO_API_KEY=sk_xxx
DODO_DISCOUNT_API_KEY=disc_xxx
```

## API Endpoints

### Payment Creation

**POST** `/api/create-payment/[type]`

Create payment URLs for different subscription types.

```javascript
// Request body
{
  "devices": 5,
  "locale": "default",
  "totalPrice": 129.99,
  "device_id": "device_123",
  "from_app": true
}

// Response
{
  "paymentUrl": "https://checkout.dodopayments.com/buy/prod_xxx?quantity=1&redirect_url=..."
}
```

### Payment Status Check

**POST** `/api/payment-status`

Check the status of payments or subscriptions.

```javascript
// Request body
{
  "paymentId": "pay_xxx", // OR
  "subscriptionId": "sub_xxx"
}

// Response
{
  "status": "success",
  "type": "payment",
  "amount": 12999,
  "currency": "USD",
  "customer": { "email": "user@example.com" }
}
```

### Customer Email Retrieval

**POST** `/api/payment-status/get-email`

Retrieve customer email from payment or subscription.

```javascript
// Request body
{
  "paymentId": "pay_xxx", // OR
  "subscriptionId": "sub_xxx"
}

// Response
{
  "email": "customer@example.com"
}
```

### Discount Creation

**POST** `/api/discount/create`

Create discount coupons (requires API key authentication).

```javascript
// Headers
Authorization: Bearer disc_your_api_key

// Request body
{
  "amount": 1000, // 10% in basis points
  "type": "percentage",
  "code": "STUDENT10", // Optional
  "expiresAt": "2024-12-31T23:59:59Z", // Optional
  "usageLimit": 100, // Optional
  "restrictedTo": ["prod_xxx"], // Optional
  "studentEmail": "student@university.edu" // Optional
}

// Response
{
  "success": true,
  "discount": {
    "discount_id": "disc_xxx",
    "code": "STUDENT10",
    "amount": 1000,
    "type": "percentage"
  }
}
```

## Error Handling

All handlers include comprehensive error handling:

### Validation Errors (400)
- Invalid device counts for subscription types
- Missing required parameters
- Invalid parameter formats
- Discount validation failures

### Authentication Errors (401)
- Missing or invalid API keys (discount endpoint)
- Malformed authorization headers

### Not Found Errors (404)
- Payment/subscription not found
- Customer email not found

### Server Errors (500)
- Dodo API connection failures
- Database errors
- Unexpected processing errors

### Example Error Response
```json
{
  "error": "Invalid device count",
  "message": "Team subscriptions require 5-100 devices"
}
```

## Security Features

- **API Key Authentication**: Secure discount creation with Bearer token authentication
- **Input Validation**: Comprehensive validation using Zod schemas
- **Rate Limiting**: Built-in protection against abuse
- **Privacy Protection**: Email masking in logs to protect customer data
- **Error Sanitization**: Safe error messages that don't expose internal details

## Usage Examples

### Basic Payment Flow

```javascript
// 1. Create payment URL
const response = await fetch('/api/create-payment/lifetime', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ devices: 5 })
});
const { paymentUrl } = await response.json();

// 2. Redirect user to payment URL
window.location.href = paymentUrl;

// 3. Check payment status after redirect
const statusResponse = await fetch('/api/payment-status', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ paymentId: 'pay_xxx' })
});
const { status } = await statusResponse.json();
```

### Team Subscription with Analytics

```javascript
// app/api/create-payment/team/route.js
import { createPaymentHandler, defaultPaymentConfig } from '@/api/payment/create-payment';
import { trackEvent } from '@/lib/analytics';

export const POST = createPaymentHandler({
  ...defaultPaymentConfig,
  onPaymentCreated: async (paymentUrl, requestData) => {
    // Track payment creation analytics
    await trackEvent('payment_url_created', {
      type: requestData.type,
      devices: requestData.devices,
      timestamp: new Date().toISOString()
    });
    
    return paymentUrl;
  }
});
```

### Custom Status Response Format

```javascript
// app/api/payment-status/route.js
import { createPaymentStatusHandler } from '@/api/payment/payment-status';

export const POST = createPaymentStatusHandler({
  onStatusRetrieved: async (status, requestData) => {
    // Return custom format for frontend compatibility
    return {
      success: status.status === 'success',
      paymentData: {
        id: status.id,
        amount: status.amount / 100, // Convert to dollars
        currency: status.currency,
        customer: status.customer
      }
    };
  }
});
```

## Migration from Direct Routes

To migrate existing payment routes:

1. **Replace Implementation**:
   ```javascript
   // Before: Custom payment logic
   export async function POST(request) {
     // 50 lines of payment URL logic...
   }
   
   // After: Configuration-based approach
   import { createPaymentHandler, defaultPaymentConfig } from '@/api/payment/create-payment';
   export const POST = createPaymentHandler(defaultPaymentConfig);
   ```

2. **Preserve Custom Logic**: Use configuration hooks to maintain custom behavior
3. **Test Thoroughly**: Verify all payment flows work identically
4. **Update Frontend**: Ensure API contracts remain compatible

## Integration with License Management

The payment handlers work seamlessly with the license management system. When webhooks are processed, they automatically:

- Create licenses for successful payments
- Update subscription billing dates
- Revoke licenses for refunds and cancellations
- Handle team subscription device counts

For webhook processing, see:
- [`@/api/webhooks/README.md`](../webhooks/README.md) - Webhook handlers
- [`@/api/license/README.md`](../license/README.md) - License management

## Dependencies

The payment handlers require:

- `@/lib/dodo/dodo.config` - Dodo Payments client configuration
- `@/lib/dodo/payment-status` - Status mapping utilities
- `zod` - Request validation
- Environment variables for product IDs and API keys

## Rate Limiting

Payment endpoints should be protected with appropriate rate limiting:
- Payment creation: Moderate limits to prevent abuse
- Status checks: Higher limits for legitimate monitoring
- Discount creation: Strict limits due to API key requirement