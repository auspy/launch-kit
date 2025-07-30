/**
 * Feature section data for Pomodoro Timer
 */

import { Columns } from "lucide-react";

export const featureSectionData = {
  title: "Pomodoro Timer",
  shortTitle: "Pomodoro Timer",
  description: "Master your focus with science-backed work-rest cycles",
  category: "time awareness",
  content: [
    {
      type: "contentWithImage",
      title: "Balance focus and rest on autopilot with Pomodoro",
      description:
        "The Pomodoro Technique alternates focused work periods with short breaks to prevent burnout and maintain productivity. Our timer handles all transitions automatically so you can stay in flow.",
      image: "/features/pomodoro.mp4",
    },
    {
      type: "contentWithImage",
      title: "Customize your Pomodoro break/work durations",
      description:
        "Set your ideal work sessions (25-50 min recommended) and break lengths (5-15 min) to match your personal focus style and project demands. Adjust anytime to optimize your productivity rhythm.",
      image: ["/pomodoro/current session.png", "/customizations/pomodoro.png"],
    },
    {
      type: "keyPoints",
      title: "Why use our Pomodoro Timer?",
      points: [
        { title: "Seamless transitions between work and break periods" },
        { title: "Visual and audio notifications keep you on track" },
        { title: "Track completed pomodoros to measure your progress" },
        {
          title:
            "Works alongside other focus features for maximum productivity",
        },
      ],
      columns: 2,
    },
  ],
};
