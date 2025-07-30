"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function BotImage({ children, darkChildren }) {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".hero-section");
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setIsVisible(rect.bottom > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  const handleClick = () => {
    const url = process.env.NEXT_PUBLIC_VIZOLV_EXTENSION_URL;
    if (!url) return;
    window.open(url, "_blank");
  };

  return (
    <div
      className="relative rounded-[10px] overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {theme === "dark" ? darkChildren : children}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white flex-col gap-3 text-center z-10">
          <Image src={"/logo.png"} alt="download" width={45} height={45} />
          <div className="flex flex-row gap-2 items-center">
            <p className="text-white font-semibold text-lg text-center">
              Download Extension
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
