import React from "react";
import { features } from "@/lib/features/features";
import { featureIcons } from "@/lib/features/feature-icons";
import { featureEnum } from "@/lib/features/featureEnum";

// Select specific features to highlight
const highlightedFeatures = [
  featureEnum.CLOUD_SYNC, // Important for cross-device professionals
  featureEnum.KEYBOARD_SHORTCUTS, // Tech audience will appreciate efficiency
  featureEnum.WORKSPACES, // Context switching for different work types
  featureEnum.TIME_TRACKING, // Supports the top goal of time tracking
  featureEnum.CUSTOM_NOTIFICATIONS, // Helps with remembering breaks/meetings
  featureEnum.TASK_RESET, // Fresh starts help with procrastination
];

const FeatureHighlights = () => {
  // Filter features to show only highlighted ones
  const featuresToShow = features.filter((feature) =>
    highlightedFeatures.includes(feature.id)
  );

  return (
    <div className=" px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresToShow.map((feature) => {
            const iconData = featureIcons[feature.id];
            const Icon = iconData?.icon;
            return (
              <div
                key={feature.id}
                className="flex flex-col items-center text-center p-6"
              >
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    iconData?.color || "text-primary"
                  } bg-slate-100`}
                >
                  <Icon className={``} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground ">
                  {feature.shortDescription}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureHighlights;
