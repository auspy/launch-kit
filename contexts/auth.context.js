"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { urlBase } from "@/constants";
import { usePostHog } from "posthog-js/react";
import { usePostHogService } from "@/lib/posthog-service";
import {
  onAuthStateChanged,
  signOut,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { auth } from "@/lib/firebase.config";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const posthog = usePostHog();
  const posthogService = usePostHogService(posthog);
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailLinkProcessing, setEmailLinkProcessing] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password, licenseKey, deviceId = null) => {
    console.log("🔑 [AUTH] Login attempt started:", {
      email: email.substring(0, 3) + "***", // Partial email for privacy
      hasLicenseKey: !!licenseKey,
      deviceId: deviceId || "none",
      hasPostHog: !!posthog,
    });

    try {
      const response = await fetch(urlBase + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, licenseKey }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        console.log("❌ [AUTH] Login failed:", data.error);
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      setUser(data.license);
      console.log("✅ [AUTH] Login successful, user set");

      // Use React hook-based PostHog service for identification
      const identificationResult = posthogService.identifyUser(email, deviceId);

      if (identificationResult?.success) {
        console.log(
          "✅ [AUTH] PostHog identification completed via React hook service"
        );
        console.log(
          "🔗 [AUTH] Linked anonymous ID:",
          identificationResult.linkedAnonymousId
        );
      } else {
        console.warn(
          "⚠️ [AUTH] PostHog identification failed:",
          identificationResult?.reason
        );
      }

      return data;
    } catch (e) {
      console.log("❌ [AUTH] Login error:", e.message);
      throw e;
    }
  };

  // New Firebase login method
  const loginWithFirebase = async (firebaseUser) => {
    console.log("🔥 [AUTH] Firebase login attempt started:", {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      provider: firebaseUser.providerData[0]?.providerId,
    });

    try {
      // Call server-side API to handle license lookup and linking
      const response = await fetch(urlBase + "/api/auth/firebase-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          providerId: firebaseUser.providerData[0]?.providerId,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        console.log("❌ [AUTH] Firebase login failed:", data.error);
        throw new Error(data.message || "Firebase login failed");
      }

      const data = await response.json();
      const license = data.license;

      // Set user state
      setUser(license);
      setFirebaseUser(firebaseUser);

      console.log("✅ [AUTH] Firebase login successful");

      // Use Firebase UID for PostHog identification
      const identificationResult = posthogService.identifyUser(
        firebaseUser.uid, // Use Firebase UID as distinct ID
        null, // No device ID needed for Firebase auth
        {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          auth_method: "firebase",
          provider: firebaseUser.providerData[0]?.providerId,
        }
      );

      if (identificationResult?.success) {
        console.log(
          "✅ [AUTH] PostHog identification with Firebase UID completed"
        );
      } else {
        console.warn(
          "⚠️ [AUTH] PostHog identification failed:",
          identificationResult?.reason
        );
      }

      return license;
    } catch (error) {
      console.error("❌ [AUTH] Firebase login failed:", error.message);
      // Set error state for UI display
      setError(error.message || "Authentication failed");
      throw error;
    }
  };

  const logout = async () => {
    console.log("🚪 [AUTH] Logout started:", {
      hasUser: !!user,
      hasFirebaseUser: !!firebaseUser,
      userAuthMethod: user?.authMethod,
    });

    try {
      // Always try to logout from Firebase if there's a firebase user
      if (firebaseUser) {
        console.log("🔥 [AUTH] Signing out from Firebase");
        await signOut(auth);
      }

      // Always call traditional logout API to clear any cookies
      // This ensures compatibility with both auth methods
      try {
        console.log("🍪 [AUTH] Clearing auth cookies");
        await fetch(urlBase + "/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (apiError) {
        // Don't fail the entire logout if API call fails
        console.warn("⚠️ [AUTH] Traditional logout API failed:", apiError);
      }

      // Clear local state
      setUser(null);
      setFirebaseUser(null);

      console.log("✅ [AUTH] Local state cleared");

      // Reset PostHog identification on logout using React hook service
      const resetResult = posthogService.resetUser();
      if (resetResult?.success) {
        console.log(
          "🔄 [AUTH] User logged out and PostHog reset via React hook service"
        );
      } else {
        console.warn("⚠️ [AUTH] PostHog reset failed:", resetResult?.reason);
      }

      console.log("✅ [AUTH] Logout completed successfully");
    } catch (error) {
      console.error("❌ [AUTH] Logout failed:", error);
      throw error;
    }
  };

  // New email link sign-in completion method
  const completeEmailLinkSignIn = async (email, emailLink) => {
    console.log("🔗 [AUTH] Email link sign-in completion started:", {
      email: email?.substring(0, 3) + "***",
      hasEmailLink: !!emailLink,
    });

    try {
      // Complete the sign-in with email link
      const result = await signInWithEmailLink(auth, email, emailLink);
      const firebaseUser = result.user;

      console.log("🔗 [AUTH] Email link sign-in successful:", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
      });

      // Use the same Firebase login flow as Google/Apple
      await loginWithFirebase(firebaseUser);

      return firebaseUser;
    } catch (error) {
      console.error("❌ [AUTH] Email link sign-in failed:", error);
      throw error;
    }
  };

  // Clear authentication error
  const clearError = () => {
    setError(null);
  };

  // Check if current URL is from email link and complete sign-in
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      isSignInWithEmailLink(auth, window.location.href) &&
      !emailLinkProcessing // Prevent multiple processing
    ) {
      console.log("🔗 [AUTH] Email link detected in URL");
      setEmailLinkProcessing(true); // Set flag to prevent re-processing
      setError(null); // Clear any previous errors

      // Get email from localStorage or prompt user
      let email = localStorage.getItem("emailForSignIn");

      if (!email) {
        // If email not in localStorage, try to get from URL params
        const urlParams = new URLSearchParams(window.location.search);
        email = urlParams.get("email");
      }

      if (!email) {
        // If still no email, prompt user (this shouldn't happen in normal flow)
        email = window.prompt("Please provide your email for confirmation");
      }

      if (email) {
        completeEmailLinkSignIn(email, window.location.href)
          .then(() => {
            // Clear the email from storage
            localStorage.removeItem("emailForSignIn");
            console.log("✅ [AUTH] Email link sign-in completed successfully");

            // Clean up URL by removing query parameters
            if (window.history.replaceState) {
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
              console.log(
                "🧹 [AUTH] URL cleaned up after email link processing"
              );
            }

            // Redirect to dashboard after successful sign-in
            setTimeout(() => {
              console.log("🚀 [AUTH] Redirecting to dashboard");
              if (typeof window !== "undefined") {
                window.location.href = "/license/dashboard";
              }
            }, 1500);
          })
          .catch((error) => {
            console.error(
              "❌ [AUTH] Email link sign-in completion failed:",
              error
            );

            // Set error state for UI display
            setError(error.message || "Email link sign-in failed");

            // Clean up URL even on error
            if (window.history.replaceState) {
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            }

            setEmailLinkProcessing(false); // Reset flag on error
          });
      } else {
        console.error("❌ [AUTH] No email found for email link verification");
        setError("No email found for verification");
        setEmailLinkProcessing(false); // Reset flag if no email
      }
    }
  }, [emailLinkProcessing]); // Add emailLinkProcessing as dependency

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("🔥 [AUTH] Firebase auth state changed:", {
        uid: firebaseUser?.uid,
        email: firebaseUser?.email,
      });

      setFirebaseUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        emailLinkProcessing,
        error,
        login,
        loginWithFirebase,
        completeEmailLinkSignIn,
        clearError,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
