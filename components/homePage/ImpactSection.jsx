"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "../ui/badge";

export default function ImpactSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  // Impact steps that user scrolls through
  const steps = [
    {
      badge: "Impact",
      mainStat: "1h 11m",
      subtitle: "saved daily",
      description: "Average time reclaimed per day",
      methodology: "",
      dataPoint: "* Calculated using initial users tracked over 6 months",
    },
    {
      badge: "Impact",
      mainStat: "2 Months",
      subtitle: "saved every year",
      description: "That's 54 full work days back",
      methodology: "",
      // "1h 11m daily × 365 days = 432 hours annually / 8 hours per day = 54 days",
      dataPoint: "* 1h 11m × 365 days = 432 hours / 8-hour workdays = 54 days",
    },
    // {
    //   badge: "Impact",
    //   mainStat: "67%",
    //   subtitle: "of lost time reclaimed",
    //   description: "Of distracted hours recovered",
    //   methodology:
    //     "Calculated based on distracted hours before and after using Focusmo",
    //   dataPoint: "",
    // },
    {
      badge: "Impact",
      mainStat: "6+ Years",
      subtitle: "of work life reclaimed",
      description: "Over a 40-year career",
      methodology: "",
      dataPoint:
        "* 432 hours annually × 40-year career ÷ 8-hour workdays = 6+ years",
    },
    {},
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;

      if (containerTop <= 0 && containerBottom > windowHeight) {
        const scrolledDistance = Math.abs(containerTop);
        const totalScrollDistance = containerRect.height - windowHeight;
        const scrollProgress = Math.min(
          scrolledDistance / totalScrollDistance,
          1
        );
        setProgress(scrollProgress);

        const stepProgress = scrollProgress * (steps.length - 1);
        const newStep = Math.min(Math.floor(stepProgress), steps.length - 1);
        setCurrentStep(newStep);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps.length]);

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <section className="w-screen pb-3 ">
      <div className=" w-screen">
        <div
          ref={containerRef}
          className="relative bg-gray-50 border -z-10 border-gray-100"
          style={{ height: "400vh" }}
        >
          <div className="sticky top-0  w-full h-screen flex items-center justify-center">
            {/* Main Content Container - matching your design system */}
            <div className="   rounded-3xl py-16 md:py-24 relative overflow-hidden w-full">
              {/* Subtle background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-gray-100/30 pointer-events-none" />

              <div className="relative z-10 text-center max-w-5xl mx-auto">
                {/* Badge */}
                <Badge variant="outline" className="mb-8 ">
                  {currentStepData.badge}
                </Badge>

                {/* Header with gradient - your brand colors */}
                <div className="mb-16">
                  <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 leading-tight text-gray-700">
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                      Average time saved
                    </span>
                    <br />
                    <span className="text-gray-600">thanks to Focusmo</span>
                  </h1>
                </div>

                {/* Massive 3D Numbers */}
                <div className="mb-12 sm:h-[40vh] flex flex-col items-center justify-center">
                  <div
                    className="text-[4rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-bold leading-none tracking-tighter transition-all duration-1000 relative text-center"
                    style={{
                      background:
                        "linear-gradient(180deg, #1e40af 0%, #3b82f6 40%, #60a5fa 70%, #93c5fd 90%, #dbeafe 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter:
                        "drop-shadow(0 -5px 20px rgba(59, 130, 246, 0.4)) drop-shadow(0 8px 32px rgba(59, 130, 246, 0.2))",
                    }}
                  >
                    {currentStepData.mainStat}
                  </div>

                  {/* Subtitle */}
                  <div className="text-2xl md:text-3xl lg:text-4xl text-gray-600 font-semibold leading-tight">
                    {currentStepData.subtitle}
                  </div>
                </div>

                {/* Description */}
                {/* <div className="text-lg md:text-xl text-gray-500 mb-16 font-medium max-w-2xl mx-auto">
                  {currentStepData.description}
                </div> */}

                {/* Methodology Footer */}
                <div className=" w-full max-w-4xl mx-auto">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-400 font-medium">
                      * {currentStepData.methodology}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {currentStepData.dataPoint}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
