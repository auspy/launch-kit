"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth.context";
import { usePostHog } from "posthog-js/react";
import FirebaseAuthButtons from "@/components/auth/FirebaseAuthButtons";
import EmailLinkAuth from "@/components/auth/EmailLinkAuth";
import Logo from "@/components/Logo";

function LoginContent({ config = {} }) {
  const {
    // Content configuration
    content = {
      title: "Welcome Back",
      titleSignUp: "Create Account",
      subtitle: "Sign in to manage your license",
      subtitleSignUp: "Create an account to access your license",
      cardTitle: "Sign In",
      cardTitleSignUp: "Sign Up",
      cardDescription: "Access your account with the email from your license",
      cardDescriptionSignUp: "Use your license email to create an account",
      deviceConnectedMessage: "Connected from your app",
      helpText: "Need help?",
      helpLinkText: "Contact Support",
      toggleSignInText: "Already have an account? Sign in",
      toggleSignUpText: "New to {brandName}? Create account",
    },
    
    // Navigation paths
    navigation = {
      dashboardPath: "/license/dashboard",
      contactPath: "/contact",
      setPasswordPath: "/license/set-password",
      resetPasswordPath: "/license/reset-password",
    },
    
    // UI customization
    ui = {
      brandName: "Your App",
      showDeviceId: false,
      enableTraditionalLogin: false,
      showFirebaseAuth: true,
      showEmailLinkAuth: true,
      showModeToggle: true,
    },
    
    // Features
    features = {
      deviceAttribution: true,
      postHogTracking: true,
    },
    
    // Customization hooks
    onLoginSuccess = async (user) => {},
    onLoginError = async (error) => {},
    onModeToggle = async (isSignUpMode) => {},
    
    // Additional components
    additionalContent = null,
    
    // Styling
    className = "",
    
    // Development settings
    isDev = process.env.NODE_ENV === 'development',
    
    // Logging
    logging = false,
  } = config;

  const { login, user, error, clearError } = useAuth();
  const posthog = usePostHog();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    licenseKey: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");
  const [deviceId, setDeviceId] = useState(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Get device_id for UI display and form submission
  useEffect(() => {
    if (!features.deviceAttribution) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const deviceIdFromUrl = urlParams.get("device_id");
    const storedDeviceId = localStorage.getItem("fm_device");

    const finalDeviceId = deviceIdFromUrl || storedDeviceId;
    if (finalDeviceId) {
      setDeviceId(finalDeviceId);
      if (logging) {
        console.log("📱 [LICENSE_LOGIN] Device ID detected:", finalDeviceId);
      }
    }
  }, [features.deviceAttribution, logging]);

  // Clear local form errors when context error changes
  useEffect(() => {
    if (error) {
      setStatus("idle");
      setMessage("");
    }
  }, [error]);

  // Clear context errors when local form error changes
  useEffect(() => {
    if (message && clearError) {
      clearError();
    }
  }, [message, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ui.enableTraditionalLogin) return;
    
    setStatus("loading");

    if (logging) {
      console.log("🚀 [LICENSE_LOGIN] Form submission started");
    }

    try {
      const { email, password, licenseKey } = formData;

      // Validate required fields
      if (!email || !password || !licenseKey) {
        throw new Error("All fields are required");
      }

      // Validate email
      z.string().email().parse(email);

      if (logging) {
        console.log("🔗 [LICENSE_LOGIN] Calling login function");
      }

      // Pass device_id to login for PostHog attribution
      await login(email, password, licenseKey, deviceId);
      setStatus("success");
      setMessage("Login successful");

      await onLoginSuccess(user);

      if (logging) {
        console.log("✅ [LICENSE_LOGIN] Login completed successfully");
      }

      // Redirect to dashboard
      window.location.href = navigation.dashboardPath;
    } catch (error) {
      if (logging) {
        console.error("❌ [LICENSE_LOGIN] Login failed:", error.message);
      }
      
      setStatus("error");
      setMessage(error.message);
      await onLoginError(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeToggle = () => {
    const newMode = !isSignUpMode;
    setIsSignUpMode(newMode);
    onModeToggle(newMode);
  };

  const handleFirebaseSuccess = async () => {
    await onLoginSuccess(user);
    window.location.href = navigation.dashboardPath;
  };

  const handleFirebaseError = async (error) => {
    setStatus("error");
    setMessage(error);
    if (clearError) clearError();
    await onLoginError(new Error(error));
  };

  return (
    <div className={`min-h-screen min-w-screen w-full bg-background flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center flex flex-col items-center">
          {Logo && <Logo />}
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            {isSignUpMode ? content.titleSignUp : content.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUpMode ? content.subtitleSignUp : content.subtitle}
            {deviceId && ui.showDeviceId && isDev && (
              <span className="block text-xs text-blue-600 mt-1">
                {content.deviceConnectedMessage}
              </span>
            )}
          </p>
        </div>

        <Card className="border bg-card text-card-foreground shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isSignUpMode ? content.cardTitleSignUp : content.cardTitle}
            </CardTitle>
            <CardDescription>
              {isSignUpMode ? content.cardDescriptionSignUp : content.cardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Show authentication errors from context or local form errors */}
            {(error || message) && (
              <Alert
                variant="destructive"
                className="mb-4 bg-red-50 border-red-200 text-red-800"
              >
                <AlertDescription>
                  <strong>Authentication Error:</strong>
                  <br />
                  {error && error.includes("No active license found") ? (
                    <>
                      No active license found for this email address. Please
                      make sure you're using the same email address you used to
                      purchase your license.
                    </>
                  ) : (
                    error || message
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {/* Firebase Auth Buttons */}
              {ui.showFirebaseAuth && (
                <FirebaseAuthButtons
                  disabled={status === "loading"}
                  mode={isSignUpMode ? "signup" : "signin"}
                  onSuccess={handleFirebaseSuccess}
                  onError={handleFirebaseError}
                />
              )}

              {/* Divider */}
              {(ui.showFirebaseAuth && (ui.showEmailLinkAuth || ui.enableTraditionalLogin)) && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>
              )}

              {/* Email Magic Link Authentication */}
              {ui.showEmailLinkAuth && (
                <EmailLinkAuth
                  disabled={status === "loading"}
                  mode={isSignUpMode ? "signup" : "signin"}
                />
              )}

              {/* Traditional Email/Password Form */}
              {ui.enableTraditionalLogin && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === "loading"}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      name="licenseKey"
                      placeholder="License Key"
                      value={formData.licenseKey}
                      onChange={handleChange}
                      disabled={status === "loading"}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={status === "loading"}
                      className="w-full"
                    />
                  </div>

                  {message && (
                    <Alert
                      variant={status === "error" ? "destructive" : "default"}
                      className={
                        status === "error"
                          ? "bg-red-50 border-red-200 text-red-800"
                          : "bg-blue-50/30 border-blue-500/20 text-blue-600"
                      }
                    >
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col space-y-4">
                    <Button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {status === "loading" ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="flex flex-col space-y-2 text-center text-sm">
                      <div>
                        First time?{" "}
                        <Link
                          href={navigation.setPasswordPath}
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          Set up your password
                        </Link>
                      </div>
                      <Link
                        href={navigation.resetPasswordPath}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Additional content */}
            {additionalContent}
          </CardContent>
          
          {ui.showModeToggle && (
            <CardFooter className="flex justify-center">
              <button
                type="button"
                onClick={handleModeToggle}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUpMode
                  ? content.toggleSignInText
                  : content.toggleSignUpText.replace('{brandName}', ui.brandName)}
              </button>
            </CardFooter>
          )}
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          {content.helpText}{" "}
          <a
            href={navigation.contactPath}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {content.helpLinkText}
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LicenseLoginPage({ config = {} }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent config={config} />
    </Suspense>
  );
}