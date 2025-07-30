"use client";

import { createContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { MailIcon, DownloadIcon, CheckCircleIcon } from "lucide-react";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  trackDownloadInitiated,
  trackDownloadEmailSent,
  trackDownloadFailed,
  DownloadMethods,
  Locations,
} from "@/lib/tracking";
import ButtonMainCTAClient from "../buttons/ButtonMainCTA.client";

const emailSchema = z.string().email("Please enter a valid email address");

export default function DownloadModal({ open, onOpenChange }) {
  const [email, setEmail] = useState("");
  const [consentUpdates, setConsentUpdates] = useState(true);
  const [consentNewsletter, setConsentNewsletter] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDesktopAlert, setShowDesktopAlert] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate email with Zod
      emailSchema.parse(email);
    } catch (error) {
      // Track validation error
      console.log("❌ Email validation error:", error.errors[0].message);

      trackDownloadFailed(
        DownloadMethods.EMAIL,
        Locations.MODAL,
        error.errors[0].message,
        {
          form_type: "download_email",
          error_type: "validation",
        }
      );

      toast({
        title: "Invalid email",
        description: error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    trackDownloadInitiated(DownloadMethods.EMAIL, Locations.MODAL, {
      email_domain: email.split("@")[1], // Only track domain, not the full email
      consent_updates: consentUpdates,
      consent_newsletter: consentNewsletter,
    });

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          consentUpdates,
          consentNewsletter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      // Track successful download link sent (but don't identify yet)
      console.log("📈 Tracking download email sent event");
      trackDownloadEmailSent(Locations.MODAL, {
        email_domain: email.split("@")[1], // Only track domain, not the full email
        consent_updates: consentUpdates,
        consent_newsletter: consentNewsletter,
        email_verified: false, // Will be true when they click the email link
      });

      toast({
        title: "Success! 🎉",
        description: "Check your email for the download link.",
      });

      // Show desktop download alert after successful email send
      setShowDesktopAlert(true);

      // Reset form (but keep modal open to show the alert)
      setEmail("");
      setConsentUpdates(true);
      setConsentNewsletter(false);
      // Don't close modal immediately - let user see the alert
      // onOpenChange(false);
    } catch (error) {
      console.error("Submit error:", error);

      // Track submission error
      trackDownloadFailed(
        DownloadMethods.EMAIL,
        Locations.MODAL,
        error.message || "Unknown error",
        {
          form_type: "download_email",
          error_type: "submission",
          email_domain: email.split("@")[1],
        }
      );

      toast({
        title: "Something went wrong",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[85%] rounded-lg sm:max-w-[425px] border-blue-500">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            Download Focusmo
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Download link directly to your email. We bring lots of cool updates
            every other week, so opt in to stay up to date. No spam I promise.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              autoComplete="email"
              required
            />
          </div>
          <div className="grid gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="updates"
                checked={consentUpdates}
                onCheckedChange={setConsentUpdates}
                className="mt-1 data-[state=checked]:bg-[#F7B955] data-[state=checked]:border-[#F7B955]"
              />
              <label htmlFor="updates" className="text-sm leading-tight">
                <span className="font-medium text-gray-900">
                  Product Updates & Offers
                </span>
                <br />
                <span className="text-gray-500">
                  Get notified about new features and special deals
                </span>
              </label>
            </div>
            {/* <div className="flex items-start space-x-2">
              <Checkbox
                id="newsletter"
                checked={consentNewsletter}
                onCheckedChange={setConsentNewsletter}
                className="mt-1 data-[state=checked]:bg-[#F7B955] data-[state=checked]:border-[#F7B955]"
              />
              <label htmlFor="newsletter" className="text-sm leading-tight">
                <span className="font-medium text-gray-900">
                  Productivity Newsletter
                </span>
                <br />
                <span className="text-gray-500">
                  Weekly tips to boost your productivity and focus
                </span>
              </label>
            </div> */}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending Download Link..."
              ) : (
                <>
                  <MailIcon className="mr-2 h-4 w-4" />
                  Get Download Link
                </>
              )}
            </Button>
          </DialogFooter>

          {showDesktopAlert && (
            <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                {/* <div className="flex-shrink-0 mt-0.5">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div> */}
                <div className="flex-1 flex flex-col items-start min-w-0">
                  <p className="text-sm text-green-800 leading-relaxed">
                    <span className="font-medium">
                      Download link sent successfully!
                    </span>{" "}
                    If you're already on your desktop, you can directly dowload.{" "}
                  </p>
                  <ButtonMainCTAClient
                    as="link"
                    text="Direct Download"
                    type="download_link"
                    location={Locations.MODAL}
                    downloadMethod="direct"
                    className="font-semibold w-fit p-0 inline-block text-green-700 hover:text-green-900 underline underline-offset-2 decoration-2"
                  ></ButtonMainCTAClient>{" "}
                </div>
                {/* <button
                  type="button"
                  onClick={() => {
                    setShowDesktopAlert(false);
                    onOpenChange(false);
                  }}
                  className="flex-shrink-0 p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                  aria-label="Close alert"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button> */}
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

const DownloadContext = createContext(undefined);

const DownloadProvider = ({ children }) => {
  const [openDownloadModal, setOpenDownloadModal] = useState(false);

  return (
    <DownloadContext.Provider
      value={{ openDownloadModal, setOpenDownloadModal }}
    >
      <DownloadModal
        open={openDownloadModal}
        onOpenChange={setOpenDownloadModal}
      />
      {children}
    </DownloadContext.Provider>
  );
};

export { DownloadContext, DownloadProvider };
