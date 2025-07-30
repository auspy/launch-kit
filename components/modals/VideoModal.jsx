"use client";

import { useState, useEffect } from "react";

export default function VideoModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  // Close modal when pressing escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Reset loading state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-5xl mx-4">
        <div className="aspect-video relative rounded-lg overflow-hidden">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-lg z-10 flex-col gap-2">
              <div className="relative w-6 h-6">
                <div className="w-6 h-6 rounded-full border-4 border-white/20"></div>
                <div className="absolute top-0 left-0 w-6 h-6 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
              <p className="text-white text-sm">Preparing Intro Video</p>
            </div>
          )}

          <iframe
            className="absolute inset-0 w-full h-full rounded-lg"
            src={process.env.NEXT_PUBLIC_HERO_VIDEO_SRC}
            title="How It Works - Focusmo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              // Add a small delay to ensure the video has initialized
              setTimeout(() => setIsLoading(false), 800);
            }}
          />
        </div>
      </div>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
