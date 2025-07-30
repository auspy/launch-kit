/**
 * Landing page data for Calendar Time Tracking integration
 */
import React from "react";
import { featureEnum } from "@/lib/features/featureEnum";

export const landingPageData = {
  heroData: {
    title: "Focus sessions history",
    subtitle: "in your calendar",
    description: (
      <>
        Focusmo <strong> automatically logs </strong> your focus sessions to
        <strong> Apple Calendar</strong>, creating a rich record of your
        productive time without any manual tracking.
      </>
    ),
    videoSrc: "/calendar.mp4",
    keyPoints: [
      "Automatic Calendar Logging",
      "Visual Productivity History",
      "Zero Manual Tracking",
    ],
    primaryButton: {
      text: "Download for Mac",
      href: "/download",
      icon: "Download",
    },
    secondaryButton: {
      text: "See How It Works",
      href: "#how-it-works",
      icon: "Calendar",
    },
  },
  contentSections: [
    {
      title: "See your focus history right in Apple Calendar",
      description: (
        <>
          <p>
            Stop wondering where your time went. Focusmo automatically logs
            every focus session directly to your Apple Calendar, creating a
            beautiful visual record of your productive hours without any manual
            tracking.
          </p>
          <p>
            Each focus block appears as a calendar event with detailed
            information about what you worked on, how long you focused, and
            which apps you used—giving you a comprehensive, glanceable history
            of your productivity that lives right where you already plan your
            time.
          </p>
        </>
      ),
      media: {
        src: "/features/calendar-integration-main.jpg",
        alt: "Focus sessions displayed in Apple Calendar",
      },
      badge: "Automatic Documentation",
      className: "object-cover",
    },
    {
      title: "Zero effort time tracking that actually works",
      description: (
        <>
          <p>
            Traditional time tracking fails because it requires constant manual
            input. Focusmo eliminates this friction by automatically recording
            your sessions in the background while you work, ensuring your
            productivity data is always accurate and complete.
          </p>
          <p>
            Whether you're coding for hours, writing in short bursts, or jumping
            between different projects, every focused minute is captured without
            you having to remember to start or stop timers—creating the
            effortless time tracking system you've always wanted.
          </p>
        </>
      ),
      media: {
        src: "/features/calendar-tracking-automatic.jpg",
        alt: "Automatic time tracking with no manual input",
      },
      badge: "Friction-Free Tracking",
      className: "object-cover",
    },
    {
      title: "Turn your calendar into a productivity dashboard",
      description: (
        <>
          <p>
            Your calendar transforms from a simple scheduling tool into a
            powerful productivity dashboard. Scroll back to any day, week, or
            month and instantly see when you were most focused, what you
            accomplished, and how your productive time aligned with your other
            commitments.
          </p>
          <p>
            This visual approach to time tracking makes it easy to identify
            patterns—like when you tend to have your most productive hours or
            how meetings impact your focus time—helping you make smarter
            decisions about how you schedule your days.
          </p>
        </>
      ),
      media: {
        src: "/features/calendar-productivity-view.jpg",
        alt: "Calendar view showing productivity patterns",
      },
      badge: "Visual Productivity Insights",
      className: "object-cover",
    },
    {
      title: "Complete control and customization",
      description: (
        <>
          <p>
            Choose exactly how your focus sessions appear in your calendar with
            customizable colors, visibility settings, and naming conventions.
            Create a dedicated focus calendar or integrate sessions with your
            existing calendar structure, whatever works best for your workflow.
          </p>
          <p>
            Concerned about privacy or calendar clutter? Adjust what information
            gets recorded, or set minimum session durations for logging,
            ensuring your calendar remains a helpful tool rather than an
            overwhelming record.
          </p>
        </>
      ),
      media: {
        src: "/features/calendar-customization.jpg",
        alt: "Calendar integration customization options",
      },
      badge: "Coming Soon",
      className: "object-cover",
    },
  ],
  integrationSection: {
    title: (
      <>
        Seamlessly Integrated <br /> With Your Workflow
      </>
    ),
    description: (
      <>
        Calendar integration doesn't exist in isolation, it's part of Focusmo's
        complete productivity ecosystem, working together with our other
        features to enhance how you track, understand, and improve your focus.
      </>
    ),
    media: {
      src: "/features/calendar-ecosystem.jpg",
      alt: "Calendar integration within the Focusmo ecosystem",
    },
    badge: "Enhanced Productivity Ecosystem",
    className: "object-cover bg-slate-50",
    additionalFeatures: [
      {
        title: "Track Pomodoro sessions in your calendar",
        description: (
          <>
            <p>
              When combined with our Pomodoro Timer, each work session and break
              is automatically logged to your calendar with distinct colors and
              descriptions. This creates a visual record of your focus patterns
              and helps you optimize your work/break cycle based on real data.
            </p>
          </>
        ),
        media: {
          src: "/features/pomodoro.mp4",
          alt: "Pomodoro sessions recorded in calendar",
        },
        feature: featureEnum.POMODORO_TIMER,
        badge: "Pomodoro Integration",
      },
      {
        title: "Never miss meetings with unmissable alerts",
        description: (
          <>
            <p>
              Our Meeting Notifications feature works with your calendar to
              ensure you never miss important meetings, even during deep focus.
              You'll receive attention-grabbing at just the right moment before
              each meeting, helping you smoothly transition from focused work to
              collaboration.
            </p>
          </>
        ),
        media: {
          src: "/meeting-alerts.mp4",
          alt: "Meeting notification alerts",
        },
        feature: featureEnum.NEVER_MISS_MEETINGS,
        badge: "Meeting Awareness",
      },
      {
        title: "Analyze your productivity patterns with Focus Analytics",
        description: (
          <>
            <p>
              Calendar tracking data feeds directly into our powerful analytics
              system, giving you detailed insights into your focus patterns.
              Understand when you're most productive, how you spend your time,
              and identify opportunities to optimize your schedule for better
              results.
            </p>
          </>
        ),
        media: {
          src: "/track_focus_time.mp4",
          alt: "Focus analytics showing productivity patterns",
        },
        feature: featureEnum.ANALYTICS,
        badge: "Data-Driven Insights",
      },
    ],
  },
  faqQuestions: [
    {
      question: "Will calendar logging clutter my existing calendar?",
      answer:
        "Not at all. Focusmo can create a dedicated focus calendar that stays separate from your main calendars but remains visible in the same view. Alternatively, you can choose to log sessions to any existing calendar and customize how the events appear. You have complete control over colors, naming, and visibility.",
    },
    {
      question: "What information gets recorded in the calendar events?",
      answer:
        "By default, focus sessions are logged with the task name, duration, and focus score. You can customize this to include additional details like apps used, websites visited, or projects worked on. You also have the option to keep entries more generic for privacy, showing only 'Focus Session' without specific details.",
    },
    {
      question: "Can I edit or delete calendar entries after they're created?",
      answer:
        "Yes, you have full control over your calendar entries. You can manually edit any focus session details, adjust the timing, or delete entries entirely if needed. Focusmo also provides a dashboard where you can bulk edit or manage your focus history.",
    },
    {
      question: "Does this work with calendar apps besides Apple Calendar?",
      answer:
        "Focusmo directly integrates with Apple Calendar, which then syncs with many other calendar services. If you use Google Calendar, Outlook, or other platforms that sync with Apple Calendar, your focus sessions will appear there as well. We're actively working on direct integrations with other calendar platforms.",
    },
    {
      question: "Can I disable automatic calendar logging?",
      answer:
        "Absolutely. Calendar logging is completely optional and can be enabled or disabled at any time from the preferences. You can also set minimum session durations (e.g., only log sessions longer than 15 minutes) to prevent short focus moments from being recorded.",
    },
    {
      question: "How can I use this data for reporting or billing?",
      answer:
        "Focusmo offers several ways to use your calendar data for professional purposes. You can view and filter sessions directly in the calendar, export custom reports as PDF or CSV files, or use our analytics dashboard to create visual summaries by project, client, or time period—perfect for client billing, team reviews, or personal productivity analysis.",
    },
  ],
};
