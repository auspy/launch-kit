/**
 * Configurable contact form handler
 * Handles form submissions with email integration and rate limiting
 */

import { rateLimit, rateLimiters } from '@/lib/ratelimit';
import { loops } from '@/lib/loops.config';
import { z } from 'zod';

export function createContactHandler(config = {}) {
  const {
    // Email configuration
    supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    emailTemplateId = process.env.LOOPS_CONTACT_FORM_TEMPLATE_ID,
    
    // Rate limiting
    contactFormRateLimiter = rateLimiters.contactForm,
    
    // Validation schema
    validationSchema = getDefaultContactSchema(),
    
    // Email service configuration
    emailSource = "Contact Form",
    
    // Customization hooks
    onContactSubmitted = async (contactData, requestData) => ({ success: true, message: "Message sent successfully" }),
    onEmailProcessing = async (email, messageData) => messageData,
    onContactCreated = async (email, contactData) => contactData,
    onValidationError = async (error, requestData) => null,
    onError = async (error, requestData) => null,
    
    // Logging
    logging = true,
  } = config;

  return async function contactHandler(request) {
    const requestId = Date.now().toString();
    
    try {
      if (logging) {
        console.log(`[Contact ${requestId}] Processing contact form submission`);
      }

      // Get the user's IP address for rate limiting
      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

      // Apply rate limiting
      try {
        await rateLimit(contactFormRateLimiter, ip);
      } catch (error) {
        const rateLimitData = JSON.parse(error.message);
        const customResponse = await onError(error, { type: 'rate_limit', ip });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({
            error: `Too many requests. Please try again in ${rateLimitData.formattedReset}.`,
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Parse and validate the request body
      const body = await request.json();
      const validationResult = validationSchema.safeParse(body);

      if (!validationResult.success) {
        const error = new Error(validationResult.error.errors[0].message);
        const customResponse = await onValidationError(error, body);
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const { email, message, marketingConsent } = validationResult.data;

      if (logging) {
        console.log(`[Contact ${requestId}] Contact form submission from ${email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
      }

      // Allow customization of contact data
      const contactData = await onContactCreated(email, {
        marketingConsent,
        lastContactedAt: new Date().toISOString(),
        requestId,
      });

      // Create or update contact in Loops with marketing preference
      await loops.updateContact(email, {
        source: emailSource,
        userProperties: {
          lastContactedAt: new Date().toISOString(),
          marketingConsent: marketingConsent,
          ...contactData.customProperties,
        },
      });

      // Allow customization of email message data
      const emailData = await onEmailProcessing(email, {
        message,
        marketingConsent,
        timestamp: new Date().toLocaleString("en-US", {
          timeZone: "UTC",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      });

      // Send email using Loops
      const response = await loops.sendTransactionalEmail({
        transactionalId: emailTemplateId,
        email: supportEmail, // Send to support email
        replyTo: email, // Set reply-to as the user's email
        dataVariables: {
          senderEmail: email,
          message: message,
          marketingConsent: marketingConsent ? "Yes" : "No",
          timestamp: emailData.timestamp,
          ...emailData.customVariables,
        },
      });

      if (!response.success) {
        throw new Error("Failed to send message");
      }

      // Allow customization of response
      const result = await onContactSubmitted({
        email,
        message,
        marketingConsent,
      }, {
        requestId,
        ip,
      });

      if (logging) {
        console.log(`[Contact ${requestId}] Contact form message sent successfully to support`);
      }

      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      if (logging) {
        console.error(`[Contact ${requestId}] Contact form error:`, error);
      }

      const customResponse = await onError(error, { requestId, body: body || {} });
      if (customResponse) return customResponse;
      
      return new Response(
        JSON.stringify({
          error: "Failed to send message. Please try again later."
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

/**
 * Default validation schema for contact form
 */
function getDefaultContactSchema() {
  return z.object({
    email: z.string().email("Please enter a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters long"),
    marketingConsent: z.boolean().default(false),
  });
}

/**
 * Default configuration for contact handler
 */
export const defaultContactConfig = {
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  emailTemplateId: process.env.LOOPS_CONTACT_FORM_TEMPLATE_ID,
  contactFormRateLimiter: rateLimiters.contactForm,
  validationSchema: getDefaultContactSchema(),
  emailSource: "Contact Form",
  logging: true,
};