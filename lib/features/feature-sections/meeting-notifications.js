/**
 * Feature section data for Meeting Notifications
 */

export const featureSectionData = {
  title: "Never Miss a Meeting",
  shortTitle: "Meeting Notifications",
  description:
    "Focusmo blocks your screen just in time for the meeting. It is virtually impossible to miss the alert.",
  content: [
    {
      type: "contentWithImage",
      title: "Fullscreen Meeting Alerts",
      description:
        "Meeting notifications show up before your meeting starts, displaying a countdown timer, location details, and convenient snooze options. One-click meeting join feature coming soon!",
      image: ["/calendar events/labels.png"],
    },
    {
      type: "imageSteps",
      steps: [
        {
          title: "1. Connect Your Calendar or Add Event from Focusmo",
          description:
            "Focusmo works with any calendar app that syncs with Apple Calendar. Just make sure you're using the same email across both services.",
          image: "/calendar events/add a event.png",
        },
        {
          title: "2. Start Your Focus Session",
          description:
            "Begin working on your tasks without worrying about checking the time for upcoming meetings.",
          image: "/features/reorder.mp4",
        },
        {
          title: "3. Get Timely Meeting Alerts",
          description:
            "Focusmo will automatically interrupt your session before your meeting starts.",
          image: "/calendar events/step3.mp4",
        },
      ],
    },
  ],
};
