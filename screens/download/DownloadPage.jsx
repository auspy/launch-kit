/**
 * Configurable download page component
 * Handles secure download token verification and file downloads
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DownloadPage({ config = {} }) {
  const {
    // Configuration
    apiBaseUrl = '',
    logoComponent: Logo,
    
    // Analytics configuration
    analytics = {},
    
    // UI customization
    ui = {},
    
    // Navigation
    navigation = {},
    
    // Custom hooks
    onDownloadStart = async (tokenData) => {},
    onDownloadSuccess = async (tokenData) => {},
    onDownloadError = async (error, token) => {},
    onEmailStored = async (email, tokenData) => {},
    
    // Logging
    logging = true,
  } = config;

  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState("downloading"); // downloading, success, error
  const [downloadData, setDownloadData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const initiateDownload = async () => {
      try {
        const token = params.token;
        if (!token) {
          throw new Error("Invalid download link");
        }

        if (logging) {
          console.log(`[DownloadPage] Starting download process for token: ${token.substring(0, 8)}`);
        }

        // Track that user clicked email link
        if (analytics.trackDownloadEmailClicked) {
          analytics.trackDownloadEmailClicked(analytics.locations?.EMAIL || 'email', {
            token: token.substring(0, 8),
          });
        }

        // Verify token and get download info
        const response = await fetch(`${apiBaseUrl}/api/download/verify/${token}`, {
          method: "GET",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Invalid or expired download link");
        }

        setDownloadData(data);

        // Custom hook for download start
        await onDownloadStart(data);

        // Store download email for potential future attribution linking
        if (data.email && analytics.posthog) {
          if (logging) {
            console.log(`[DownloadPage] Storing download email for potential future linking: ${data.email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
          }

          // Store download email in localStorage for potential payment linking
          localStorage.setItem("fm_download_email", data.email);
          localStorage.setItem("fm_download_timestamp", new Date().toISOString());

          // Track download completion without identifying (stay anonymous)
          analytics.posthog.capture("download_email_verified", {
            email: data.email,
            email_domain: data.emailDomain,
            email_verified: true,
            verification_method: "email_link_click",
            source: "download_page",
            verified_at: new Date().toISOString(),
            consent_updates: data.consentUpdates,
          });

          // Custom hook for email storage
          await onEmailStored(data.email, data);

          if (logging) {
            console.log(`[DownloadPage] Download email stored and event tracked (anonymous session maintained)`);
          }
        }

        // Start the actual download
        window.location.href = data.downloadUrl;

        // Track successful download from email
        if (analytics.trackDownloadCompleted) {
          analytics.trackDownloadCompleted(
            analytics.downloadMethods?.EMAIL || 'email', 
            analytics.locations?.EMAIL || 'email',
            {
              email_domain: data.emailDomain,
              verified_download: true,
              email_verified: true,
              user_identified: !!data.email,
            }
          );
        }

        // Custom hook for download success
        await onDownloadSuccess(data);

        setStatus("success");
      } catch (error) {
        console.error("[DownloadPage] Download error:", error);
        setError(error.message);
        setStatus("error");

        // Track download error
        if (analytics.trackDownloadFailed) {
          analytics.trackDownloadFailed(
            analytics.downloadMethods?.EMAIL || 'email',
            analytics.locations?.EMAIL || 'email',
            error.message,
            {
              error_type: "token_verification",
            }
          );
        }

        // Custom hook for download error
        await onDownloadError(error, params.token);
      }
    };

    initiateDownload();
  }, [params.token]);

  // Downloading state
  if (status === "downloading") {
    return (
      <div className={ui.containerClassName || "w-screen min-h-screen bg-gradient-to-br bg-white flex items-center justify-center p-4"}>
        <div className={ui.cardClassName || "max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"}>
          <div className="mb-6">
            {Logo && <Logo className={ui.logoClassName || ""} />}
            <h1 className={ui.titleClassName || "text-2xl font-bold mt-4 text-gray-900 mb-2"}>
              {ui.downloadingTitle || "Starting Download..."}
            </h1>
            <p className={ui.descriptionClassName || "text-gray-600"}>
              {ui.downloadingDescription || "Your download should begin automatically. If it doesn't start, please wait a moment."}
            </p>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className={ui.spinnerClassName || "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"}></div>
          </div>

          <div className={ui.statusClassName || "text-sm text-gray-500"}>
            {ui.preparingMessage || "Preparing your download..."}
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className={ui.containerClassName || "w-screen min-h-screen bg-gradient-to-br bg-white flex items-center justify-center p-4"}>
        <div className={ui.cardClassName || "max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"}>
          <div className="mb-6">
            {Logo && <Logo className={ui.logoClassName || ""} />}
            <CheckCircle className={ui.successIconClassName || "w-16 mt-4 h-16 text-green-500 mx-auto mb-4"} />
            <h1 className={ui.titleClassName || "text-2xl font-bold text-gray-900 mb-2"}>
              {ui.successTitle || "Download Started! 🎉"}
            </h1>
            <p className={ui.descriptionClassName || "text-gray-600 mb-4"}>
              {ui.successDescription || "Your download is now starting. Check your Downloads folder."}
            </p>

            {downloadData?.fileName && (
              <p className={ui.fileNameClassName || "text-sm text-gray-500 mb-4"}>
                File: {downloadData.fileName}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => (window.location.href = downloadData?.downloadUrl)}
              className={ui.primaryButtonClassName || "w-full bg-blue-500 hover:bg-blue-600"}
            >
              <Download className="w-4 h-4 mr-2" />
              {ui.downloadAgainText || "Download Again"}
            </Button>

            {navigation.featuresPath && (
              <Button
                variant="outline"
                onClick={() => router.push(navigation.featuresPath)}
                className={ui.secondaryButtonClassName || "w-full"}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {ui.featuresButtonText || "Checkout All Features"}
              </Button>
            )}
          </div>

          <div className={ui.nextStepsClassName || "mt-6 p-4 bg-blue-50 rounded-lg"}>
            <p className={ui.nextStepsTextClassName || "text-sm text-blue-800"}>
              <strong>{ui.nextStepsLabel || "Next steps:"}</strong> {ui.nextStepsDescription || "Open the downloaded file and follow the installation instructions."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className={ui.containerClassName || "w-screen min-h-screen bg-gradient-to-br bg-white flex items-center justify-center p-4"}>
        <div className={ui.cardClassName || "max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"}>
          <div className="mb-6">
            {Logo && <Logo className={ui.logoClassName || ""} />}
            <div className={ui.errorIconClassName || "w-16 mt-4 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"}>
              <ExternalLink className="w-8 h-8 text-red-500" />
            </div>
            <h1 className={ui.titleClassName || "text-2xl font-bold text-gray-900 mb-2"}>
              {ui.errorTitle || "Download Error"}
            </h1>
            <p className={ui.descriptionClassName || "text-gray-600 mb-4"}>{error}</p>
          </div>

          <div className="space-y-3">
            {navigation.downloadPath && (
              <Button
                onClick={() => router.push(navigation.downloadPath)}
                className={ui.primaryButtonClassName || "w-full bg-blue-500 hover:bg-blue-600"}
              >
                <Download className="w-4 h-4 mr-2" />
                {ui.newDownloadText || "Get New Download Link"}
              </Button>
            )}

            {navigation.contactPath && (
              <Button
                variant="outline"
                onClick={() => router.push(navigation.contactPath)}
                className={ui.secondaryButtonClassName || "w-full"}
              >
                {ui.contactSupportText || "Contact Support"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Default configuration for DownloadPage
 */
export const defaultDownloadPageConfig = {
  apiBaseUrl: '',
  analytics: {
    // Will be populated with actual analytics functions
  },
  ui: {
    downloadingTitle: "Starting Download...",
    downloadingDescription: "Your download should begin automatically. If it doesn't start, please wait a moment.",
    preparingMessage: "Preparing your download...",
    successTitle: "Download Started! 🎉",
    successDescription: "Your download is now starting. Check your Downloads folder.",
    downloadAgainText: "Download Again",
    featuresButtonText: "Checkout All Features",
    nextStepsLabel: "Next steps:",
    nextStepsDescription: "Open the downloaded file and follow the installation instructions.",
    errorTitle: "Download Error",
    newDownloadText: "Get New Download Link",
    contactSupportText: "Contact Support",
  },
  navigation: {
    featuresPath: "/features",
    downloadPath: "/download",
    contactPath: "/contact",
  },
  logging: true,
};