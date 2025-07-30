"use client";

import { createContext, useContext } from "react";

const BootstrapContext = createContext({});

export function ClientBootstrapProvider({ children, bootstrap = {} }) {
  return (
    <BootstrapContext.Provider value={bootstrap}>
      {children}
    </BootstrapContext.Provider>
  );
}

export function useBootstrap() {
  return useContext(BootstrapContext);
}

/**
 * Hook to get CTA A/B test data from bootstrap
 */
export function useCTABootstrap() {
  const bootstrap = useBootstrap();
  const { featureFlags = {}, distinctID } = bootstrap;

  const ctaFlagData = featureFlags["cta_text_variant"];

  return {
    variant: ctaFlagData?.variant || "control",
    payload: ctaFlagData?.payload || {},
    distinctId: distinctID,
    allFlags: featureFlags,
  };
}
