/**
 * Configurable contact page component
 * Handles contact form submission with customizable UI and validation
 */

"use client";

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MailIcon,
  SendIcon,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import PageHeader from "@/components/PageHeader";

export default function ContactPage({ config = {} }) {
  const {
    // Configuration
    apiEndpoint = "/api/contact",
    
    // Content configuration
    content = {},
    
    // Validation schema
    validationSchema = getDefaultContactSchema(),
    
    // Form configuration
    form = {},
    
    // UI customization
    ui = {},
    
    // Custom hooks
    onFormSubmit = async (formData) => formData,
    onSubmitSuccess = async (response, formData) => {},
    onSubmitError = async (error, formData) => {},
    
    // Logging
    logging = true,
  } = config;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(form.defaultMarketingConsent ?? true);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const formData = { email, message, marketingConsent };
      
      // Allow pre-processing of form data
      const processedData = await onFormSubmit(formData);

      // Validate form data
      validationSchema.parse(processedData);

      if (logging) {
        console.log(`[ContactPage] Submitting contact form for ${email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setEmail("");
      setMessage("");
      setMarketingConsent(form.defaultMarketingConsent ?? false);

      // Custom success hook
      await onSubmitSuccess(data, formData);

      if (logging) {
        console.log(`[ContactPage] Contact form submitted successfully`);
      }

    } catch (error) {
      setStatus("error");
      const errorMsg = error instanceof z.ZodError ? error.errors[0].message : error.message;
      setErrorMessage(errorMsg);

      // Custom error hook
      await onSubmitError(error, { email, message, marketingConsent });

      if (logging) {
        console.error(`[ContactPage] Contact form error:`, errorMsg);
      }
    }
  };

  return (
    <div className={ui.containerClassName || "min-h-screen flex flex-col bg-gray-50"}>
      {Header && <Header />}

      <main className={ui.mainClassName || "flex-1 flex flex-col"}>
        {PageHeader && (
          <PageHeader
            icon={MailIcon}
            headingSize={ui.headingSize || "text-4xl"}
            title={content.title || "Contact Us"}
            description={content.description || "Have a question or feedback? We'd love to hear from you. We typically respond within 12 hours."}
          />
        )}

        <div className={ui.formContainerClassName || "flex-1 max-w-xl mx-auto w-full px-4 py-8"}>
          <form onSubmit={handleSubmit} className={ui.formClassName || "space-y-6"}>
            {/* Email Field */}
            <div className={ui.fieldClassName || "space-y-1.5"}>
              <label
                htmlFor="email"
                className={ui.labelClassName || "text-sm font-medium text-gray-700"}
              >
                {content.emailLabel || "Email address"}
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={content.emailPlaceholder || "you@example.com"}
                required
                disabled={status === "loading"}
                className={ui.inputClassName || "w-full bg-white"}
              />
            </div>

            {/* Message Field */}
            <div className={ui.fieldClassName || "space-y-1.5"}>
              <label
                htmlFor="message"
                className={ui.labelClassName || "text-sm font-medium text-gray-700"}
              >
                {content.messageLabel || "Message"}
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={form.messageRows || 4}
                placeholder={content.messagePlaceholder || "Your message here..."}
                required
                disabled={status === "loading"}
                className={ui.textareaClassName || "w-full resize-none bg-white"}
              />
            </div>

            {/* Error State */}
            {status === "error" && (
              <div className={ui.errorClassName || "rounded-md bg-red-50 p-2.5 text-sm text-red-500 flex items-start gap-2"}>
                <XCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <span>{errorMessage || content.errorMessage || "Something went wrong"}</span>
              </div>
            )}

            {/* Success State */}
            {status === "success" && (
              <div className={ui.successClassName || "rounded-md bg-green-50 p-2.5 text-sm text-green-600 flex items-start gap-2"}>
                <CheckCircle2 className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <span>
                  {content.successMessage || "Your message has been sent successfully. We'll get back to you soon."}
                </span>
              </div>
            )}

            {/* Marketing Consent and Submit */}
            <div className={ui.submitSectionClassName || "flex flex-col items-start gap-2"}>
              {form.showMarketingConsent !== false && (
                <div className={ui.checkboxContainerClassName || "flex items-center gap-2"}>
                  <Checkbox
                    id="marketing-consent"
                    checked={marketingConsent}
                    onCheckedChange={setMarketingConsent}
                    disabled={status === "loading"}
                  />
                  <label
                    htmlFor="marketing-consent"
                    className={ui.checkboxLabelClassName || "text-sm text-gray-500 cursor-pointer"}
                  >
                    {content.marketingConsentLabel || "Send me occasional emails about new features and special offers"}
                  </label>
                </div>
              )}

              <Button
                type="submit"
                disabled={status === "loading"}
                className={ui.submitButtonClassName || "w-full bg-primary hover:bg-primary/90"}
                size={ui.submitButtonSize || "default"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {content.sendingText || "Sending..."}
                  </>
                ) : (
                  <>
                    <SendIcon className="mr-2 h-4 w-4" />
                    {content.submitText || "Send Message"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {SiteFooter && <SiteFooter />}
    </div>
  );
}

/**
 * Default validation schema for contact form
 */
function getDefaultContactSchema() {
  return z.object({
    email: z.string().email("Please enter a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters long"),
    marketingConsent: z.boolean().default(false),
  });
}

/**
 * Default configuration for ContactPage
 */
export const defaultContactPageConfig = {
  apiEndpoint: "/api/contact",
  content: {
    title: "Contact Us",
    description: "Have a question or feedback? We'd love to hear from you. We typically respond within 12 hours.",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    messageLabel: "Message",
    messagePlaceholder: "Your message here...",
    marketingConsentLabel: "Send me occasional emails about new features and special offers",
    submitText: "Send Message",
    sendingText: "Sending...",
    successMessage: "Your message has been sent successfully. We'll get back to you soon.",
    errorMessage: "Something went wrong",
  },
  form: {
    messageRows: 4,
    defaultMarketingConsent: true,
    showMarketingConsent: true,
  },
  ui: {
    headingSize: "text-4xl",
  },
  validationSchema: getDefaultContactSchema(),
  logging: true,
};