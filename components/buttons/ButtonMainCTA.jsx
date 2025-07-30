// Export the server component by default to prevent A/B test flicker
// Note: This will cause errors if imported in client components
// Use ButtonMainCTAClient or ButtonMainCTAUniversal in client components
export { default } from "./ButtonMainCTA.server";

// Export the client component for use in client components
export { default as ButtonMainCTAClient } from "./ButtonMainCTA.client";

// Export the universal component that works in both contexts
export { default as ButtonMainCTAUniversal } from "./ButtonMainCTA.universal";
