# Authentication API Handlers

Configurable authentication API route handlers for LaunchKit applications.

## Overview

The auth handlers provide a flexible, configurable approach to authentication that can be customized for different applications while maintaining consistent core functionality.

## Handlers

### createLoginHandler

Creates a configurable password-based login handler.

```javascript
import { createLoginHandler } from '@/api/auth/login';

const config = {
  supportEmail: 'support@yoursite.com',
  validation: {
    validateRequest: async (body) => ({ valid: true })
  },
  cookie: {
    name: 'auth_token',
    maxAge: 7 * 24 * 60 * 60
  },
  onSuccess: async (license, requestBody) => license,
  onError: async (error, supportEmail) => customErrorResponse
};

export const POST = createLoginHandler(config);
```

### createLogoutHandler

Creates a configurable logout handler.

```javascript
import { createLogoutHandler } from '@/api/auth/logout';

const config = {
  cookie: { name: 'auth_token' },
  onLogout: async (request) => { /* cleanup */ },
  onError: async (error) => customErrorResponse
};

export const POST = createLogoutHandler(config);
```

### createFirebaseLoginHandler

Creates a configurable Firebase authentication handler.

```javascript
import { createFirebaseLoginHandler } from '@/api/auth/firebase-login';

const config = {
  validation: {
    validateFirebaseRequest: async (body) => ({ valid: true })
  },
  messages: {
    success: 'Login successful',
    authFailed: 'Authentication failed'
  },
  onSuccess: async (licenseData, requestBody) => licenseData
};

export const POST = createFirebaseLoginHandler(config);
```

## Configuration Options

### Common Options

All handlers support these common configuration options:

```javascript
{
  cookie: {
    name: 'auth_token',           // Cookie name
    httpOnly: true,               // HTTP only flag
    secure: true,                 // Secure flag (auto-set based on NODE_ENV)
    sameSite: 'lax',             // SameSite policy
    path: '/',                   // Cookie path
    maxAge: 7 * 24 * 60 * 60     // Max age in seconds
  },
  onError: async (error) => {
    // Custom error handling
    return customErrorResponse;
  }
}
```

### Login Handler Options

```javascript
{
  supportEmail: 'support@example.com',
  validation: {
    validateRequest: async (body) => {
      // Custom validation logic
      // Return { valid: boolean, message?: string }
    }
  },
  onSuccess: async (license, requestBody) => {
    // Process successful authentication
    // Return modified license data
  }
}
```

### Firebase Login Handler Options

```javascript
{
  validation: {
    validateFirebaseRequest: async (body) => {
      // Validate Firebase authentication data
      // Return { valid: boolean, message?: string }
    }
  },
  messages: {
    missingFields: 'Custom missing fields message',
    licenseNotFound: (email) => `Custom not found message for ${email}`,
    success: 'Custom success message',
    authFailed: 'Custom auth failed message'
  },
  onSuccess: async (licenseData, requestBody) => {
    // Process successful Firebase authentication
    // Return modified license data
  }
}
```

### Logout Handler Options

```javascript
{
  onLogout: async (request) => {
    // Custom logout processing
    // Session cleanup, analytics, etc.
  }
}
```

## Usage in Routes

### Basic Usage

```javascript
// app/api/auth/login/route.js
import { createLoginHandler } from '@/api/auth/login';

export const POST = createLoginHandler({
  supportEmail: 'support@yoursite.com'
});
```

### Advanced Configuration

```javascript
// app/api/auth/login/route.js
import { createLoginHandler } from '@/api/auth/login';
import { trackEvent } from '@/lib/analytics';

const config = {
  supportEmail: process.env.SUPPORT_EMAIL,
  validation: {
    validateRequest: async ({ email, password, licenseKey }) => {
      // Custom validation
      if (!email.includes('@')) {
        return { valid: false, message: 'Invalid email format' };
      }
      return { valid: true };
    }
  },
  onSuccess: async (license, requestBody) => {
    // Track successful login
    await trackEvent('user_login', {
      email: license.email,
      method: 'password'
    });
    
    return {
      ...license,
      lastLogin: new Date().toISOString()
    };
  },
  onError: async (error, supportEmail) => {
    // Custom error tracking
    await trackEvent('login_failed', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({
        error: 'Authentication failed',
        code: 'AUTH_FAILED',
        message: `Please check your credentials or contact ${supportEmail}`
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST = createLoginHandler(config);
```

## Error Handling

All handlers include comprehensive error handling:

- Input validation errors (400)
- Rate limiting (429)
- Authentication failures (401/400)
- Server errors (500)

Custom error handlers can override default behavior:

```javascript
onError: async (error) => {
  // Log error
  console.error('Auth error:', error);
  
  // Return custom response
  return new Response(
    JSON.stringify({ error: 'Custom error message' }),
    { status: 500 }
  );
}
```

## Rate Limiting

All handlers include built-in rate limiting using the LaunchKit rate limiting system:

- Uses IP-based rate limiting
- Configurable limits per endpoint
- Returns rate limit headers

## Security Features

- HTTP-only cookies by default
- Secure cookies in production
- CSRF protection via SameSite cookies
- Input validation
- Rate limiting
- Error message sanitization

## Integration with License Management

The authentication handlers work seamlessly with the license management system:

```javascript
// Combined authentication and license validation
import { createLoginHandler } from '@/api/auth/login';
import { createValidateHandler } from '@/api/license/validate';

// Login handler that prepares for license operations
export const POST = createLoginHandler({
  onSuccess: async (license, requestBody) => {
    // Track login for license analytics
    console.log(`User logged in: ${license.email}`);
    return license;
  }
});

// Separate validation endpoint for license checks
export const validateLicense = createValidateHandler({
  supportEmail: 'support@yoursite.com',
  onValidationSuccess: async (response, requestBody) => {
    // Update last validation timestamp
    console.log(`License validated: ${requestBody.licenseKey}`);
  }
});
```

For complete license management functionality, see:
- [`@/api/license/README.md`](../license/README.md) - License management handlers
- [`@/api/license/activate`](../license/activate.js) - Device activation
- [`@/api/license/validate`](../license/validate.js) - License validation
- [`@/api/license/info`](../license/info.js) - License information retrieval

## Migration from Direct Routes

To migrate existing API routes:

1. Replace route logic with handler import
2. Configure handler with your settings
3. Test authentication flow
4. Update any custom logic in config hooks

Example migration:

```javascript
// Before
export async function POST(request) {
  // 50 lines of authentication logic
}

// After
import { createLoginHandler } from '@/api/auth/login';

export const POST = createLoginHandler({
  supportEmail: 'support@yoursite.com',
  onSuccess: async (license) => {
    // Your custom logic here
    return license;
  }
});
```