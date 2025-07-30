# Contact System API Handlers

Configurable contact form processing handlers for LaunchKit applications, providing secure form submission with email integration, marketing consent management, and comprehensive validation.

## Overview

The contact system provides a complete solution for handling contact form submissions including validation, rate limiting, email integration with Loops, marketing consent tracking, and customizable processing workflows. All handlers preserve original functionality while adding extensive customization capabilities.

## Handlers

### createContactHandler

Creates a configurable contact form submission handler with email integration.

```javascript
import { createContactHandler, defaultContactConfig } from '@/api/contact/contact-handler';

export const POST = createContactHandler({
  ...defaultContactConfig,
  emailSource: "Your Site Contact",
  onContactSubmitted: async (contactData, requestData) => {
    console.log(`Contact form submitted from ${contactData.email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
    return {
      success: true,
      message: "Message sent successfully",
    };
  },
  onEmailProcessing: async (email, messageData) => {
    return {
      ...messageData,
      customVariables: {
        websiteSource: "yoursite.com",
      }
    };
  }
});
```

## Configuration Options

### Contact Handler Options

```javascript
{
  // Email configuration
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  emailTemplateId: process.env.LOOPS_CONTACT_FORM_TEMPLATE_ID,
  
  // Rate limiting
  contactFormRateLimiter: rateLimiters.contactForm,
  
  // Validation schema (Zod schema)
  validationSchema: z.object({
    email: z.string().email("Please enter a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters long"),
    marketingConsent: z.boolean().default(false),
  }),
  
  // Email service configuration
  emailSource: "Contact Form", // Source identifier for Loops
  
  // Customization hooks
  onContactSubmitted: async (contactData, requestData) => ({
    success: true,
    message: "Message sent successfully"
  }),
  onEmailProcessing: async (email, messageData) => messageData,
  onContactCreated: async (email, contactData) => contactData,
  onValidationError: async (error, requestData) => null,
  onError: async (error, requestData) => null,
  
  // Logging
  logging: true,
}
```

## API Endpoints

### Contact Form Submission

**POST** `/api/contact`

Processes contact form submissions with email integration and consent tracking.

```javascript
// Request body
{
  "email": "user@example.com",
  "message": "Hello, I have a question about your product...",
  "marketingConsent": true
}

// Response
{
  "success": true,
  "message": "Message sent successfully"
}
```

## Features

### Form Validation
- **Email Validation**: Validates email format and domain
- **Message Length**: Configurable minimum message length (default: 10 characters)
- **Schema Validation**: Zod-based validation with custom error messages
- **Required Fields**: Ensures all required fields are present

### Marketing Consent Management
- **GDPR Compliance**: Proper consent tracking and storage
- **Loops Integration**: Updates contact preferences in email system
- **Consent Tracking**: Records consent status with timestamps
- **Subscription Management**: Automatically manages email subscription status

### Email Integration
The system integrates with Loops for both contact management and email delivery:

```javascript
// Contact creation/update in Loops
await loops.updateContact(email, {
  source: emailSource,
  userProperties: {
    lastContactedAt: new Date().toISOString(),
    marketingConsent: marketingConsent,
    contactedFromWebsite: true,
  },
});

// Email delivery to support team
await loops.sendTransactionalEmail({
  transactionalId: emailTemplateId,
  email: supportEmail, // Send to support email
  replyTo: email, // Set reply-to as the user's email
  dataVariables: {
    senderEmail: email,
    message: message,
    marketingConsent: marketingConsent ? "Yes" : "No",
    timestamp: formattedTimestamp,
    websiteSource: "yoursite.com",
  },
});
```

### Rate Limiting
- **IP-Based Protection**: Prevents spam and abuse
- **Configurable Limits**: Customize rate limits per use case
- **Time Windows**: Configurable reset periods
- **Error Messages**: Clear feedback about rate limits

## Security Features

### Input Validation
- **Schema Validation**: Comprehensive input validation using Zod
- **XSS Protection**: Safe handling of user input
- **Email Validation**: Prevents invalid email submissions
- **Message Sanitization**: Safe processing of message content

### Rate Limiting
- **Abuse Prevention**: Protects against form spam and abuse
- **IP Tracking**: Monitors submission frequency per IP
- **Configurable Limits**: Adjustable based on usage patterns
- **Graceful Degradation**: Clear error messages for rate-limited requests

### Privacy Protection
- **Email Masking**: Logs masked emails for privacy protection
- **Consent Tracking**: Proper GDPR-compliant consent management
- **Data Minimization**: Only collects necessary information

## Error Handling

### Validation Errors (400)
- Invalid email format
- Message too short
- Missing required fields
- Schema validation failures

### Rate Limiting (429)
- Too many form submissions
- Configurable time windows
- Clear reset time information

### Email Service Errors (500)
- Loops API failures
- Email delivery failures
- Contact creation errors

### Example Error Response
```json
{
  "error": "Message must be at least 10 characters long"
}
```

## Usage Examples

### Basic Contact Handler

```javascript
// app/api/contact/route.js
import { createContactHandler, defaultContactConfig } from '@/api/contact/contact-handler';

export const POST = createContactHandler(defaultContactConfig);
```

### Custom Contact Processing

```javascript
// app/api/contact/route.js
import { createContactHandler, defaultContactConfig } from '@/api/contact/contact-handler';

export const POST = createContactHandler({
  ...defaultContactConfig,
  emailSource: "Premium Support Contact",
  onContactSubmitted: async (contactData, requestData) => {
    // Custom processing after contact submission
    console.log(`Contact form submitted from ${contactData.email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
    
    // Track in analytics
    await analytics.track('contact_form_submitted', {
      email_domain: contactData.email.split('@')[1],
      message_length: contactData.message.length,
      marketing_consent: contactData.marketingConsent,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      message: "Thank you for contacting us! We'll respond within 24 hours.",
    };
  },
  onContactCreated: async (email, contactData) => {
    // Custom contact data processing
    const emailDomain = email.split('@')[1];
    const isEnterprise = ['company.com', 'enterprise.org'].includes(emailDomain);
    
    return {
      ...contactData,
      customProperties: {
        contactedFromWebsite: true,
        userSegment: isEnterprise ? 'enterprise' : 'individual',
        contactSource: 'website_form',
        firstContactDate: new Date().toISOString(),
      }
    };
  },
  onEmailProcessing: async (email, messageData) => {
    // Custom email processing
    const emailDomain = email.split('@')[1];
    const isEnterprise = ['company.com', 'enterprise.org'].includes(emailDomain);
    
    return {
      ...messageData,
      customVariables: {
        websiteSource: "yoursite.com",
        userType: isEnterprise ? 'Enterprise' : 'Individual',
        priorityLevel: isEnterprise ? 'High' : 'Normal',
        autoResponse: isEnterprise ? 
          'Enterprise inquiry - will respond within 4 hours' : 
          'Standard inquiry - will respond within 24 hours'
      }
    };
  }
});
```

### Custom Validation Schema

```javascript
import { z } from 'zod';

const customContactSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(20, "Please provide a detailed message (minimum 20 characters)"),
  subject: z.string().min(5, "Please provide a subject line"),
  marketingConsent: z.boolean().default(false),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
});

export const POST = createContactHandler({
  ...defaultContactConfig,
  validationSchema: customContactSchema,
  onEmailProcessing: async (email, messageData) => {
    return {
      ...messageData,
      customVariables: {
        subject: messageData.subject,
        urgency: messageData.urgency,
        urgencyIcon: messageData.urgency === 'high' ? '🚨' : 
                     messageData.urgency === 'medium' ? '⚠️' : 'ℹ️'
      }
    };
  }
});
```

### Department Routing

```javascript
export const POST = createContactHandler({
  ...defaultContactConfig,
  onEmailProcessing: async (email, messageData) => {
    // Route to different departments based on message content
    const message = messageData.message.toLowerCase();
    let department = 'general';
    let departmentEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
    
    if (message.includes('billing') || message.includes('payment')) {
      department = 'billing';
      departmentEmail = process.env.BILLING_EMAIL;
    } else if (message.includes('technical') || message.includes('bug')) {
      department = 'technical';
      departmentEmail = process.env.TECHNICAL_EMAIL;
    } else if (message.includes('sales') || message.includes('enterprise')) {
      department = 'sales';
      departmentEmail = process.env.SALES_EMAIL;
    }
    
    return {
      ...messageData,
      departmentEmail,
      customVariables: {
        department: department,
        routedTo: departmentEmail,
        autoRouted: department !== 'general',
      }
    };
  }
});
```

## Integration with Frontend

The contact system works seamlessly with the `ContactPage` screen component:

```javascript
// app/contact/page.js
import ContactPage from '@/screens/contact/ContactPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Page() {
  const config = {
    headerComponent: Header,
    footerComponent: Footer,
    content: {
      title: "Contact Us",
      description: "Have a question or feedback? We'd love to hear from you.",
    },
    onSubmitSuccess: async (response, formData) => {
      // Custom success handling
      console.log('Contact form submitted successfully');
    }
  };

  return <ContactPage config={config} />;
}
```

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPPORT_EMAIL=support@yoursite.com
LOOPS_CONTACT_FORM_TEMPLATE_ID=tmpl_xxx

# Optional department routing
BILLING_EMAIL=billing@yoursite.com
TECHNICAL_EMAIL=tech@yoursite.com
SALES_EMAIL=sales@yoursite.com

# Rate limiting (optional, uses defaults if not set)
CONTACT_FORM_RATE_LIMIT=5
CONTACT_FORM_WINDOW_MS=900000
```

## Loops Email Template Variables

The system provides these variables to your Loops email template:

```javascript
{
  senderEmail: "user@example.com",      // The contact's email
  message: "User's message content",     // The contact message
  marketingConsent: "Yes" | "No",       // Marketing consent status
  timestamp: "Jan 15, 2024, 2:30 PM",  // Formatted submission time
  
  // Custom variables (if configured)
  websiteSource: "yoursite.com",
  userType: "Enterprise" | "Individual",
  department: "billing" | "technical" | "sales" | "general",
  priorityLevel: "High" | "Normal" | "Low",
}
```

## Dependencies

The contact handlers require:

- `@/lib/ratelimit` - Rate limiting functionality
- `@/lib/loops.config` - Loops email service integration
- `zod` - Request validation
- Environment variables for email configuration

## Best Practices

1. **Validation**: Use comprehensive validation to prevent invalid submissions
2. **Rate Limiting**: Implement appropriate rate limits to prevent abuse
3. **Privacy**: Mask sensitive information in logs and respect user privacy
4. **Consent Management**: Properly handle marketing consent for GDPR compliance
5. **Error Handling**: Provide clear, helpful error messages to users
6. **Email Integration**: Use proper email templates and variable handling
7. **Analytics**: Track form submissions while respecting user privacy
8. **Department Routing**: Route inquiries to appropriate teams for faster response