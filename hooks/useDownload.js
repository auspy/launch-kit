import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  trackDownloadInitiated,
  trackDownloadCompleted,
  trackDownloadFailed,
  DownloadMethods,
  Locations,
  trackDownloadEmailSent,
} from "@/lib/tracking";

// Configuration for switching between download methods
const DOWNLOAD_METHOD = process.env.NEXT_PUBLIC_DOWNLOAD_METHOD || "direct"; // "direct" or "email"

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const downloadDirect = async (
    location = Locations.HEADER,
    fileType = "dmg"
  ) => {
    // Track download initiated
    trackDownloadInitiated(DownloadMethods.DIRECT, location, {
      file_type: fileType,
    });

    setIsDownloading(true);
    try {
      // Call our API to get the direct download URL
      const response = await fetch(`/api/download/file/${fileType}`, {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Download failed");
      }

      // Start download
      window.location.href = data.downloadUrl;

      // Track successful download
      trackDownloadCompleted(DownloadMethods.DIRECT, location, {
        file_type: fileType,
      });

      toast({
        title: "Download Started! 🎉",
        description: "Your download should begin automatically.",
      });

      return { success: true };
    } catch (error) {
      console.error("Download error:", error);

      // Track download failure
      trackDownloadFailed(DownloadMethods.DIRECT, location, error.message, {
        file_type: fileType,
      });

      toast({
        title: "Download Error",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsDownloading(false);
    }
  };

  // For future email-based download (if needed)
  const downloadWithEmail = async (
    email,
    consents,
    location = Locations.MODAL
  ) => {
    trackDownloadInitiated(DownloadMethods.EMAIL, location, {
      email_domain: email.split("@")[1],
      ...consents,
    });

    setIsDownloading(true);
    try {
      const response = await fetch("/api/download/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          ...consents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      // Track email sent (not success yet - success is when they click the email link)
      trackDownloadEmailSent(location, {
        email_domain: email.split("@")[1],
        ...consents,
      });

      toast({
        title: "Success! 🎉",
        description: "Check your email for the download link.",
      });

      return { success: true };
    } catch (error) {
      console.error("Email download error:", error);

      // Track download failure
      trackDownloadFailed(DownloadMethods.EMAIL, location, error.message, {
        email_domain: email.split("@")[1],
      });

      toast({
        title: "Something went wrong",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsDownloading(false);
    }
  };

  // Main download function that switches based on configuration
  const download = async (options = {}) => {
    const { location = Locations.HEADER, email, consents } = options;

    if (DOWNLOAD_METHOD === "email" && email) {
      return downloadWithEmail(email, consents, location);
    } else {
      return downloadDirect(location);
    }
  };

  return {
    download,
    downloadDirect,
    downloadWithEmail,
    isDownloading,
    downloadMethod: DOWNLOAD_METHOD,
  };
};
