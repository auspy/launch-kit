import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, challengeDetails } from "@/lib/features/features";
import { CHALLENGES } from "@/lib/features/feature-challenges";
import {
  Clock,
  BarChart2,
  ShieldX,
  Coffee,
  Hourglass,
  Cloud,
  Calendar,
  Settings,
  Bell,
  ListFilter,
  Grid2X2,
  BrainCircuit,
} from "lucide-react";

// Map of category to icon and color
const categoryConfig = {
  [CATEGORIES.TRACKING]: {
    icon: BarChart2,
    color: "text-purple-500",
  },
  [CATEGORIES.BLOCKING]: {
    icon: ShieldX,
    color: "text-red-500",
  },
  [CATEGORIES.BREAK_MANAGEMENT]: {
    icon: Coffee,
    color: "text-amber-500",
  },
  [CATEGORIES.TIME_AWARENESS]: {
    icon: Hourglass,
    color: "text-emerald-500",
  },
  [CATEGORIES.CLOUD_SYNC]: {
    icon: Cloud,
    color: "text-sky-500",
  },
  [CATEGORIES.CALENDAR]: {
    icon: Calendar,
    color: "text-indigo-500",
  },
  [CATEGORIES.CUSTOMIZATION]: {
    icon: Settings,
    color: "text-pink-500",
  },
  [CATEGORIES.NOTIFICATIONS]: {
    icon: Bell,
    color: "text-orange-500",
  },
  [CATEGORIES.UTILITY]: {
    icon: ListFilter,
    color: "text-blue-500",
  },
};

const CategoryFilter = ({ activeCategory, activeChallenge, onChange }) => {
  const [activeTab, setActiveTab] = useState("category");

  // Add "All" as a filter option
  const categories = [null, ...Object.values(CATEGORIES)];
  const challenges = [null, ...Object.values(CHALLENGES)];

  const handleTabChange = (value) => {
    setActiveTab(value);

    // Reset filters when tab changes
    if (value === "category" && activeChallenge) {
      onChange(null, null);
    } else if (value === "challenge" && activeCategory) {
      onChange(null, null);
    }
  };

  const handleCategoryChange = (category) => {
    onChange(category, null);
  };

  const handleChallengeChange = (challenge) => {
    onChange(null, challenge);
  };

  return (
    <div className="flex flex-col max-w-3xl mx-auto">
      {/* Filter toggle buttons */}
      <div className="flex justify-center mb-6">
        <div className="grid w-[300px] grid-cols-2 bg-muted rounded-lg p-1">
          <Button
            variant={activeTab === "category" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabChange("category")}
            className={`rounded-md h-8 ${
              activeTab === "category"
                ? "bg-primary text-white hover:bg-primary/95"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <Grid2X2 className="h-3.5 w-3.5 mr-2" />
            Categories
          </Button>
          <Button
            variant={activeTab === "challenge" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabChange("challenge")}
            className={`rounded-md h-8 ${
              activeTab === "challenge"
                ? "bg-primary text-white hover:bg-primary/95"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <BrainCircuit className="h-3.5 w-3.5 mr-2" />
            Challenges
          </Button>
        </div>
      </div>

      {/* Display categories in pill style */}
      {activeTab === "category" && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const config = category
              ? categoryConfig[category]
              : { icon: null, color: "" };
            const Icon = config.icon;
            const label = category ? category : "All Features";

            return (
              <Button
                key={category || "all"}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className={`rounded-full capitalize transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-slate-100 border-slate-200"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`mr-1.5 h-3.5 w-3.5 ${
                      isActive ? "" : config.color
                    }`}
                  />
                )}
                {label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Display challenges in pill style */}
      {activeTab === "challenge" && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {challenges.map((challenge) => {
            const isActive = activeChallenge === challenge;
            const details = challenge ? challengeDetails[challenge] : null;
            const label = details ? details.title : "All Challenges";

            return (
              <Button
                key={challenge || "all"}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleChallengeChange(challenge)}
                className={`rounded-full transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-slate-100 border-slate-200"
                }`}
              >
                {details && <span className="mr-1.5">{details.icon}</span>}
                {label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
