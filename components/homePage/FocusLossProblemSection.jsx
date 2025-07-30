"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

// Progressive Time Visualization Graph Component
const TimeVisualizationGraph = ({ level }) => {
  const getGraphData = () => {
    switch (level) {
      case "day":
        return {
          title: "Daily Focus Loss",
          units: Array.from({ length: 8 }, (_, i) => ({
            label: `${i + 1}h`,
            lost: i < 2,
            productive: i >= 2,
          })),
          lostLabel: "2 hours lost",
          productiveLabel: "6 hours productive",
        };
      case "week":
        return {
          title: "Weekly Focus Loss (5-day workweek)",
          units: Array.from({ length: 5 }, (_, i) => ({
            label: ["Mon", "Tue", "Wed", "Thu", "Fri"][i],
            lost: i < 1.25,
            productive: i >= 1.25,
          })),
          lostLabel: "1.25 days lost",
          productiveLabel: "3.75 days productive",
        };
      case "year":
        return {
          title: "Yearly Focus Loss",
          units: Array.from({ length: 12 }, (_, i) => ({
            label: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ][i],
            lost: i < 3,
            productive: i >= 3,
          })),
          lostLabel: "3+ months lost",
          productiveLabel: "9 months productive",
        };
      case "lifetime":
        return {
          title: "Lifetime Focus Loss (40-year career)",
          units: Array.from({ length: 40 }, (_, i) => ({
            label: `${i + 1}`,
            lost: i < 10,
            productive: i >= 10,
          })),
          lostLabel: "10+ years lost",
          productiveLabel: "30 years productive",
        };
      default:
        return null;
    }
  };

  const data = getGraphData();
  if (!data) return null;

  // Stagger is shorter for lifetime so the whole sequence finishes sooner
  const STAGGER = level === "lifetime" ? 0.02 : 0.05; // seconds per bar
  // Every lifetime bar is also a bit quicker in-place
  const BASE_TIME = level === "lifetime" ? 0.15 : 0.4; // seconds per bar

  return (
    <div className="max-w-5xl w-full md:w-[60vw] mx-auto mb-16 transition-all duration-500">
      <div className="text-center mb-4 md:mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          {data.title}
        </h3>
      </div>

      {/* Graph visualization */}
      <div className="relative">
        {/* Time units */}
        <div
          className={cn(
            "flex items-end mb-4",
            level === "lifetime"
              ? "justify-center sm:justify-between"
              : "justify-between"
          )}
          style={{ minHeight: "120px" }}
        >
          {data.units.map((unit, index) => (
            <div
              key={`${level}-${index}`} // Unique key to force re-render
              className={cn(
                level === "lifetime"
                  ? "inline-block mx-[1px] md:mx-0.5 sm:flex-1" // fixed width on mobile, flex on ≥sm
                  : "flex-1 mx-0.5 sm:mx-1",
                unit.lost
                  ? "bg-gradient-to-t from-red-500 to-red-400"
                  : "bg-gradient-to-t from-blue-500 to-blue-400"
              )}
              style={{
                width: level === "lifetime" ? "6px" : undefined, // 10 px columns on mobile
                height: unit.lost ? "100px" : "80px",
                opacity: 0,
                animation: `fadeInUp ${BASE_TIME}s ease-out ${
                  index * STAGGER
                }s both`,
              }}
            />
          ))}
        </div>

        {/* Labels */}
        <div
          className={cn(
            "flex text-gray-600 mb-6 text-[10px] md:text-xs",
            level === "lifetime"
              ? "hidden sm:flex sm:justify-between"
              : "flex justify-between"
          )}
        >
          {data.units.map((unit, index) => (
            <div
              key={`${level}-label-${index}`} // Unique key to force re-render
              className="flex-1 text-center"
              style={{
                animation: `fadeInUp ${BASE_TIME}s ease-out ${
                  index * STAGGER + 0.2
                }s both`,
                opacity: 0,
              }}
            >
              {unit.label}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-8 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-t from-red-500 to-red-400 rounded"></div>
            <span className="text-gray-700">{data.lostLabel}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-blue-400 rounded"></div>
            <span className="text-gray-700">{data.productiveLabel}</span>
          </div>
        </div>

        {/* Research attribution */}
        <div className="text-center opacity-50">
          <p className="text-xs text-gray-500">
            * Based on{" "}
            <a
              href="https://impact.economist.com/new-globalisation/in-search-of-lost-focus-2023/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500  hover:text-blue-800  underline text-xs"
            >
              The Economist's "In Search of Lost Focus" study
            </a>{" "}
            and productivity research
          </p>
        </div>
      </div>
    </div>
  );
};

export default function FocusLossProblemSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef(null);
  const stickyRef = useRef(null);

  // Text content for each step
  const steps = [
    {
      staticText: "Distractions cost you more time than you think",
      subtext: "Scroll to see how much time you're actually losing...",
      isIntro: true,
      keywords: [
        "Distractions",
        "cost",
        "you",
        "more",
        "time",
        "than",
        "you",
        "think",
      ], // For progressive emphasis
    },
    {
      staticText: "On average we lose",
      amount: "2 of 8 work hrs",
      period: "a day to distractions,",
      colorIntensity: 0.3, // Darker Yellow
      graphLevel: "day",
    },
    {
      staticText: "which is",
      amount: (
        <>
          1.25 days
          <br />
        </>
      ),
      period: "within a work week,",
      colorIntensity: 0.5, // Orange
      graphLevel: "week",
    },
    {
      staticText: "",
      amount: "3+ months",
      period: "within a work year,",
      colorIntensity: 0.7, // Red
      graphLevel: "year",
    },
    {
      staticText: "and ",
      amount: "10+ years 🤯",
      period: "of your work life lost to distractions.",
      colorIntensity: 1.0, // Dark Red
      graphLevel: "lifetime",
    },
    {
      staticText: "It's time to fight back.",
      subtext:
        "Don't let distractions steal your career. Take control with Focusmo.",
      isOutro: true,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;

      // Calculate progress through the container when it's in the sticky zone
      if (containerTop <= 0 && containerBottom > 0) {
        const scrolledDistance = Math.abs(containerTop);
        const totalScrollDistance = containerRect.height - windowHeight;
        const scrollProgress = Math.min(
          scrolledDistance / totalScrollDistance,
          1
        );
        setProgress(scrollProgress);

        // Calculate current step based on progress
        const speed = 1.5;
        const stepProgress = scrollProgress * (steps.length - 1) * speed;
        const newStep = Math.min(Math.floor(stepProgress), steps.length - 1);

        // Stop at lifetime step (step 4) - don't go to outro
        const maxStep = 4; // Lifetime step
        const finalStep = Math.min(newStep, maxStep);
        setCurrentStep(finalStep);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps.length]);

  const currentStepData = steps[currentStep] || steps[0];

  // Function to get color based on intensity (darker yellow to dark red)
  const getHighlightColor = (intensity) => {
    if (intensity === 0.3) return "#F59E0B"; // Darker Yellow/Amber
    if (intensity === 0.5) return "#EA580C"; // Orange
    if (intensity === 0.7) return "#DC2626"; // Red
    if (intensity === 1.0) return "#991B1B"; // Dark Red
    return "#6B7280"; // Default gray
  };

  return (
    <div ref={containerRef} className="relative" style={{ height: "600vh" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen flex items-center justify-center bg-white z-10"
      >
        <div className="text-center max-w-6xl mx-auto sm:px-6">
          {/* Graph Visualization - shown above text */}
          {!currentStepData.isIntro && !currentStepData.isOutro && (
            <TimeVisualizationGraph level={currentStepData.graphLevel} />
          )}

          {/* Main text */}
          <div className="transition-all duration-700 ease-out">
            {currentStepData.isIntro || currentStepData.isOutro ? (
              // Enhanced intro with progressive emphasis and visual elements
              <div className="relative">
                {/* Background blur effects for visual interest */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gray-300/10 rounded-full blur-3xl animate-pulse"></div>
                  <div
                    className="absolute top-1/3 right-1/4 w-24 h-24 bg-gray-400/8 rounded-full blur-2xl animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>

                <h2
                  className={cn(
                    "text-4xl md:text-6xl lg:text-7xl font-bold leading-normal mb-8",
                    currentStepData.isIntro && "max-w-5xl mx-auto"
                  )}
                >
                  {currentStepData.staticText.split(" ").map((word, index) => {
                    const isKeyword = currentStepData.keywords?.includes(word);
                    const isEmphasisWord = [
                      "Distractions",
                      "cost",
                      "more",
                      "time",
                    ].includes(word);

                    return (
                      <span
                        key={index}
                        className={cn(
                          "inline-block mr-1 md:mr-3 transition-all duration-500",
                          isEmphasisWord && "text-gray-900 font-extrabold",
                          isKeyword && !isEmphasisWord && "text-gray-800",
                          !isKeyword && "text-gray-600"
                        )}
                        style={{
                          animation: `fadeInUp 0.8s ease-out ${
                            index * 0.15
                          }s both`,
                          transform: isEmphasisWord
                            ? "scale(1.05)"
                            : "scale(1)",
                        }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </h2>
              </div>
            ) : (
              // Main steps with highlighted amounts only
              <>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-1 md:mb-2">
                  {/* Static text */}
                  {currentStepData.staticText &&
                    currentStepData.staticText.split(" ").map((word, index) => (
                      <span
                        key={`static-${index}`}
                        className="inline-block mr-1 md:mr-2"
                        style={{
                          animation: `fadeInUp 0.8s ease-out ${
                            index * 0.1
                          }s both`,
                        }}
                      >
                        {word}
                      </span>
                    ))}

                  {/* Highlighted amount only */}
                  <span
                    className=" mr-2 font-bold transition-all duration-700"
                    style={{
                      color: getHighlightColor(currentStepData.colorIntensity),
                      animation: `fadeInUp 0.8s ease-out 0.3s both`,
                    }}
                  >
                    {currentStepData.amount}
                  </span>
                  <span
                    style={{
                      animation: `fadeInUp 0.8s ease-out 0.5s both`,
                    }}
                  >
                    {currentStepData.period}
                  </span>
                </h2>

                {/* Period text (not highlighted) */}
                {/* <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight transition-all duration-700">
                  
                </h3> */}
              </>
            )}

            {/* Enhanced Subtext */}
            {currentStepData.subtext && (
              <div className="space-y-4">
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium">
                  {currentStepData.subtext}
                </p>

                {currentStepData.isIntro && (
                  <div className="flex justify-center mt-8">
                    <div className="flex flex-col items-center space-y-3 opacity-70">
                      {/* <div className="text-sm text-gray-500 font-medium tracking-wide">
                        SCROLL TO DISCOVER
                      </div> */}
                      <div className="flex flex-col space-y-1">
                        {/* <div className="w-0.5 h-4 bg-gray-400 mx-auto animate-pulse"></div> */}
                        <svg
                          className="w-5 h-5 text-gray-500 animate-bounce"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
