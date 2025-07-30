# Download System API Handlers

Configurable download system for LaunchKit applications, providing secure file downloads with email-based token verification, user agent validation, and comprehensive analytics tracking.

## Overview

The download system provides a complete solution for secure file distribution including direct downloads, email-based download links with JWT tokens, user agent validation, rate limiting, and analytics integration. All handlers preserve original functionality while adding extensive customization capabilities.

## Handlers

### createDownloadHandler

Creates configurable download handlers supporting both direct downloads (GET) and email-based downloads (POST).

```javascript
import { createDownloadHandler, defaultDownloadConfig } from '@/api/download/download-handler';

const handlers = createDownloadHandler({
  ...defaultDownloadConfig,
  requiredUserAgent: 'mac',
  onDirectDownload: async (downloadUrl, userAgent, ip) => {
    console.log(`Direct download requested from ${userAgent.includes('Mac') ? 'Mac' : 'Unknown'} device`);
    return { downloadUrl };
  },
  onEmailDownload: async (trackableUrl, downloadUrl, userData) => {
    console.log(`Download email sent to ${userData.email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
    return {
      success: true,
      message: "Download link sent to your email",
      trackableUrl,
      downloadUrl,
    };
  }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
```

### createDownloadVerifyHandler

Creates a token verification handler for secure download links.

```javascript
import { createDownloadVerifyHandler, defaultDownloadConfig } from '@/api/download/download-handler';

export const GET = createDownloadVerifyHandler({
  ...defaultDownloadConfig,
  fileName: 'your-app.dmg',
  onTokenVerified: async (tokenData, userAgent, ip) => {
    console.log(`Download token verified for ${tokenData.email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
    return {
      downloadUrl: tokenData.downloadUrl,
      fileName: tokenData.fileName,
      email: tokenData.email,
      emailDomain: tokenData.emailDomain,
      issuedAt: tokenData.issuedAt,
      consentUpdates: tokenData.consentUpdates,
      consentNewsletter: tokenData.consentNewsletter,
    };
  }
});
```

## Configuration Options

### Download Handler Options

```javascript
{
  // Download configuration
  downloadUrl: process.env.MAC_DOWNLOAD_URL || process.env.DOWNLOAD_URL,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://focusmo.app',
  
  // Platform validation
  requiredUserAgent: 'mac', // Platform requirement (case-insensitive)
  
  // Email configuration
  emailTemplateId: process.env.LOOPS_DOWNLOAD_LINK_TEMPLATE_ID,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  
  // Validation schema (Zod schema)
  downloadSchema: z.object({
    email: z.string().email("Please enter a valid email address"),
    consentUpdates: z.boolean().default(true),
    consentNewsletter: z.boolean().default(false),
  }),
  
  // Rate limiting
  directDownloadRateLimiter: rateLimiters.directDownload,
  downloadFormRateLimiter: rateLimiters.downloadForm,
  
  // Customization hooks
  onDirectDownload: async (downloadUrl, userAgent, ip) => ({ downloadUrl }),
  onEmailDownload: async (trackableUrl, downloadUrl, userData) => ({
    success: true,
    message: "Download link sent to your email",
    trackableUrl,
    downloadUrl
  }),
  onUserAgentValidation: async (userAgent, requiredAgent) => 
    userAgent.toLowerCase().includes(requiredAgent.toLowerCase()),
  onTokenGeneration: async (userData, baseToken) => baseToken,
  onEmailProcessing: async (email, userData) => userData,
  onValidationError: async (error, requestData) => null,
  onError: async (error, requestData) => null,
  
  // Logging
  logging: true,
}
```

### Download Verify Handler Options

```javascript
{
  // Configuration
  downloadUrl: process.env.MAC_DOWNLOAD_URL || process.env.DOWNLOAD_URL,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  requiredUserAgent: 'mac',
  fileName: 'app.dmg',
  
  // Customization hooks
  onTokenVerified: async (tokenData, userAgent, ip) => tokenData,
  onUserAgentValidation: async (userAgent, requiredAgent) => 
    userAgent.toLowerCase().includes(requiredAgent.toLowerCase()),
  onValidationError: async (error, requestData) => null,
  onError: async (error, requestData) => null,
  
  // Logging
  logging: true,
}
```

## API Endpoints

### Direct Download

**GET** `/api/download`

Provides direct download URLs with rate limiting and user agent validation.

```javascript
// Response
{
  "downloadUrl": "https://releases.yoursite.com/app.dmg"
}
```

### Email-Based Download

**POST** `/api/download`

Generates secure download tokens and sends them via email.

```javascript
// Request body
{
  "email": "user@example.com",
  "consentUpdates": true,
  "consentNewsletter": false
}

// Response
{
  "success": true,
  "message": "Download link sent to your email",
  "trackableUrl": "https://yoursite.com/download/jwt_token_here",
  "downloadUrl": "https://releases.yoursite.com/app.dmg" // For backward compatibility
}
```

### Token Verification

**GET** `/api/download/verify/[token]`

Verifies download tokens and returns download information.

```javascript
// Response
{
  "downloadUrl": "https://releases.yoursite.com/app.dmg",
  "fileName": "app.dmg",
  "email": "user@example.com",
  "emailDomain": "example.com",
  "issuedAt": "2024-01-15T10:30:00.000Z",
  "consentUpdates": true,
  "consentNewsletter": false
}
```

## Security Features

### JWT Token Security
- **Secure Tokens**: 7-day expiration with cryptographic signatures
- **Token Validation**: Comprehensive validation of token structure and expiration
- **Privacy Protection**: Only partial tokens logged for security

### User Agent Validation
- **Platform Enforcement**: Configurable platform requirements (e.g., Mac-only)
- **Custom Validation**: Override validation logic for specific use cases

### Rate Limiting
- **Direct Downloads**: Protection against abuse of direct download endpoints
- **Form Submissions**: Separate limits for email-based download requests
- **IP-Based**: Tracks attempts by IP address with configurable time windows

### Request Validation
- **Schema Validation**: Zod-based validation for all request parameters
- **Email Validation**: Email format and domain validation
- **Consent Tracking**: GDPR-compliant consent management

## Email Integration

### Loops Integration
The system integrates with Loops for email delivery and contact management:

```javascript
// Contact creation/update
await loops.updateContact(email, {
  source: "Website Download",
  userProperties: {
    lastDownloadAt: new Date().toISOString(),
    consentProductUpdates: consentUpdates,
    consentNewsletter: consentNewsletter,
    userAgent: userAgent,
    ipAddress: ip,
    downloadToken: downloadToken.substring(0, 8),
  },
  subscribed: consentNewsletter || consentUpdates,
});

// Email delivery
await loops.sendTransactionalEmail({
  transactionalId: emailTemplateId,
  email: email,
  dataVariables: {
    downloadUrl: trackableDownloadUrl,
    timestamp: formattedTimestamp,
    supportEmail: supportEmail,
    consentProductUpdates: consentUpdates ? "Yes" : "No",
    consentNewsletter: consentNewsletter ? "Yes" : "No",
  },
});
```

## Error Handling

### Validation Errors (400)
- Invalid email format
- Missing required fields
- Invalid user agent (platform mismatch)
- Token validation failures

### Rate Limiting (429)
- Too many direct download attempts
- Too many form submissions
- Configurable time windows and limits

### Authentication Errors (400/401)
- Invalid JWT tokens
- Expired download links
- Malformed token structure

### Configuration Errors (500)
- Missing download URLs
- Invalid JWT secrets
- Email service failures

### Example Error Response
```json
{
  "error": "This download is only available for Mac users",
  "reason": "Please use a Mac device to download the application."
}
```

## Usage Examples

### Basic Download System

```javascript
// app/api/download/route.js
import { createDownloadHandler, defaultDownloadConfig } from '@/api/download/download-handler';

const handlers = createDownloadHandler(defaultDownloadConfig);

export const GET = handlers.GET;
export const POST = handlers.POST;
export const dynamic = "force-dynamic";
```

### Platform-Specific Downloads

```javascript
// app/api/download/route.js
import { createDownloadHandler, defaultDownloadConfig } from '@/api/download/download-handler';

const handlers = createDownloadHandler({
  ...defaultDownloadConfig,
  requiredUserAgent: 'windows',
  downloadUrl: process.env.WINDOWS_DOWNLOAD_URL,
  fileName: 'app-setup.exe',
  onUserAgentValidation: async (userAgent, requiredAgent) => {
    return userAgent.toLowerCase().includes('windows') || 
           userAgent.toLowerCase().includes('win64');
  }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
```

### Custom Analytics Integration

```javascript
const handlers = createDownloadHandler({
  ...defaultDownloadConfig,
  onDirectDownload: async (downloadUrl, userAgent, ip) => {
    // Track direct downloads
    await analytics.track('direct_download', {
      userAgent,
      ip: ip.substring(0, 8), // Privacy-conscious IP logging
      timestamp: new Date().toISOString()
    });
    
    return { downloadUrl };
  },
  onEmailDownload: async (trackableUrl, downloadUrl, userData) => {
    // Track email downloads
    await analytics.track('email_download_requested', {
      email_domain: userData.email.split('@')[1],
      consent_updates: userData.consentUpdates,
      consent_newsletter: userData.consentNewsletter,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      message: "Download link sent to your email",
      trackableUrl,
      downloadUrl,
    };
  }
});
```

### Custom Email Processing

```javascript
const handlers = createDownloadHandler({
  ...defaultDownloadConfig,
  onEmailProcessing: async (email, userData) => {
    // Determine user segment
    const emailDomain = email.split('@')[1];
    const isEnterprise = ['company.com', 'enterprise.org'].includes(emailDomain);
    
    return {
      ...userData,
      customProperties: {
        userSegment: isEnterprise ? 'enterprise' : 'individual',
        signupSource: 'download_page'
      },
      emailVariables: {
        userType: isEnterprise ? 'Enterprise' : 'Individual',
        customMessage: isEnterprise ? 
          'Thank you for your enterprise interest!' : 
          'Thanks for trying our app!'
      }
    };
  }
});
```

## Environment Variables

```bash
# Required
MAC_DOWNLOAD_URL=https://releases.yoursite.com/app.dmg
JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_WEBSITE_URL=https://yoursite.com

# Email integration
LOOPS_DOWNLOAD_LINK_TEMPLATE_ID=tmpl_xxx
NEXT_PUBLIC_SUPPORT_EMAIL=support@yoursite.com

# Optional platform-specific
WINDOWS_DOWNLOAD_URL=https://releases.yoursite.com/app-setup.exe
LINUX_DOWNLOAD_URL=https://releases.yoursite.com/app.AppImage
```

## Integration with Frontend

The download system works seamlessly with the `DownloadPage` screen component:

```javascript
// app/download/[token]/page.js
import DownloadPage from '@/screens/download/DownloadPage';

export default function Page() {
  const config = {
    apiBaseUrl: process.env.NEXT_PUBLIC_WEBSITE_URL,
    analytics: {
      // Your analytics integration
    },
    onDownloadStart: async (tokenData) => {
      console.log(`Download started for ${tokenData.email}`);
    }
  };

  return <DownloadPage config={config} />;
}
```

## Dependencies

The download handlers require:

- `@/lib/loops.config` - Loops email service integration
- `@/lib/ratelimit` - Rate limiting utilities
- `jsonwebtoken` - JWT token generation and verification
- `zod` - Request validation
- Environment variables for download URLs and secrets

## Best Practices

1. **Security**: Always use HTTPS for download URLs and secure JWT secrets
2. **Privacy**: Log only partial tokens and masked emails for debugging
3. **Rate Limiting**: Configure appropriate limits to prevent abuse
4. **User Experience**: Provide clear error messages and fallback options
5. **Analytics**: Track download metrics while respecting user privacy
6. **Email Integration**: Use proper consent management for GDPR compliance