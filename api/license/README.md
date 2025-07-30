# License Management API Handlers

Configurable license management API route handlers for LaunchKit applications, preserving all original functionality while adding customization capabilities.

## Overview

The license handlers provide a comprehensive license management system including CRUD operations, device activation/deactivation, validation, and recovery features.

## Handlers

### createLicenseCRUDHandler

Creates configurable GET/POST handlers for basic license operations.

```javascript
import { createLicenseCRUDHandler } from '@/api/license/license-crud';

const config = {
  initDb: true,
  postEnabled: false, // License creation disabled by default
  onLicenseCreated: async (license, requestBody) => { /* custom logic */ },
  onLicenseRetrieved: async (license, request) => { /* custom logic */ },
  onError: async (error, operation) => { /* custom error handling */ }
};

const handlers = createLicenseCRUDHandler(config);
export const POST = handlers.POST;
export const GET = handlers.GET;
```

### createActivateHandler

Creates a device activation handler with comprehensive error handling.

```javascript
import { createActivateHandler } from '@/api/license/activate';

const config = {
  logging: true,
  messages: {
    success: "Device activated successfully",
    maxDevicesReached: "Maximum devices reached",
    // ... other messages
  },
  onActivationSuccess: async (response, requestBody) => { /* custom logic */ },
  onActivationError: async (error, originalError, requestBody) => { /* custom logic */ }
};

export const POST = createActivateHandler(config);
```

### createDeactivateHandler

Creates a device deactivation handler with session validation.

```javascript
import { createDeactivateHandler } from '@/api/license/deactivate';

const config = {
  requireSession: true,
  useSessionValidation: true,
  onDeactivationSuccess: async (response, requestBody) => { /* custom logic */ }
};

export const DELETE = createDeactivateHandler(config);
```

### createValidateHandler

Creates a license validation handler for periodic license checks.

```javascript
import { createValidateHandler } from '@/api/license/validate';

const config = {
  supportEmail: 'support@yoursite.com',
  logging: true,
  onValidationSuccess: async (response, requestBody) => { /* custom logic */ }
};

export const POST = createValidateHandler(config);
```

### createInfoHandler

Creates a license information retrieval handler.

```javascript
import { createInfoHandler } from '@/api/license/info';

const config = {
  requireSession: true,
  projection: { /* custom MongoDB projection */ },
  onInfoRetrieved: async (response, session) => { /* custom logic */ }
};

export const GET = createInfoHandler(config);
```

### createRecoverHandler

Creates a license recovery handler for sending license details via email.

```javascript
import { createRecoverHandler } from '@/api/license/recover';

const config = {
  logging: true,
  licenseStatus: "active",
  onRecoveryRequested: async (email, request) => { /* custom logic */ }
};

export const POST = createRecoverHandler(config);
```

## Configuration Options

### Common Options

All handlers support these common patterns:

```javascript
{
  // Logging configuration
  logging: true, // Enable/disable detailed console logging
  
  // Custom messages
  messages: {
    success: "Operation successful",
    error: "Operation failed"
    // ... handler-specific messages
  },
  
  // Custom hooks
  onSuccess: async (result, input) => { /* custom logic */ },
  onError: async (error, input) => { /* custom error handling */ }
}
```

### License CRUD Options

```javascript
{
  initDb: true,              // Initialize database connection
  postEnabled: false,        // Enable/disable license creation
  onLicenseCreated: async (license, requestBody) => {
    // Custom processing after license creation
  },
  onLicenseRetrieved: async (license, request) => {
    // Custom processing after license retrieval
  },
  onError: async (error, operation) => {
    // Custom error handling ('create' or 'get')
  }
}
```

### Activation Handler Options

```javascript
{
  logging: true,           // Enable detailed logging
  messages: {
    success: "Device activated successfully",
    activationFailed: "Device activation failed",
    maxDevicesReached: "Maximum number of devices reached",
    deviceAlreadyActivated: "Device already activated",
    invalidLicense: "Invalid or inactive license",
    rateLimitExceeded: "Rate limit exceeded",
    internalError: "Internal server error"
  },
  onActivationSuccess: async (response, requestBody) => {
    // Process successful activation
    // response: full activation response with deviceInfo
    // requestBody: original request data
  },
  onActivationError: async (error, originalError, requestBody) => {
    // Process activation errors
    // error: formatted error response
    // originalError: original error from activation
    // requestBody: original request data
  }
}
```

### Deactivation Handler Options

```javascript
{
  requireSession: true,        // Require valid session
  useSessionValidation: true,  // Use session validation logic
  messages: {
    success: "Device deactivated successfully",
    notFound: "Device not found or already deactivated"
  },
  onDeactivationSuccess: async (response, requestBody) => {
    // Process successful deactivation
  },
  onDeactivationError: async (error, requestBody) => {
    // Process deactivation errors
  }
}
```

### Validation Handler Options

```javascript
{
  supportEmail: 'support@example.com',  // Support email for error messages
  logging: true,                        // Enable detailed logging
  messages: {
    validationFailed: "Invalid license data",
    deviceNotFound: "Device not found or not activated",
    rateLimitExceeded: "Too many attempts",
    unexpectedError: "Unexpected error occurred"
  },
  onValidationSuccess: async (response, requestBody) => {
    // Process successful validation
    // response: validation result with device info and timestamps
  },
  onValidationError: async (error, requestBody) => {
    // Process validation errors
  }
}
```

### Info Handler Options

```javascript
{
  requireSession: true,          // Require valid session
  useMiddlewareValidation: false, // Use middleware validation
  projection: {                  // MongoDB projection for license fields
    licenseKey: 1,
    email: 1,
    status: 1,
    // ... additional fields
  },
  onInfoRetrieved: async (response, session) => {
    // Process successful info retrieval
    // response: license info and devices
    // session: validated session data
  }
}
```

### Recovery Handler Options

```javascript
{
  logging: true,            // Enable detailed logging
  licenseStatus: "active",  // Status filter for license recovery
  messages: {
    emailRequired: "Email is required",
    noLicensesFound: "No active licenses found",
    recoverySuccess: "License details sent to email",
    rateLimitExceeded: "Rate limit exceeded",
    internalError: "Internal server error"
  },
  onRecoveryRequested: async (email, request) => {
    // Process before license search
  },
  onLicensesFound: async (licenses, email) => {
    // Process after finding licenses
  }
}
```

## Error Handling

All handlers include comprehensive error handling:

### Rate Limiting
- IP-based rate limiting
- License-key-based rate limiting (for activation)
- Configurable limits per endpoint
- Rate limit headers in responses

### Validation Errors
- Request schema validation
- License key format validation
- Hardware info validation
- Custom validation hooks

### Business Logic Errors
- License not found/inactive
- Device limits exceeded
- Device already activated
- Session validation failures

### Example Error Response
```json
{
  "error": "Maximum number of devices already activated",
  "code": "MAX_DEVICES_REACHED",
  "message": "You have reached the maximum number of devices allowed for this license. Visit focusmo.app/license/dashboard to manage your devices."
}
```

## Security Features

- **Rate Limiting**: Prevents abuse and brute force attacks
- **Request Validation**: Validates all inputs using Zod schemas
- **Session Management**: Secure session validation for protected routes
- **Hardware Fingerprinting**: Device identification for activation
- **Middleware Integration**: Request validation and security checks
- **Logging**: Comprehensive logging for security monitoring

## Usage Examples

### Basic License Management

```javascript
// app/api/license/route.js
import { createLicenseCRUDHandler } from '@/api/license/license-crud';

const handlers = createLicenseCRUDHandler({
  postEnabled: false // Disable license creation
});

export const POST = handlers.POST;
export const GET = handlers.GET;
```

### Device Activation with Analytics

```javascript
// app/api/license/activate/route.js
import { createActivateHandler } from '@/api/license/activate';
import { trackEvent } from '@/lib/analytics';

export const POST = createActivateHandler({
  onActivationSuccess: async (response, requestBody) => {
    await trackEvent('device_activated', {
      licenseKey: requestBody.licenseKey,
      deviceId: response.deviceId,
      timestamp: new Date().toISOString()
    });
  },
  onActivationError: async (error, originalError, requestBody) => {
    await trackEvent('activation_failed', {
      licenseKey: requestBody.licenseKey,
      errorCode: error.code,
      timestamp: new Date().toISOString()
    });
  }
});
```

### Custom Validation Logic

```javascript
// app/api/license/validate/route.js
import { createValidateHandler } from '@/api/license/validate';

export const POST = createValidateHandler({
  onValidationSuccess: async (response, requestBody) => {
    // Update last seen timestamp
    await updateLastSeen(requestBody.licenseKey, requestBody.deviceId);
    
    // Check for license expiration warnings
    if (response.daysUntilExpiry < 30) {
      await sendExpirationWarning(response.license.email);
    }
  }
});
```

## Migration from Direct Routes

To migrate existing API routes:

1. **Replace Implementation**:
   ```javascript
   // Before: 50+ lines of license logic
   export async function POST(request) {
     // Complex validation, rate limiting, activation logic...
   }
   
   // After: Configuration-based approach
   import { createActivateHandler } from '@/api/license/activate';
   export const POST = createActivateHandler({ /* config */ });
   ```

2. **Preserve Custom Logic**: Use configuration hooks to maintain custom behavior
3. **Test Thoroughly**: Verify all functionality works identically
4. **Monitor**: Use logging to ensure proper operation

## Database Dependencies

The handlers require these database adapters and operations:

- `@/adapters/license.db` - License collection access
- `@/lib/license/license.operations` - Core license operations
- `@/lib/license/license.utils` - Utility functions
- `@/lib/license/license.validation` - Validation schemas
- `@/lib/session` - Session management
- `@/lib/ratelimit` - Rate limiting functionality

## Rate Limiters Used

- `rateLimiters.licenseCreation` - License creation
- `rateLimiters.licenseValidation` - License validation and info
- `rateLimiters.deviceActivation` - Device activation/deactivation
- `rateLimiters.licenseRecovery` - License recovery

Each rate limiter has configured limits and time windows for security.