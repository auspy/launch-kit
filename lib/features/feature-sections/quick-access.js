/**
 * Feature section data for Quick Access Panel
 */

export const featureSectionData = {
  title: "Quick Access Panel ",
  shortTitle: "Quick Access",
  description: "Spotlight-style command bar for instant control",
  hasWebpage: true,
  content: [
    {
      type: "contentWithImage",
      title: "Control everything without disruption",
      description:
        "Access all Focusmo features with just a keyboard shortcut, keeping you in your workflow.",
      image: "/quick-access/banner.png",
      imagePosition: "right",
    },
    {
      type: "bulletPoints",
      title: "Fast, keyboard-first control",
      points: [
        "Global keyboard shortcut activation",
        "Lightning-fast fuzzy search",
        "Natural language commands",
        "Timer controls without app switching",
        "Customizable shortcuts",
      ],
      columns: 3,
    },
    {
      type: "imageSteps",
      maxHeight: 600,
      steps: [
        {
          title: "Add Workspace or Timer",
          description:
            "Quickly add a workspace or timer with natural language commands - just type what you want in plain English and get right back to work.",
          image: "/quick-access/addworkspaceortimer.mp4",
        },
        {
          title: "Change, Delete, Pause Tasks",
          description:
            "Effortlessly change, modify, delete, or pause tasks with simply with Quick Access Panel - no menu navigation required.",
          image: "/quick-access/change-pause-tasks.mp4",
        },
      ],
    },
    {
      type: "keyPoints",
      title: "Why Quick Access matters",
      points: [
        {
          title: "Stay in your workflow",
          description: "No need to switch away from your current task",
        },
        {
          title: "Reduce context switching",
          description: "Fewer distractions mean better focus",
        },
        {
          title: "Save time with shortcuts",
          description: "Access any feature without hunting through menus",
        },
        {
          title: "Capture thoughts instantly",
          description: "Add tasks the moment they come to mind",
        },
      ],
    },
  ],
};
