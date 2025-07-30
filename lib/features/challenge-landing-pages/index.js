/**
 * Index file for challenge landing pages
 * Exports all challenge landing page data keyed by challenge ID
 */
import { CHALLENGES } from "@/lib/features/feature-challenges.js";
import { landingPageData as adhdLandingPage } from "./adhd.js";
import { landingPageData as procrastinationLandingPage } from "./procrastination.js";

// Map of challenge IDs to their landing page data
export const challengeLandingPages = {
  [CHALLENGES.ADHD]: adhdLandingPage,
  [CHALLENGES.PROCRASTINATION]: procrastinationLandingPage,
  // Add more challenges as they are created
};

/**
 * Get landing page data for a specific challenge
 * @param {string} challengeId - The ID of the challenge
 * @returns {Object} Landing page data for the challenge
 */
export function getChallengeLandingPageData(challengeId) {
  return challengeLandingPages[challengeId] || null;
}
