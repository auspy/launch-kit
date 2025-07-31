"use client";

import { useState } from "react";
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
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import Logo from "@/components/Logo";

export default function LicenseRecoveryPage({ config = {} }) {
  const {
    // Content configuration
    content = {
      title: "Recover License Key",
      subtitle: "Enter your email to receive your license key",
      cardTitle: "License Recovery",
      cardDescription: "We'll send your license key to the email address you used to purchase",
      helpText: "Need help?",
      helpLinkText: "Contact Support",
      loginLinkText: "Remember your license key? Login",
      successTitle: "License Key Sent!",
      successDescription: "Check your email for your license key and login instructions.",
    },
    
    // Navigation paths
    navigation = {
      loginPath: "/license/login",
      contactPath: "/contact",
    },
    
    // API configuration
    api = {
      endpoint: "/api/license/recover",
    },
    
    // Validation configuration
    validation = {
      emailRequiredMessage: "Email address is required",
      emailInvalidMessage: "Please enter a valid email address",
    },
    
    // UI customization
    ui = {
      brandName: "Your App",
      showSuccessIcon: true,
    },
    
    // Customization hooks
    onLicenseRecovered = async (response, email) => {},
    onValidationError = async (error, email) => {},
    onError = async (error, email) => {},
    
    // Additional components
    additionalContent = null,
    
    // Styling
    className = "",
    
    // Logging
    logging = false,
  } = config;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    if (logging) {
      console.log("📧 [LICENSE_RECOVERY] Form submission started");
    }

    try {
      // Validate required field
      if (!email) {
        throw new Error(validation.emailRequiredMessage);
      }

      // Validate email format
      try {
        z.string().email(validation.emailInvalidMessage).parse(email);
      } catch (err) {
        throw new Error(validation.emailInvalidMessage);
      }

      if (logging) {
        console.log("✅ [LICENSE_RECOVERY] Validation passed, making API call");
      }

      const response = await fetch(api.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to recover license key");
      }

      setStatus("success");
      setMessage(data.message || "License key sent successfully!");
      
      await onLicenseRecovered(data, email);

      if (logging) {
        console.log("✅ [LICENSE_RECOVERY] License recovery email sent successfully");
      }
    } catch (error) {
      if (logging) {
        console.error("❌ [LICENSE_RECOVERY] Error:", error.message);
      }
      
      setStatus("error");
      setMessage(error.message);
      
      if (error.message === validation.emailRequiredMessage || 
          error.message === validation.emailInvalidMessage) {
        await onValidationError(error, email);
      } else {
        await onError(error, email);
      }
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  if (status === "success") {
    return (
      <div className={`min-h-screen min-w-screen w-full bg-background flex flex-col items-center justify-center p-4 ${className}`}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center flex flex-col items-center">
            {Logo && <Logo />}
            <div className="mt-6">
              {ui.showSuccessIcon && (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
              )}
              <h2 className="text-3xl font-bold text-foreground">
                {content.successTitle}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {content.successDescription}
              </p>
            </div>
          </div>

          <Card className="border bg-card text-card-foreground shadow">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We've sent your license key to:
                </p>
                <p className="font-medium text-foreground">
                  {email}
                </p>
                <p className="text-xs text-muted-foreground">
                  If you don't see the email in a few minutes, check your spam folder.
                </p>
                
                <div className="pt-4">
                  <Button
                    asChild
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Link href={navigation.loginPath}>Continue to Login</Link>
                  </Button>
                </div>
              </div>

              {/* Additional content */}
              {additionalContent}
            </CardContent>
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

  return (
    <div className={`min-h-screen min-w-screen w-full bg-background flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center flex flex-col items-center">
          {Logo && <Logo />}
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            {content.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {content.subtitle}
          </p>
        </div>

        <Card className="border bg-card text-card-foreground shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {content.cardTitle}
            </CardTitle>
            <CardDescription>
              {content.cardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  className="w-full"
                  autoComplete="email"
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
                  {status === "loading" ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send License Key"
                  )}
                </Button>

                <div className="text-center text-sm">
                  <Link
                    href={navigation.loginPath}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {content.loginLinkText}
                  </Link>
                </div>
              </div>
            </form>

            {/* Additional content */}
            {additionalContent}
          </CardContent>
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