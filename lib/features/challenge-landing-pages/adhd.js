// adhdLandingPageData.ts
import { featureEnum } from "@/lib/features/featureEnum";

export const landingPageData = {
  heroData: {
    title: "All-in-one focus app",
    subtitle: "for ADHD minds",
    videoSrc: "/hero_2.mp4",
    keyPoints: [
      "Visual Time Awareness",
      "Contextual Distraction Blocking",
      "Keyboard-First Control",
    ],
  },

  contentSections: [
    // 1 — Time awareness
    {
      title: "Track your time without distraction",
      description: (
        <>
          <p>
            Time slips away fast when you have ADHD. The floating timer sits in
            one corner of every screen so you always see how much is left.
          </p>
          <p>
            Color and a gentle progress ring make minutes feel real. Drag the
            timer where you want and get back to work. Move to menubar to
            completely zone in.
          </p>
        </>
      ),
      media: {
        src: "/features/follow.mp4",
        alt: "Floating visual timer across apps",
      },
      badge: "Time Awareness",
      className: "object-cover",
      feature: featureEnum.FLOATING_TIMER,
    },

    // 2 — Hyperfocus breaks
    {
      title: "Stay fresh with Pomodoro",
      description: (
        <>
          <p>
            Long sprints feel great until you forget to pause. The Pomodoro
            timer nudges you to take a short break before your energy drops.
          </p>
          <p>
            Choose your own work and rest lengths. Focusmo starts the next block
            for you and plays a soft sound when it is break time.
          </p>
        </>
      ),
      media: { src: "/features/pomodoro.mp4", alt: "Adaptive Pomodoro cycles" },
      badge: "Prevent Burnout",
      className: "object-cover",
      feature: featureEnum.POMODORO,
    },

    // 3 — Distraction blocking
    {
      title: "Quiet the noise",
      description: (
        <>
          <p>
            Social feeds and chat pings steal attention fast. Workspaces block
            distracting apps and sites while you focus.
          </p>
          <p>
            Switch rules in one click or let them change with your schedule.
            Break windows keep access so you never feel trapped.
          </p>
        </>
      ),
      media: {
        src: "/workspaces/block screen small.png",
        alt: "Workspace-based app and site blocking",
      },
      badge: "Distraction Control",
      className: "object-cover",
      feature: featureEnum.WORKSPACES,
    },

    // 4 — Executive-function helper
    {
      title: "Command everything from the keyboard",
      description: (
        <>
          <p>
            Press one shortcut and the Quick Access panel opens anywhere. No
            mouse. No search.
          </p>
          <p>
            Start a timer, capture a thought, or jump to another workspace in
            seconds. Less effort means more progress.
          </p>
        </>
      ),
      media: {
        src: "/quick-access/addworkspaceortimer.mp4",
        alt: "Keyboard-first Quick Access",
      },
      badge: "Fast Control",
      className: "object-cover",
      feature: featureEnum.QUICK_ACCESS,
    },
  ],

  integrationSection: {
    title: <>A complete ecosystem focused on fighting ADHD</>,
    description: (
      <>
        From meeting reminders to stop missing cause of hyperfocus to analytics
        that monitor your best work hours, Focusmo works for your brain, not
        against it.
      </>
    ),
    media: {
      src: "/features/adhd-ecosystem.jpg",
      alt: "Focusmo's connected ADHD toolchain",
    },
    badge: "Integrated Tools",
    className: "object-cover bg-slate-50",

    additionalFeatures: [
      {
        title: "Never miss a meeting again",
        description: (
          <p>
            Full-screen countdowns appear a few minutes before each event, so
            you glide from deep work to Zoom on time, no phone alarms required.
          </p>
        ),
        media: {
          src: "/calendar events/step3.mp4",
          alt: "Fullscreen meeting alert",
        },
        feature: featureEnum.NEVER_MISS_MEETINGS,
        badge: "Meeting Alerts",
      },
      {
        title: "Understand your unique focus patterns",
        description: (
          <p>
            The <strong>Analytics</strong> dashboard shows when you’re most
            on-fire and what trips you up, helping you craft a schedule that
            matches your meds, energy, or coffee curve.
          </p>
        ),
        media: {
          src: "/features/track_focus_time.mp4",
          alt: "Focus analytics dashboard",
        },
        feature: featureEnum.ANALYTICS,
        badge: "Self-Insight",
      },
      {
        title: "See every session in your favorite Calendar",
        description: (
          <>
            <p>
              It is easy to lose track of how long you really worked. Focusmo
              writes each focus block straight to Google Calendar, Notion
              Calendar, or any calendar you prefer.
            </p>
            <p>
              Open your planner and see solid entries for every session. Know
              when you started, when you stopped, and how much time you owned
              the day.
            </p>
          </>
        ),
        media: {
          src: "/time-tracking/calendar integration.png",
          alt: "Focus sessions saved to Google and Notion Calendar",
        },
        feature: featureEnum.TIME_TRACKING, // change to your actual enum key
        badge: "Time Tracking",
      },
    ],
  },
};
