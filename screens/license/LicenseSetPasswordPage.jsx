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
import Logo from "@/components/Logo";

export default function LicenseSetPasswordPage({ config = {} }) {
  const {
    // Content configuration
    content = {
      title: "Set Your Password",
      subtitle: "Set up your password to manage your license",
      cardTitle: "Create Password",
      cardDescription: "Enter your license key and email to set up your password",
      helpText: "Need help?",
      helpLinkText: "Contact Support",
      successButtonText: "Continue to Login",
      loginLinkText: "Already have a password? Login",
    },
    
    // Navigation paths
    navigation = {
      loginPath: "/license/login",
      contactPath: "/contact",
    },
    
    // API configuration
    api = {
      endpoint: "/api/license/password/set",
    },
    
    // Validation configuration
    validation = {
      passwordMinLength: 8,
      passwordMaxLength: 100,
      passwordMinLengthMessage: "Password must be at least 8 characters",
      passwordMaxLengthMessage: "Password is too long",
      passwordMismatchMessage: "Passwords do not match",
      allFieldsRequiredMessage: "All fields are required",
    },
    
    // UI customization
    ui = {
      brandName: "Your App",
    },
    
    // Customization hooks
    onPasswordSet = async (response, formData) => {},
    onValidationError = async (error, formData) => {},
    onError = async (error, formData) => {},
    
    // Additional components
    additionalContent = null,
    
    // Styling
    className = "",
    
    // Logging
    logging = false,
  } = config;

  const [formData, setFormData] = useState({
    licenseKey: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const passwordSchema = z
    .string()
    .min(validation.passwordMinLength, validation.passwordMinLengthMessage)
    .max(validation.passwordMaxLength, validation.passwordMaxLengthMessage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    if (logging) {
      console.log("🔐 [LICENSE_SET_PASSWORD] Form submission started");
    }

    try {
      const { licenseKey, email, password, confirmPassword } = formData;

      // Validate required fields
      if (!licenseKey || !email || !password || !confirmPassword) {
        throw new Error(validation.allFieldsRequiredMessage);
      }

      // Validate email
      z.string().email().parse(email);

      // Validate password
      passwordSchema.parse(password);

      // Check password match
      if (password !== confirmPassword) {
        throw new Error(validation.passwordMismatchMessage);
      }

      if (logging) {
        console.log("✅ [LICENSE_SET_PASSWORD] Validation passed, making API call");
      }

      const response = await fetch(api.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ licenseKey, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to set password");
      }

      setStatus("success");
      setMessage(data.message);
      
      await onPasswordSet(data, formData);

      if (logging) {
        console.log("✅ [LICENSE_SET_PASSWORD] Password set successfully");
      }
    } catch (error) {
      if (logging) {
        console.error("❌ [LICENSE_SET_PASSWORD] Error:", error.message);
      }
      
      setStatus("error");
      setMessage(error.message);
      
      if (error.message === validation.allFieldsRequiredMessage || 
          error.message === validation.passwordMismatchMessage ||
          error.message.includes('email') ||
          error.message.includes('Password')) {
        await onValidationError(error, formData);
      } else {
        await onError(error, formData);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
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
                  {status === "loading" ? "Setting up..." : "Set Password"}
                </Button>

                {status === "success" && (
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-blue-500/20 hover:bg-blue-50/30"
                  >
                    <Link href={navigation.loginPath}>{content.successButtonText}</Link>
                  </Button>
                )}

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