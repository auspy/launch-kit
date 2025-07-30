/**
 * Configurable download system handler
 * Supports both direct downloads and email-based secure downloads
 */

import { loops } from '@/lib/loops.config';
import { rateLimit, rateLimiters } from '@/lib/ratelimit';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

export function createDownloadHandler(config = {}) {
  const {
    // Download configuration
    downloadUrl = process.env.MAC_DOWNLOAD_URL || process.env.DOWNLOAD_URL,
    jwtSecret = process.env.JWT_SECRET || 'your-secret-key',
    websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://focusmo.app',
    
    // Platform validation
    requiredUserAgent = 'mac', // Platform requirement
    
    // Email configuration
    emailTemplateId = process.env.LOOPS_DOWNLOAD_LINK_TEMPLATE_ID,
    supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    
    // Validation schema
    downloadSchema = getDefaultDownloadSchema(),
    
    // Rate limiting
    directDownloadRateLimiter = rateLimiters.directDownload,
    downloadFormRateLimiter = rateLimiters.downloadForm,
    
    // Customization hooks
    onDirectDownload = async (downloadUrl, userAgent, ip) => ({ downloadUrl }),
    onEmailDownload = async (trackableUrl, downloadUrl, userData) => ({ success: true, message: "Download link sent to your email", trackableUrl, downloadUrl }),
    onUserAgentValidation = async (userAgent, requiredAgent) => userAgent.toLowerCase().includes(requiredAgent.toLowerCase()),
    onTokenGeneration = async (userData, baseToken) => baseToken,
    onEmailProcessing = async (email, userData) => userData,
    onValidationError = async (error, requestData) => null,
    onError = async (error, requestData) => null,
    
    // Logging
    logging = true,
  } = config;

  // GET handler for direct downloads
  async function handleDirectDownload(request) {
    const requestId = Date.now().toString();
    
    try {
      if (logging) {
        console.log(`[Download ${requestId}] Processing direct download request`);
      }

      const userAgent = request.headers.get("user-agent") || "";
      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

      // Apply rate limiting for direct downloads
      try {
        await rateLimit(directDownloadRateLimiter, ip);
      } catch (error) {
        const rateLimitData = JSON.parse(error.message);
        const customResponse = await onError(error, { type: 'rate_limit', ip, userAgent });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({
            error: "Too many download attempts",
            reason: `Please try again in ${rateLimitData.formattedReset}.`,
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate user agent
      const isValidUserAgent = await onUserAgentValidation(userAgent, requiredUserAgent);
      if (!isValidUserAgent) {
        const error = new Error(`This download is only available for ${requiredUserAgent} users`);
        const customResponse = await onValidationError(error, { userAgent, requiredUserAgent });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({
            error: error.message,
            reason: `Please use a ${requiredUserAgent} device to download the application.`,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (!downloadUrl) {
        const error = new Error('Download URL not configured');
        const customResponse = await onError(error, { type: 'config', downloadUrl });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({
            error: "Download URL not configured",
            reason: "The download is temporarily unavailable. Please try again later.",
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Allow customization of direct download response
      const result = await onDirectDownload(downloadUrl, userAgent, ip);

      if (logging) {
        console.log(`[Download ${requestId}] Direct download URL provided`);
      }

      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      if (logging) {
        console.error(`[Download ${requestId}] Direct download error:`, error);
      }
      
      const customResponse = await onError(error, { type: 'direct_download', requestId });
      if (customResponse) return customResponse;
      
      return new Response(
        JSON.stringify({
          error: "Failed to generate download URL",
          reason: "An unexpected error occurred. Please try again later.",
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // POST handler for email-based downloads
  async function handleEmailDownload(request) {
    const requestId = Date.now().toString();
    
    try {
      if (logging) {
        console.log(`[Download ${requestId}] Processing email download request`);
      }

      const userAgent = request.headers.get("user-agent") || "";
      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

      // Validate user agent first
      const isValidUserAgent = await onUserAgentValidation(userAgent, requiredUserAgent);
      if (!isValidUserAgent) {
        const error = new Error(`This download is only available for ${requiredUserAgent} users`);
        const customResponse = await onValidationError(error, { userAgent, requiredUserAgent });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({
            error: error.message,
            reason: `Please use a ${requiredUserAgent} device to download the application.`,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Apply rate limiting
      try {
        await rateLimit(downloadFormRateLimiter, ip);
      } catch (error) {
        const rateLimitData = JSON.parse(error.message);
        const customResponse = await onError(error, { type: 'rate_limit', ip, userAgent });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({
            error: `Too many download attempts. Please try again in ${rateLimitData.formattedReset}.`,
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Parse and validate the request body
      const body = await request.json();
      const validationResult = downloadSchema.safeParse(body);

      if (!validationResult.success) {
        const error = new Error(validationResult.error.errors[0].message);
        const customResponse = await onValidationError(error, body);
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const { email, consentUpdates, consentNewsletter } = validationResult.data;

      // Generate a secure token for tracking downloads
      const baseTokenData = {
        email: email,
        consentUpdates: consentUpdates,
        consentNewsletter: consentNewsletter,
        type: "download",
        userAgent: userAgent,
        ipAddress: ip,
        iat: Math.floor(Date.now() / 1000),
      };

      const downloadToken = await onTokenGeneration(
        baseTokenData,
        jwt.sign(baseTokenData, jwtSecret, { expiresIn: "7d" })
      );

      // Create the trackable download URL
      const trackableDownloadUrl = `${websiteUrl}/download/${downloadToken}`;

      // Process email data
      const emailData = await onEmailProcessing(email, {
        consentUpdates,
        consentNewsletter,
        userAgent,
        ip,
        downloadToken: downloadToken.substring(0, 8),
      });

      // Create or update contact in Loops
      const response = await loops.updateContact(email, {
        source: "Website Download",
        userProperties: {
          lastDownloadAt: new Date().toISOString(),
          consentProductUpdates: consentUpdates,
          consentNewsletter: consentNewsletter,
          userAgent: userAgent,
          ipAddress: ip,
          downloadToken: downloadToken.substring(0, 8),
          ...emailData.customProperties,
        },
        subscribed: consentNewsletter || consentUpdates,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to process download");
      }

      // Send download email using Loops
      const emailResponse = await loops.sendTransactionalEmail({
        transactionalId: emailTemplateId,
        email: email,
        dataVariables: {
          downloadUrl: trackableDownloadUrl,
          timestamp: new Date().toLocaleString("en-US", {
            timeZone: "UTC",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          supportEmail: supportEmail,
          consentProductUpdates: consentUpdates ? "Yes" : "No",
          consentNewsletter: consentNewsletter ? "Yes" : "No",
          ...emailData.emailVariables,
        },
      });

      if (!emailResponse.success) {
        throw new Error("Failed to send download email");
      }

      // Allow customization of response
      const result = await onEmailDownload(trackableDownloadUrl, downloadUrl, {
        email,
        consentUpdates,
        consentNewsletter,
        requestId,
      });

      if (logging) {
        console.log(`[Download ${requestId}] Download email sent successfully to ${email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
      }

      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      if (logging) {
        console.error(`[Download ${requestId}] Email download error:`, error);
      }

      const customResponse = await onError(error, { type: 'email_download', requestId, body: body || {} });
      if (customResponse) return customResponse;
      
      return new Response(
        JSON.stringify({
          error: "Failed to process download request. Please try again later."
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return {
    GET: handleDirectDownload,
    POST: handleEmailDownload,
  };
}

/**
 * Token verification handler for download links
 */
export function createDownloadVerifyHandler(config = {}) {
  const {
    // Configuration
    downloadUrl = process.env.MAC_DOWNLOAD_URL || process.env.DOWNLOAD_URL,
    jwtSecret = process.env.JWT_SECRET || 'your-secret-key',
    requiredUserAgent = 'mac',
    fileName = 'app.dmg',
    
    // Customization hooks
    onTokenVerified = async (tokenData, userAgent, ip) => tokenData,
    onUserAgentValidation = async (userAgent, requiredAgent) => userAgent.toLowerCase().includes(requiredAgent.toLowerCase()),
    onValidationError = async (error, requestData) => null,
    onError = async (error, requestData) => null,
    
    // Logging
    logging = true,
  } = config;

  return async function verifyHandler(request, { params } = {}) {
    const requestId = Date.now().toString();
    
    try {
      if (logging) {
        console.log(`[DownloadVerify ${requestId}] Verifying download token`);
      }

      const { token } = params || {};
      const userAgent = request.headers.get("user-agent") || "";
      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

      if (!token) {
        const error = new Error('Token is required');
        const customResponse = await onValidationError(error, { token, userAgent, ip });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({ error: "Token is required" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Verify and decode the JWT token
      let decoded;
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (error) {
        const customResponse = await onValidationError(error, { token: token.substring(0, 8), userAgent, ip });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({ error: "Invalid or expired download link" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check if token has expired (additional check)
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        const error = new Error('Download link has expired');
        const customResponse = await onValidationError(error, { token: token.substring(0, 8), userAgent, ip });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({ error: "Download link has expired" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate token data
      if (!decoded.email || !decoded.type || decoded.type !== "download") {
        const error = new Error('Invalid download token');
        const customResponse = await onValidationError(error, { token: token.substring(0, 8), userAgent, ip });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({ error: "Invalid download token" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate user agent
      const isValidUserAgent = await onUserAgentValidation(userAgent, requiredUserAgent);
      if (!isValidUserAgent) {
        const error = new Error(`This download is only available for ${requiredUserAgent} users`);
        const customResponse = await onValidationError(error, { userAgent, requiredUserAgent });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({
            error: error.message,
            reason: `Please use a ${requiredUserAgent} device to download the application.`,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (!downloadUrl) {
        const error = new Error('Download URL not configured');
        const customResponse = await onError(error, { type: 'config', downloadUrl });
        
        if (customResponse) return customResponse;
        
        return new Response(
          JSON.stringify({
            error: "Download URL not configured",
            reason: "The download is temporarily unavailable. Please try again later.",
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Extract email domain for analytics (privacy-conscious)
      const emailDomain = decoded.email.split("@")[1];

      // Prepare token data for customization
      const baseTokenData = {
        downloadUrl: downloadUrl,
        fileName: fileName,
        email: decoded.email,
        emailDomain: emailDomain,
        issuedAt: new Date(decoded.iat * 1000).toISOString(),
        consentUpdates: decoded.consentUpdates || false,
        consentNewsletter: decoded.consentNewsletter || false,
      };

      // Allow customization of verification response
      const result = await onTokenVerified(baseTokenData, userAgent, ip);

      if (logging) {
        console.log(`[DownloadVerify ${requestId}] Token verified for ${decoded.email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
      }

      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      if (logging) {
        console.error(`[DownloadVerify ${requestId}] Token verification error:`, error);
      }

      const customResponse = await onError(error, { requestId, token: params?.token?.substring(0, 8) });
      if (customResponse) return customResponse;
      
      return new Response(
        JSON.stringify({
          error: "Failed to verify download link",
          reason: "An unexpected error occurred. Please try again later.",
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

/**
 * Default validation schema for download requests
 */
function getDefaultDownloadSchema() {
  return z.object({
    email: z.string().email("Please enter a valid email address"),
    consentUpdates: z.boolean().default(true),
    consentNewsletter: z.boolean().default(false),
  });
}

/**
 * Default configuration for download handlers
 */
export const defaultDownloadConfig = {
  downloadUrl: process.env.MAC_DOWNLOAD_URL || process.env.DOWNLOAD_URL,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://focusmo.app',
  requiredUserAgent: 'mac',
  emailTemplateId: process.env.LOOPS_DOWNLOAD_LINK_TEMPLATE_ID,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  fileName: 'focusmo.dmg',
  downloadSchema: getDefaultDownloadSchema(),
  logging: true,
};