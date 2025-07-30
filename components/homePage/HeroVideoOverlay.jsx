"use client";

import { useState } from "react";
import VideoModal from "../modals/VideoModal";

export default function HeroVideoOverlay() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Dark overlay and play button */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/10 transition-all duration-300 hover:from-black/10 hover:to-black/20 cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`relative flex items-center justify-center h-16 w-16 rounded-full bg-white backdrop-blur-sm transition-all duration-300 transform
              ${isHovered ? "scale-110 bg-white" : "scale-100"}
              group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]`}
          >
            <div
              className={`w-0 rounded-sm h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-primary border-b-[12px] border-b-transparent ml-1 transition-transform duration-300
                ${isHovered ? "scale-110" : "scale-100"}`}
            />
          </div>
        </div>
      </div>

      <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
