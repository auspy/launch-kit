import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error("Missing Upstash Redis credentials");
}

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const cache = new Map();

// Rate limit configurations
export const rateLimiters = {
  // License creation: 10 requests per hour
  licenseCreation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "@upstash/license-creation",
    analytics: true,
    ephemeralCache: cache,
  }),

  // License validation: 100 requests per minute
  licenseValidation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: "@upstash/license-validation",
    analytics: true,
    ephemeralCache: cache,
  }),

  // Device activation: 5 requests per hour per license
  deviceActivation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "@upstash/device-activation",
    analytics: true,
    ephemeralCache: cache,
  }),

  deviceDeactivation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "@upstash/device-deactivation",
    analytics: true,
    ephemeralCache: cache,
  }),

  // License recovery: 10 requests per hour
  licenseRecovery: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "@upstash/license-recovery",
    analytics: true,
    ephemeralCache: cache,
  }),

  // License cancellation: 5 requests per hour
  licenseCancellation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "@upstash/license-cancellation",
    analytics: true,
    ephemeralCache: cache,
  }),

  // Password set: 5 requests per minute
  passwordSet: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "@upstash/password-set",
    analytics: true,
    ephemeralCache: cache,
  }),

  // Password login: 5 requests per minute
  passwordLogin: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "@upstash/password-login",
    analytics: true,
    ephemeralCache: cache,
  }),

  // Password reset: 3 requests per minute
  passwordReset: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    prefix: "@upstash/password-reset",
    analytics: true,
    ephemeralCache: cache,
  }),

  // Contact form: 5 requests per hour per IP
  contactForm: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "@upstash/contact-form",
    analytics: true,
    ephemeralCache: cache,
  }),

  // Download form: 5 requests per hour per IP
  downloadForm: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "@upstash/download-form",
    analytics: true,
    ephemeralCache: cache,
  }),

  // Direct download: 10 requests per hour per IP (for GET endpoint)
  directDownload: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "@upstash/direct-download",
    analytics: true,
    ephemeralCache: cache,
  }),

  // Onboarding submission: 5 requests per hour per hardware ID
  onboardingSubmission: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "@upstash/onboarding-submission",
    analytics: true,
    ephemeralCache: cache,
  }),
};

// Rate limit middleware
export async function rateLimit(limiter, identifier) {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  if (!success) {
    throw new Error(
      JSON.stringify({
        error: "Too many requests",
        limit,
        remaining,
        formattedReset: formatTimeRemaining(reset),
        reset,
        status: 429,
      })
    );
  }

  return { limit, remaining, reset };
}

// Helper function to format time duration
function formatTimeRemaining(milliseconds) {
  // Get current timestamp
  const now = Date.now();
  // Calculate remaining time in ms
  const remainingMs = milliseconds - now;

  if (remainingMs < 60000) {
    // 60 * 1000 = 1 minute
    // less than 1 minute
    return `${Math.ceil(remainingMs / 1000)} seconds`;
  } else if (remainingMs < 3600000) {
    // 60 * 60 * 1000 = 1 hour
    // less than 1 hour
    return `${Math.ceil(remainingMs / 60000)} minutes`;
  } else if (remainingMs < 86400000) {
    // 24 * 60 * 60 * 1000 = 1 day
    // less than 1 day
    return `${Math.ceil(remainingMs / 3600000)} hours`;
  } else {
    // Format as date and time
    const date = new Date(milliseconds);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
}
