/**
 * Feature section data for Custom Notifications
 */

export const featureSectionData = {
  title: "Custom Notifications",
  shortTitle: "Custom Notifications",
  description:
    "Choose from various notification styles that appear during your focus sessions to help you stay aware without disrupting your focus.",
  content: [
    {
      type: "contentWithImage",
      title: "Choose from border, edges, or fullscreen",
      description:
        "Different notification styles help you stay aware without disrupting your focus. Subtle edges is perfect for gentle reminders, border highlights catch your attention more effectively, while fullscreen notifications ensure you never miss important alerts - pick what works best for your concentration style.",
      image: [
        "/notifications/border.jpg",
        "/notifications/edges.jpg",
        "/notifications/fullscreen.png",
      ],
    },
    {
      type: "imageSteps",
      title: "Customize notification sound, color and opacity",
      steps: [
        {
          title: "Customize Sound, Frequency, and Opacity",
          description:
            "Personalize your notifications to suit your needs - choose sounds that you find pleasant, adjust how often they appear, and control their transparency to minimize distraction during your work",
          image: "/notifications/options.png",
          descriptionBefore: true,
        },
        {
          title: "30% Opacity Example",
          description:
            "Lower opacity settings make notifications less intrusive - perfect for when you need gentle reminders rather than obvious alerts",
          image: "/notifications/fullscreen_30.jpeg",
          descriptionBefore: true,
        },
      ],
    },
  ],
};
