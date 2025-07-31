"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

function PaymentStatusContent({ config = {} }) {
  const {
    
    // Content configuration
    content = {
      loadingTitle: "Processing Payment...",
      loadingDescription: "Please wait while we verify your payment",
      successTitle: "Payment Successful!",
      successDescription: "Your license has been created and sent to your email",
      failedTitle: "Payment Failed",
      failedDescription: "There was an issue processing your payment",
      errorTitle: "Something went wrong",
      errorDescription: "We encountered an error while processing your request",
      licenseKeyLabel: "Your License Key:",
      nextStepsTitle: "What's Next?",
      helpText: "Need help?",
      helpLinkText: "Contact Support",
    },
    
    // Navigation paths
    navigation = {
      downloadPath: "/download",
      loginPath: "/license/login",
      recoveryPath: "/get-license-key",
      contactPath: "/contact",
      pricingPath: "/pricing",
    },
    
    // API configuration
    api = {
      endpoint: "/api/payment-status",
    },
    
    // UI customization
    ui = {
      brandName: "Your App",
      showLicenseKey: true,
      showNextSteps: true,
      autoRefreshOnFailed: true,
      refreshInterval: 5000, // 5 seconds
      maxRefreshAttempts: 12, // 1 minute total
    },
    
    // Next steps configuration
    nextSteps = [
      {
        title: "Download the App",
        description: "Get started by downloading and installing the application",
        action: { type: "link", href: "/download", text: "Download Now" },
      },
      {
        title: "Set Up Your Account",
        description: "Create a password to manage your license online",
        action: { type: "link", href: "/license/login", text: "Set Up Account" },
      },
    ],
    
    // Customization hooks
    onPaymentVerified = async (paymentData) => {},
    onPaymentFailed = async (error) => {},
    onError = async (error) => {},
    
    // Additional components
    additionalContent = null,
    
    // Styling
    className = "",
    
    // Logging
    logging = false,
  } = config;

  const [status, setStatus] = useState("loading"); // loading, success, failed, error
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshAttempts, setRefreshAttempts] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParams = Object.fromEntries(urlParams.entries());
    
    if (logging) {
      console.log("💳 [PAYMENT_STATUS] Processing payment with params:", queryParams);
    }
    
    verifyPayment(queryParams);
  }, []);

  const verifyPayment = async (params) => {
    try {
      if (logging) {
        console.log("🔍 [PAYMENT_STATUS] Verifying payment");
      }

      const response = await fetch(api.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Payment verification failed");
      }

      if (data.status === "success" && data.license) {
        setStatus("success");
        setPaymentData(data);
        await onPaymentVerified(data);
        
        if (logging) {
          console.log("✅ [PAYMENT_STATUS] Payment verified successfully");
        }
      } else if (data.status === "pending" || data.status === "processing") {
        // Payment is still processing
        if (ui.autoRefreshOnFailed && refreshAttempts < ui.maxRefreshAttempts) {
          if (logging) {
            console.log(`⏳ [PAYMENT_STATUS] Payment still processing, retry ${refreshAttempts + 1}/${ui.maxRefreshAttempts}`);
          }
          
          setTimeout(() => {
            setRefreshAttempts(prev => prev + 1);
            verifyPayment(params);
          }, ui.refreshInterval);
        } else {
          setStatus("failed");
          setError("Payment is taking longer than expected. Please check back later or contact support.");
          await onPaymentFailed(new Error("Payment timeout"));
        }
      } else {
        setStatus("failed");
        setError(data.message || "Payment could not be verified");
        await onPaymentFailed(new Error(data.message || "Payment verification failed"));
      }
    } catch (err) {
      if (logging) {
        console.error("❌ [PAYMENT_STATUS] Error verifying payment:", err);
      }
      
      setStatus("error");
      setError(err.message);
      await onError(err);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />;
      case "success":
        return <CheckCircle2 className="h-12 w-12 text-green-600" />;
      case "failed":
        return <XCircle className="h-12 w-12 text-red-600" />;
      case "error":
        return <AlertTriangle className="h-12 w-12 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusContent = () => {
    switch (status) {
      case "loading":
        return {
          title: content.loadingTitle,
          description: content.loadingDescription,
        };
      case "success":
        return {
          title: content.successTitle,
          description: content.successDescription,
        };
      case "failed":
        return {
          title: content.failedTitle,
          description: error || content.failedDescription,
        };
      case "error":
        return {
          title: content.errorTitle,
          description: error || content.errorDescription,
        };
      default:
        return { title: "", description: "" };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className={`min-h-screen min-w-screen w-full bg-background flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center flex flex-col items-center">
          {Logo && <Logo />}
          <div className="mt-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              {getStatusIcon()}
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {statusContent.title}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {statusContent.description}
            </p>
          </div>
        </div>

        <Card className="border bg-card text-card-foreground shadow">
          <CardContent className="pt-6">
            {status === "success" && paymentData && (
              <div className="space-y-6">
                {/* License Key Display */}
                {ui.showLicenseKey && paymentData.license?.licenseKey && (
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {content.licenseKeyLabel}
                    </p>
                    <div className="bg-muted p-3 rounded-lg">
                      <code className="text-lg font-mono">
                        {paymentData.license.licenseKey}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Keep this license key safe - you'll need it to activate the app
                    </p>
                  </div>
                )}

                {/* Next Steps */}
                {ui.showNextSteps && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {content.nextStepsTitle}
                    </h3>
                    <div className="space-y-3">
                      {nextSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground">
                              {step.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                            {step.action && (
                              <div className="mt-2">
                                <Button
                                  asChild
                                  size="sm"
                                  variant={index === 0 ? "default" : "outline"}
                                >
                                  <Link href={step.action.href}>
                                    {step.action.text}
                                  </Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {status === "failed" && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error || "Your payment could not be processed. Please try again or contact support for assistance."}
                  </AlertDescription>
                </Alert>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={navigation.pricingPath}>Try Again</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href={navigation.contactPath}>Contact Support</Link>
                  </Button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {error || "An unexpected error occurred. Please contact support for assistance."}
                  </AlertDescription>
                </Alert>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={navigation.recoveryPath}>Recover License</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href={navigation.contactPath}>Contact Support</Link>
                  </Button>
                </div>
              </div>
            )}

            {status === "loading" && (
              <div className="text-center space-y-4">
                <div className="text-sm text-muted-foreground">
                  This may take a few moments...
                </div>
                {ui.autoRefreshOnFailed && refreshAttempts > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Attempt {refreshAttempts} of {ui.maxRefreshAttempts}
                  </div>
                )}
              </div>
            )}

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

export default function PaymentStatusPage({ config = {} }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentStatusContent config={config} />
    </Suspense>
  );
}