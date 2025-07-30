import React from "react";
import { featureEnum } from "@/lib/features/featureEnum";

export const landingPageData = {
  heroData: {
    title: "Never lose track of time",
    subtitle: "with the floating timer",
    description:
      "Focusmo for macOS helps you stay aware of time and focus on one task at a time without disrupting your workflow.",
    videoSrc: "/features/follow.mp4",
    keyPoints: [
      "Always Visible Across Apps/Monitors",
      "Distraction-Free Design",
      "Customizable Appearance",
    ],
    primaryButton: {
      text: "Download for Mac",
      href: "/download",
      icon: "Download",
    },
    secondaryButton: {
      text: "Learn How It Works",
      href: "#how-it-works",
      icon: "Play",
    },
  },
  contentSections: [
    {
      title: "Stay on top of time while staying in flow",
      description: (
        <>
          <p>
            Traditional timers get buried under windows, forcing you to switch
            contexts just to check the time. Focusmo's floating timer elegantly
            follows you across all applications, ensuring you're always aware of
            your current task and time remaining.
          </p>
          <p>
            Whether you're coding, designing, writing, or analyzing data, the
            timer remains gently present, keeping you connected to time without
            adding any additional load or forcing you to break concentration.
          </p>
        </>
      ),
      media: {
        src: "/follow.mp4",
        alt: "Floating timer following across multiple applications",
      },
      badge: "Always Visible",
      className: "object-cover",
    },
    {
      title: "Designed for focus, not distraction",
      description: (
        <>
          <p>
            Most timers demand attention with jarring ticks, aggressive
            countdowns, and anxiety-inducing designs. Focusmo's floating timer
            was crafted with careful attention to cognitive psychology, using
            subtle visual cues that register in your peripheral awareness.
          </p>
          <p>
            The minimal interface shows exactly what you need—your current task
            and time remaining—without unnecessary controls or visual noise.
            It's the difference between a timer that works for you versus one
            that works against you.
          </p>
        </>
      ),
      media: {
        src: "/features/timer-design.jpg",
        alt: "Floating timer minimal design interface",
      },
      badge: "Mindful Design",
      className: "object-cover",
    },
    {
      title: "Time awareness without time anxiety",
      description: (
        <>
          <p>
            Time anxiety is that constant pressure you feel as seconds tick
            away. Focusmo transforms your relationship with time by replacing
            stress-inducing countdowns with gentle visual indicators that
            promote awareness without urgency.
          </p>
          <p>
            The subtle wave animations and progress indicators create a calm
            reminder that time is passing, helping you maintain a healthy pace
            without the constant pressure of racing against the clock—perfect
            for creative work that requires both time boundaries and mental
            freedom.
          </p>
        </>
      ),
      media: {
        src: "/features/timer-waves.jpg",
        alt: "Floating timer with calming wave animations",
      },
      badge: "Anxiety-Free Time Management",
      className: "object-cover",
    },
    {
      title: "Personalize your time awareness experience",
      description: (
        <>
          <p>
            Every workflow is unique, which is why Focusmo's floating timer
            adapts to your preferences instead of forcing you into a
            one-size-fits-all solution. Customize transparency, size, position,
            and theme to match your personal style and workspace setup.
          </p>
          <p>
            Whether you need a prominent reminder or just a subtle hint of time
            passing, the floating timer can be configured to complement your
            concentration style rather than compete with it—giving you the
            perfect level of time awareness for your specific needs.
          </p>
        </>
      ),
      media: {
        src: "/features/timer-customize.jpg",
        alt: "Floating timer customization options",
      },
      badge: "Your Timer, Your Way",
      className: "object-cover",
    },
  ],
  integrationSection: {
    title: (
      <>
        Part of Your Complete <br /> Focus Ecosystem
      </>
    ),
    description: (
      <>
        The floating timer shines on its own, but it's even more powerful when
        combined with Focusmo's complete suite of productivity tools, creating a
        seamless focus experience across your entire workflow.
      </>
    ),
    media: {
      src: "/features/timer-integrations.jpg",
      alt: "Floating timer integrated with other Focusmo features",
    },
    badge: "Better Together",
    className: "object-cover bg-slate-50",
    additionalFeatures: [
      {
        title: "Pomodoro technique with visual and audio cues",
        description: (
          <>
            <p>
              Combine the floating timer with our Pomodoro implementation for
              the perfect balance of focus and rest. The timer adapts its
              appearance to show work and break periods, giving you subtle
              visual cues that help maintain your rhythm without disrupting your
              flow.
            </p>
          </>
        ),
        media: {
          src: "/pomodoro.mp4",
          alt: "Floating timer with Pomodoro integration",
        },
        feature: featureEnum.POMODORO,
        badge: "Pomodoro Integration",
      },
      {
        title: "Block distractions while your timer runs",
        description: (
          <>
            <p>
              The floating timer works seamlessly with Focusmo's powerful
              distraction blocking. When your timer is running, distracting apps
              and websites can be automatically blocked, creating a truly
              focused environment.
            </p>
          </>
        ),
        media: {
          src: "/workspaces.mp4",
          alt: "Floating timer with website and app blocking",
        },
        feature: featureEnum.WEBSITE_BLOCKING,
        badge: "Apps and Websites Blocking",
      },
      {
        title: "Never miss important meetings even during focus sessions",
        description: (
          <>
            <p>
              Never miss important meetings even during deep work. The floating
              timer connects with your calendar to provide full screen reminders
              about upcoming calendar events, ensuring you remain aware of your
              schedule.
            </p>
          </>
        ),
        media: {
          src: "/calendar.mp4",
          alt: "Floating timer with calendar integration",
        },
        feature: featureEnum.CALENDAR_INTEGRATION,
        badge: "Never Miss Meetings",
      },
    ],
  },
  faqQuestions: [
    {
      question: "Can I customize the appearance of the floating timer?",
      answer:
        "Yes, you can adjust the transparency, size, position, and color theme of the floating timer. You can also toggle between compact and expanded views depending on how much information you want visible while working.",
    },
    {
      question: "Will the floating timer work with multiple monitors?",
      answer:
        "Absolutely! The floating timer works seamlessly across multiple monitors. You can configure it to stay on your primary display, follow your mouse across all displays, or remain on a specific monitor of your choice.",
    },
    {
      question: "Can I temporarily hide the timer?",
      answer:
        "Yes, you can quickly hide the timer when needed (like during presentations or screenshots) using a customizable keyboard shortcut or by clicking the minimize button. Bring it back with the same shortcut or from the menu bar icon.",
    },
    {
      question: "Does the floating timer work with third-party apps?",
      answer:
        "The floating timer works with virtually all applications on your system. It stays on top of other windows without interfering with their functionality, whether you're using creative tools, browsers, IDE's, or office applications.",
    },
    {
      question: "Can I use the floating timer without using Pomodoro?",
      answer:
        "Absolutely! While the floating timer integrates beautifully with our Pomodoro feature, it functions perfectly as a standalone tool. You can use it simply as a clock, as a countdown timer, or as a task duration tracker without implementing the Pomodoro technique.",
    },
    {
      question: "Will the floating timer affect my system performance?",
      answer:
        "No, the floating timer is designed to be extremely lightweight. It uses minimal system resources and won't affect the performance of other applications, even resource-intensive ones like video editors or 3D software.",
    },
  ],
};
