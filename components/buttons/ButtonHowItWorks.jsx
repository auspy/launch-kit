"use client";

import { useState } from "react";
import VideoModal from "../modals/VideoModal";

export default function ButtonHowItWorks({ className = "" }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsVideoModalOpen(true)}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-all px-4 py-3 text-sm font-medium ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
        </svg>
        See it in action
      </button>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </>
  );
}
