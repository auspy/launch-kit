"use client";

import { useState } from "react";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";

export default function EmailLinkAuth({ disabled = false, mode = "signin" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSendLink = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      // Validate email
      z.string().email().parse(email);

      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: `${
          window.location.origin
        }/license/login?email=${encodeURIComponent(email)}`,
        // This must be true.
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      // Save email in localStorage so we can retrieve it when user clicks the link
      localStorage.setItem("emailForSignIn", email);

      setStatus("success");
      setMessage(
        `Magic link sent to ${email}! Check your inbox and click the link to ${
          mode === "signup" ? "create your account" : "sign in"
        }.`
      );

      console.log("🔗 [EMAIL LINK] Magic link sent successfully to:", email);
    } catch (error) {
      console.error("❌ [EMAIL LINK] Failed to send magic link:", error);
      setStatus("error");

      if (error instanceof z.ZodError) {
        setMessage("Please enter a valid email address");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Please enter a valid email address");
      } else if (error.code === "auth/user-not-found") {
        setMessage("No account found with this email address");
      } else {
        setMessage("Failed to send magic link. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSendLink} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder={
              mode === "signup"
                ? "Enter your license email"
                : "Enter your email"
            }
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus("idle");
              setMessage("");
            }}
            disabled={disabled || status === "loading"}
            className="w-full"
            required
          />
        </div>

        {message && (
          <Alert
            variant={status === "error" ? "destructive" : "default"}
            className={
              status === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : status === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-blue-50/30 border-blue-500/20 text-blue-600"
            }
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={disabled || status === "loading" || !email}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {status === "loading"
            ? "Sending Link..."
            : mode === "signup"
            ? "Send Sign-up Link"
            : "Send Magic Link"}
        </Button>
      </form>

      {status === "success" && (
        <div className="text-sm text-muted-foreground text-center">
          <p>Didn't receive the email?</p>
          <button
            onClick={() => {
              setStatus("idle");
              setMessage("");
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
