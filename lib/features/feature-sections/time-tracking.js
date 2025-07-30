/**
 * Feature section data for Time Tracking
 */

export const featureSectionData = {
  title: "Focus Sessions in Apple Calendar",
  shortTitle: "Apple Calendar",
  description:
    "See your focus sessions directly in Apple Calendar. You can quickly see how much time you've spent on each task, understand where your time goes, and identify areas where you can improve your productivity.",
  content: [
    {
      type: "contentWithImage",
      title: "See full journey of each task",
      description:
        "Your calendar shows the full journey of each task with clear status markers like [Started], [Completed], [Resumed], and [Paused]. This visual timeline helps you spot patterns and make smarter decisions about how you work.",
      image: "/time-tracking/calendar integration.png",
      altText: "Focusmo Apple Calendar Integration",
    },
    {
      type: "contentWithImage",
      title: "Access your focus data from your favorite calendar app",
      description: (
        <>
          Focus sessions are logged in your email account connected to Apple
          Calendar, making your productivity data accessible from any calendar
          app across all your devices. (Select a email account in Focusmo
          calendar sync settings to make this work.)
          <br />
          <br /> Here is example same focus sessions in Notion Calendar:
        </>
      ),
      image: "/time-tracking/notion calendar.png",
      altText: "Focusmo Apple Calendar Integration",
    },
  ],
};
