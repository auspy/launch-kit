// procrastinationLandingPageData.ts
import { featureEnum } from "@/lib/features/featureEnum";

export const landingPageData = {
  /* ───────────────────  Hero  ─────────────────── */
  heroData: {
    title: "Turn ‘I’ll do it later’",
    subtitle: "into ‘I’m doing it now’",
    description:
      "No more waiting for motivation or any need of willpower. Beat procrastination with Focusmo.",
    videoSrc: "/hero_2.mp4",
    keyPoints: [
      "Start from anywhere",
      "Block distractions",
      "Pomodoro",
      "Review Progress",
    ],
  },

  /* ────────────────  Core Benefits  ─────────────── */
  contentSections: [
    // 1 — Instant start
    {
      title: "Start from anywhere using Quick Access and Global Shortcuts",
      description: (
        <>
          <p>
            The hardest part is the first step. Press the shortcut, type your
            task, and Quick Access starts a focus session in seconds.
          </p>
          <p>
            No menu diving or setup. You start before the urge to scroll wins.
          </p>
        </>
      ),
      media: {
        src: "/quick-access/addworkspaceortimer.mp4",
        alt: "Quick Access panel starting a task",
      },
      badge: "Fast Launch",
      className: "object-cover",
      feature: featureEnum.QUICK_ACCESS,
    },

    // 2 — Small sprints
    {
      title: "Start momentum in small sprints",
      description: (
        <>
          <p>
            Big tasks feel heavy. Pomodoro breaks work into friendly blocks that
            feel easy to begin.
          </p>
          <p>
            Pick your own work and rest lengths and let Focusmo nudge you when
            it is time to pause or restart.
          </p>
        </>
      ),
      media: {
        src: "/features/pomodoro.mp4",
        alt: "Pomodoro focus cycles",
      },
      badge: "Short Blocks",
      className: "object-cover",
      feature: featureEnum.POMODORO,
    },

    // 3 — Distraction guard
    {
      title: "Keep temptations out",
      description: (
        <>
          <p>
            Social feeds and chat tabs pull you off track. Workspaces mute them
            while you work and open them back up on break.
          </p>
          <p>
            One switch changes rules so you never fight settings while you fight
            procrastination.
          </p>
        </>
      ),
      media: {
        src: "/workspaces/block screen small.png",
        alt: "Workspace blocking social sites",
      },
      badge: "Distraction Guard",
      className: "object-cover",
      feature: featureEnum.WORKSPACES,
    },

    // 4 — Quick rewards
    {
      title: "Earn small wins all day",
      description: (
        <>
          <p>
            Every finished sprint paints a streak bar and drops a gentle reward.
            Small dopamine bumps push you toward the next block.
          </p>
          <p>
            Watch wins pile up and see motivation rise session after session.
          </p>
        </>
      ),
      media: {
        src: "/rewards/streaks.mp4",
        alt: "Streak and reward screen",
      },
      badge: "Motivation Boost",
      className: "object-cover",
      feature: featureEnum.DAILY_REMINDERS, // or your reward feature key
    },
  ],

  /* ───────────────  Integration Layer  ─────────────── */
  integrationSection: {
    title: <>An ecosystem that keeps momentum</>,
    description: (
      <>
        Focusmo logs every session, shows clear progress charts, and reminds you
        when to step back so procrastination never catches up.
      </>
    ),
    media: {
      src: "/features/procrastination-ecosystem.jpg",
      alt: "Focusmo ecosystem for momentum",
    },
    badge: "Integrated Tools",
    className: "object-cover bg-slate-50",

    additionalFeatures: [
      {
        title: "See real work time in your calendar",
        description: (
          <p>
            Focus blocks land straight in Google Calendar or Notion Calendar so
            you see honest effort on the timeline you already trust.
          </p>
        ),
        media: {
          src: "/time-tracking/calendar integration.png",
          alt: "Focus sessions in Google Calendar",
        },
        feature: featureEnum.TIME_TRACKING,
        badge: "Time Proof",
      },
      {
        title: "Spot patterns and fix them",
        description: (
          <p>
            The analytics board shows when you stall and when you fly. Adjust
            your schedule with real data instead of guesswork.
          </p>
        ),
        media: {
          src: "/features/track_focus_time.mp4",
          alt: "Analytics dashboard",
        },
        feature: featureEnum.ANALYTICS,
        badge: "Insight",
      },
      {
        title: "Stay on time for every plan",
        description: (
          <p>
            Full screen countdowns give a final push so you leave on time for
            the next meeting or break.
          </p>
        ),
        media: {
          src: "/calendar events/step3.mp4",
          alt: "Meeting countdown screen",
        },
        feature: featureEnum.NEVER_MISS_MEETINGS,
        badge: "Never Miss a Meeting",
      },
    ],
  },
};
