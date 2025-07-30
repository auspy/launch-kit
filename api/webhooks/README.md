# Webhook API Handlers

Configurable webhook processing handlers for LaunchKit applications, providing comprehensive webhook event handling with customizable business logic.

## Overview

The webhook handlers provide secure, reliable webhook processing for payment providers and other external services. The handlers include signature verification, deduplication, comprehensive event processing, and extensive customization capabilities.

## Handlers

### createDodoWebhookHandler

Creates a comprehensive Dodo Payments webhook handler that processes all webhook events with customizable business logic.

```javascript
import { createDodoWebhookHandler } from '@/api/webhooks/dodo-webhook';

const config = {
  webhookSecret: process.env.DODO_WEBHOOK_SECRET,
  teamProductIds: [process.env.TEAM_PRODUCT_ID].filter(Boolean),
  oneYearProductIds: process.env.ONE_YEAR_UPDATES_PRODUCT_IDS?.split(',') || [],
  logging: true,
  onWebhookReceived: async (event, webhookId) => {
    // Custom pre-processing
    console.log(`Webhook received: ${event.type}`);
    return event;
  },
  onWebhookProcessed: async (event, webhookId, status) => {
    // Custom post-processing
    console.log(`Webhook processed: ${event.type} - ${status}`);
  }
};

export const POST = createDodoWebhookHandler(config);
export const maxDuration = 30;
```

## Configuration Options

### Dodo Webhook Handler Options

```javascript
{
  // Webhook configuration
  webhookSecret: process.env.DODO_WEBHOOK_SECRET, // Required for signature verification
  maxDuration: 30, // Function timeout in seconds
  
  // Product configuration
  teamProductIds: [
    process.env.TEAM_PRODUCT_ID,
    process.env.TEAM_IN_PRODUCT_ID,
  ].filter(Boolean), // Product IDs that use quantity-based device counts
  
  oneYearProductIds: process.env.ONE_YEAR_UPDATES_PRODUCT_IDS?.split(',') || [], // Products with 1-year updates
  
  // Custom event handlers (override default behavior)
  eventHandlers: {
    'payment.succeeded': async (event, webhookId, config) => {
      // Custom payment processing logic
    },
    'subscription.active': async (event, webhookId, config) => {
      // Custom subscription processing logic
    },
    // ... more custom handlers
  },
  
  // Hooks for customization
  onWebhookReceived: async (event, webhookId) => {
    // Pre-processing hook - modify event before processing
    return event;
  },
  onWebhookProcessed: async (event, webhookId, status) => {
    // Post-processing hook - called after processing completes
  },
  onError: async (error, webhookId, event) => {
    // Error handling hook
  },
  
  // Logging
  logging: true, // Enable detailed console logging
}
```

## Supported Webhook Events

### Payment Events

#### payment.succeeded
Processes successful one-time payments and creates licenses.

**Business Logic:**
- Validates payment data
- Generates unique license key
- Determines license type from product ID
- Handles team products with quantity-based device counts
- Sets update expiration dates for applicable products
- Creates license with all purchase details
- Sends license creation email notifications

**Custom Processing Example:**
```javascript
eventHandlers: {
  'payment.succeeded': async (event, webhookId, config) => {
    const { data } = event;
    
    // Custom analytics tracking
    await trackEvent('payment_succeeded', {
      paymentId: data.payment_id,
      amount: data.total_amount,
      email: data.customer.email
    });
    
    // Continue with default processing
    await processDefaultEvent(event, webhookId, config);
  }
}
```

### Subscription Events

#### subscription.active
Processes active subscriptions and creates/updates licenses.

**Business Logic:**
- Finds existing license by subscription ID
- Updates existing licenses with new billing dates
- Creates new licenses for new subscriptions
- Determines device count from product mapping
- Sets appropriate license types (yearly/monthly)

#### subscription.renewed
Updates billing dates for renewed subscriptions.

**Business Logic:**
- Finds license by subscription ID
- Updates next billing date
- Maintains all other license properties

#### subscription.cancelled
Marks subscriptions as cancelled (no automatic license revocation).

#### subscription.expired
Revokes licenses for expired subscriptions.

**Business Logic:**
- Finds license by subscription ID
- Revokes license access
- Maintains license record for history

#### subscription.failed
Revokes licenses for failed subscription payments.

**Business Logic:**
- Finds license by subscription ID
- Revokes license access immediately
- Logs failure for support follow-up

### Refund Events

#### refund.succeeded
Revokes licenses for successful refunds.

**Business Logic:**
- Handles both payment and subscription refunds
- Revokes by payment ID for one-time purchases
- Revokes by subscription ID for subscription refunds
- Maintains refund audit trail

## Security Features

### Webhook Verification
- **Signature Validation**: Cryptographic verification using webhook secret
- **Header Validation**: Comprehensive header structure validation
- **Timestamp Verification**: Prevents replay attacks
- **Deduplication**: Prevents duplicate webhook processing

### Request Processing
- **Payload Validation**: Schema validation for all webhook data
- **Error Containment**: Safe error handling that doesn't expose internals
- **Rate Limiting**: Protection against webhook flooding
- **Logging**: Comprehensive audit trail for security monitoring

## Error Handling

### Webhook Verification Errors
```javascript
{
  "success": false,
  "error": "Invalid headers"
}
```

### Processing Errors
- Database connection failures
- License creation/update failures
- External service communication errors
- Validation errors

### Error Recovery
- Automatic retry for transient failures
- Dead letter queue for persistent failures
- Comprehensive error logging for debugging
- Graceful degradation for non-critical errors

## Deduplication System

The webhook handler includes automatic deduplication:

1. **Webhook ID Tracking**: Each webhook gets a unique ID
2. **Database Storage**: Processed webhooks are recorded
3. **Duplicate Detection**: Incoming webhooks are checked against processed list
4. **Safe Skipping**: Duplicate webhooks return success without reprocessing

## Event Processing Flow

1. **Receive Webhook**: Accept HTTP POST request
2. **Validate Headers**: Check required webhook headers
3. **Verify Signature**: Cryptographic verification using secret
4. **Check Duplication**: Prevent duplicate processing
5. **Parse Event**: Extract and validate event data
6. **Process Event**: Execute business logic for event type
7. **Record Processing**: Store webhook processing record
8. **Return Response**: Acknowledge successful processing

## Usage Examples

### Basic Webhook Handler

```javascript
// app/api/webhooks/dodo/route.js
import { createDodoWebhookHandler } from '@/api/webhooks/dodo-webhook';

export const maxDuration = 30;

const config = {
  webhookSecret: process.env.DODO_WEBHOOK_SECRET,
  logging: true
};

export const POST = createDodoWebhookHandler(config);
```

### Advanced Configuration with Analytics

```javascript
// app/api/webhooks/dodo/route.js
import { createDodoWebhookHandler } from '@/api/webhooks/dodo-webhook';
import { trackEvent, sendSlackNotification } from '@/lib/integrations';

export const maxDuration = 30;

const config = {
  webhookSecret: process.env.DODO_WEBHOOK_SECRET,
  teamProductIds: [process.env.TEAM_PRODUCT_ID],
  oneYearProductIds: process.env.ONE_YEAR_UPDATES_PRODUCT_IDS?.split(',') || [],
  logging: true,
  
  onWebhookReceived: async (event, webhookId) => {
    // Track all webhook events
    await trackEvent('webhook_received', {
      type: event.type,
      webhookId,
      timestamp: new Date().toISOString()
    });
    
    return event;
  },
  
  onWebhookProcessed: async (event, webhookId, status) => {
    // Send notifications for important events
    if (event.type === 'payment.succeeded' && status === 'success') {
      await sendSlackNotification(`💰 New payment: ${event.data.customer.email}`);
    }
    
    if (status === 'error') {
      await sendSlackNotification(`❌ Webhook error: ${event.type} (${webhookId})`);
    }
  },
  
  onError: async (error, webhookId, event) => {
    // Custom error handling and alerting
    await trackEvent('webhook_error', {
      error: error.message,
      webhookId,
      eventType: event?.type || 'unknown'
    });
    
    // Alert for critical errors
    if (error.code === 121) { // MongoDB validation error
      await sendSlackNotification(`🚨 Critical webhook error: ${error.message}`);
    }
  }
};

export const POST = createDodoWebhookHandler(config);
```

### Custom Event Processing

```javascript
const config = {
  webhookSecret: process.env.DODO_WEBHOOK_SECRET,
  eventHandlers: {
    'payment.succeeded': async (event, webhookId, config) => {
      // Custom payment processing
      const { data } = event;
      
      // Send custom welcome email
      await sendWelcomeEmail(data.customer.email, {
        paymentId: data.payment_id,
        amount: data.total_amount
      });
      
      // Update CRM system
      await updateCRM(data.customer.email, {
        status: 'paid',
        amount: data.total_amount,
        date: new Date()
      });
      
      // Continue with default license creation
      await processDefaultEvent(event, webhookId, config);
    },
    
    'subscription.cancelled': async (event, webhookId, config) => {
      // Custom cancellation handling
      const { data } = event;
      
      // Send retention email
      await sendRetentionEmail(data.customer.email);
      
      // Update customer segment
      await updateCustomerSegment(data.customer.email, 'churned');
      
      // Default handler doesn't do much, but call it for consistency
      await processDefaultEvent(event, webhookId, config);
    }
  }
};
```

## Integration with License Management

The webhook handlers automatically integrate with the license management system:

### License Creation
- Automatic license key generation
- Device count mapping from product IDs
- License type determination (lifetime, yearly, monthly)
- Email notifications for new licenses

### License Updates
- Subscription billing date updates
- License type changes for upgrades/downgrades
- Device count adjustments for plan changes

### License Revocation
- Automatic revocation for refunds
- Subscription expiration handling
- Failed payment processing

## Database Dependencies

The webhook handlers require:

- **Webhook Collection**: For deduplication tracking
- **License Collection**: For license management operations
- **MongoDB Operations**: Full CRUD license operations

Required adapters:
- `@/adapters/webhook.db` - Webhook tracking
- `@/adapters/license.db` - License operations
- `@/lib/license/license.operations` - License business logic
- `@/lib/license/license.utils` - Utility functions

## Environment Variables

```bash
# Required
DODO_WEBHOOK_SECRET=whsec_your_webhook_secret

# Product Configuration
TEAM_PRODUCT_ID=prod_team_xxx
TEAM_IN_PRODUCT_ID=prod_team_in_xxx
ONE_YEAR_UPDATES_PRODUCT_IDS=prod_one_year_1,prod_one_year_2

# Optional regional products
LIFETIME_1_DEVICES_IN_PRODUCT_ID=prod_xxx
BELIEVER_5_DEVICES_IN_PRODUCT_ID=prod_xxx
```

## Monitoring and Observability

### Logging
The webhook handler provides detailed logging:
- Webhook receipt and processing
- Signature verification steps
- Event processing details
- Error conditions and stack traces
- Processing duration and status

### Metrics
Track important webhook metrics:
- Processing success/failure rates
- Event type distribution
- Processing duration
- Duplicate webhook frequency
- Error rate by event type

### Alerting
Set up alerts for:
- Webhook processing failures
- Signature verification failures
- High error rates
- Processing duration anomalies
- Critical business events (large payments, cancellations)

## Testing

### Webhook Testing
1. **Local Development**: Use webhook testing tools like ngrok
2. **Signature Verification**: Test with valid/invalid signatures
3. **Event Processing**: Verify each event type processes correctly
4. **Error Handling**: Test error conditions and recovery
5. **Deduplication**: Verify duplicate webhook handling

### Integration Testing
1. **End-to-End Flow**: Payment → Webhook → License Creation
2. **Database Operations**: Verify license creation/updates
3. **Email Notifications**: Test license delivery emails
4. **Error Recovery**: Test failure scenarios and rollback

## Migration from Direct Routes

To migrate existing webhook routes:

1. **Replace Implementation**:
   ```javascript
   // Before: Custom webhook logic
   export async function POST(request) {
     // 200+ lines of webhook processing...
   }
   
   // After: Configuration-based approach
   import { createDodoWebhookHandler } from '@/api/webhooks/dodo-webhook';
   export const POST = createDodoWebhookHandler(config);
   ```

2. **Preserve Custom Logic**: Use event handlers and hooks
3. **Test Thoroughly**: Verify all webhook events process correctly
4. **Monitor Carefully**: Watch for any processing differences

## Best Practices

1. **Idempotency**: Always design webhook processing to be idempotent
2. **Timeout Handling**: Set appropriate maxDuration for webhook processing
3. **Error Handling**: Return 200 status codes to acknowledge receipt
4. **Logging**: Maintain comprehensive audit trails
5. **Security**: Always verify webhook signatures
6. **Monitoring**: Track webhook processing metrics and errors
7. **Testing**: Thoroughly test all webhook event types