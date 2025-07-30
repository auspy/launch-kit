import React from "react";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { featureIcons } from "@/lib/features/feature-icons";
// Default icon for sections without a matching category
const defaultIcon = Layers;
const defaultColor = "text-gray-500";

/**
 * Navigation component for feature sections
 * Dynamically builds categories from feature section data
 */
const FeatureSectionNav = ({ sections, onSectionChange, className = "" }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-wrap justify-center gap-3 ">
        {Object.entries(sections).map(([key, section]) => {
          // Look up icon and color, or use defaults
          const iconConfig = featureIcons[key] || {
            icon: defaultIcon,
            color: defaultColor,
          };

          const Icon = iconConfig.icon;

          return (
            <Button
              key={key}
              variant={"outline"}
              size="sm"
              onClick={() => onSectionChange(key)}
              className={`rounded-full capitalize transition-all ${"hover:bg-slate-100 border-slate-200"}`}
            >
              {Icon && (
                <Icon className={`mr-1.5 h-3.5 w-3.5 ${iconConfig.color}`} />
              )}
              {section.shortTitle || section.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureSectionNav;
