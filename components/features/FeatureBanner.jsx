import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featureIcons } from "@/lib/features/feature-icons";
import { featureEnum } from "@/lib/features/featureEnum";
import ButtonMainCTA from "../buttons/ButtonMainCTA";
import { Badge } from "../ui/badge";
import { Locations } from "@/lib/tracking";

export default function FeatureBanner() {
  // Select specific core features to display
  const coreFeatures = [
    {
      id: featureEnum.FLOATING_TIMER,
      label: "Timer",
      gradient: "from-orange-100 via-rose-100 to-pink-100",
    },
    {
      id: featureEnum.ANALYTICS,
      label: "Analytics",
      gradient: "from-blue-100 via-cyan-100 to-sky-100",
    },
    {
      id: featureEnum.WORKSPACES,
      label: "Workspace",
      gradient: "from-green-100 via-emerald-100 to-teal-100",
    },
    {
      id: featureEnum.QUICK_ACCESS,
      label: "Quick Access",
      gradient: "from-violet-100 via-purple-100 to-fuchsia-100",
    },
    {
      id: featureEnum.CLOUD_SYNC,
      label: "Cloud Sync",
      gradient: "from-yellow-100 via-amber-100 to-orange-100",
    },
    {
      id: featureEnum.KEYBOARD_SHORTCUTS,
      label: "Shortcuts",
      gradient: "from-rose-100 via-pink-100 to-purple-100",
    },
    {
      id: featureEnum.TIME_TRACKING,
      label: "Tracking",
      gradient: "from-sky-100 via-indigo-100 to-violet-100",
    },
    {
      id: featureEnum.POMODORO_TIMER,
      label: "Pomodoro",
      gradient: "from-red-100 via-red-50 to-orange-100",
    },
    {
      id: featureEnum.COMPACT_MODE,
      label: "Compact Mode",
      gradient: "from-teal-100 via-emerald-50 to-green-100",
    },
    {
      id: featureEnum.CUSTOM_NOTIFICATIONS,
      label: "Notifications",
      gradient: "from-red-100 via-orange-50 to-amber-100",
    },
    {
      id: featureEnum.DAILY_REMINDERS,
      label: "Reminders",
      gradient: "from-pink-100 via-rose-50 to-red-100",
    },
    {
      id: featureEnum.APPEARANCE_CUSTOMIZATION,
      label: "Customization",
      gradient: "from-pink-100 via-purple-50 to-fuchsia-100",
    },
    {
      id: featureEnum.TASK_RESET,
      label: "Task Reset",
      gradient: "from-blue-100 via-sky-50 to-indigo-100",
    },
    {
      id: featureEnum.NEVER_MISS_MEETINGS,
      label: "Meetings",
      gradient: "from-indigo-100 via-violet-50 to-purple-100",
    },
  ];

  // Double the features array to create a seamless loop
  const left = coreFeatures.slice(0, 8);
  const right = coreFeatures.slice(8, 16);
  const leftColumnFeatures = [...left, ...left];
  const rightColumnFeatures = [...right, ...right];

  return (
    <section className="w-full py-24 bg-primary">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gray-50 border border-gray-100 rounded-3xl py-8 p-6 md:py-16 md:p-16 relative overflow-hidden">
          {/* <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-transparent pointer-events-none" /> */}

          <Badge variant="outline" className="mb-6">
            Introducing Focusmo
          </Badge>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 xl:gap-20 relative">
            <div className="max-w-2xl">
              <p className="text-2xl text-gray-600 mb-5">
                An all-in-one focus app for mac (and iOS soon).
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold !leading-[1.2] mb-8">
                All the essential tools to{" "}
                <span className="text-blue-500">
                  focus, track and reclaim time
                </span>{" "}
                in one thoughtfully designed Mac app.
              </h2>
              <p className="text-base text-gray-600 mb-5">
                <strong>The best part? 🤔</strong>
                <br /> We are still improving it daily. Updates every other
                week.
              </p>
              <div className="mt-10">
                <ButtonMainCTA
                  type="large"
                  location={Locations.FEATURE_BANNER}
                />
                <div className="flex flex-wrap gap-x-10 gap-y-4 mt-4">
                  <Link
                    href="/features"
                    className="text-blue-500 hover:text-blue-600 font-medium flex items-center transition-colors text-lg"
                  >
                    Check all features <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <Link
                    href="/changelog"
                    className="text-blue-500 hover:text-blue-600 font-medium flex items-center transition-colors text-lg"
                  >
                    What's new? <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative w-full lg:w-auto max-w-lg mx-auto lg:mx-0 h-[300px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-50 pointer-events-none z-10" />

              <div className="flex gap-8 md:gap-12">
                <div className="space-y-8 animate-scroll-slow">
                  {leftColumnFeatures.map((feature, index) => {
                    const iconData = featureIcons[feature.id];
                    const IconComponent = iconData.icon;

                    return (
                      <div
                        key={`left-${feature.id}-${index}`}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-[64px] h-[64px] md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] relative`}
                        >
                          {/* <div className="absolute inset-0 rounded-2xl bg-white/80 backdrop-blur-sm" /> */}
                          <div className="absolute inset-[1px] rounded-2xl bg-white flex items-center justify-center">
                            <IconComponent
                              className={`w-8 h-8 md:w-10 md:h-10 ${iconData.color}`}
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-800 text-center mt-3">
                          {feature.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-8 animate-scroll-down translate-y-[50%]">
                  {rightColumnFeatures.map((feature, index) => {
                    const iconData = featureIcons[feature.id];
                    const IconComponent = iconData.icon;

                    return (
                      <div
                        key={`right-${feature.id}-${index}`}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-[64px] h-[64px] md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] relative`}
                        >
                          {/* <div className="absolute inset-0 rounded-2xl bg-white/80 backdrop-blur-sm" /> */}
                          <div className="absolute inset-[1px] rounded-2xl bg-white flex items-center justify-center">
                            <IconComponent
                              className={`w-8 h-8 md:w-10 md:h-10 ${iconData.color}`}
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-800 text-center mt-3">
                          {feature.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
