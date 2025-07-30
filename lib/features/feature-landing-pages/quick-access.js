/**
 * Landing page data for Quick Access Panel feature
 */
import { featureEnum } from "@/lib/features/featureEnum";

export const landingPageData = {
  heroData: {
    title: "Capture notes and tasks",
    subtitle: "from anywhere",
    description:
      "Focusmo's Spotlight-style Quick Access Panel lets you control everything with a single keyboard shortcut.",
    videoSrc: "/quick_access_panel.mp4",
    keyPoints: [
      "Global Keyboard Shortcut",
      "Instant Task Capture",
      "Timer Control From Anywhere",
    ],
    primaryButton: {
      text: "Download for Mac",
      href: "/download",
      icon: "Download",
    },
    secondaryButton: {
      text: "See How It Works",
      href: "#how-it-works",
      icon: "Play",
    },
  },
  contentSections: [
    {
      title: "Eliminate task-switching that kills your momentum",
      description: (
        <>
          <p>
            Context switching is the silent killer of deep work. Every time you
            interrupt your coding, writing, or designing to manage a timer or
            record a task, you lose valuable mental momentum that takes minutes
            to rebuild.
          </p>
          <p>
            The Quick Access Panel appears instantly with a keyboard shortcut
            from any application, letting you capture ideas, start timers, or
            add tasks without ever leaving your workflow, keeping you in the
            productive flow state that leads to your best work.
          </p>
        </>
      ),
      media: {
        src: "/features/quick-access-main.jpg",
        alt: "Quick Access Panel appearing over code editor",
      },
      badge: "Preserve Mental Context",
      className: "object-cover",
    },
    {
      title: "Beat procrastination with frictionless task capture",
      description: (
        <>
          <p>
            Procrastination thrives on friction. When capturing a new idea or a
            task requires multiple clicks, app switching, or complex input
            forms, your brain finds excuses to put it off, leading to forgotten
            commitments and mental clutter that impacts focus.
          </p>
        </>
      ),
      media: {
        src: "/features/quick-task-entry.jpg",
        alt: "Adding a task with natural language in Quick Access Panel",
      },
      badge: "Combat Procrastination",
      className: "object-cover",
    },
    {
      title: "Built for keyboard-first professionals who value efficiency",
      description: (
        <>
          <p>
            For developers, writers, and power users, moving from keyboard to
            mouse is more than an inconvenience, it's a workflow disruption that
            compounds throughout your day, stealing precious minutes and
            breaking concentration.
          </p>
          <p>
            The Quick Access Panel is designed for keyboard-first interaction
            with fuzzy search, command completion, and arrow key navigation.
            Execute complex commands in seconds without hunting through menus or
            lifting your hands from the keyboard.
          </p>
        </>
      ),
      media: {
        src: "/features/keyboard-control.jpg",
        alt: "Keyboard navigation in Quick Access Panel",
      },
      badge: "Keyboard-First Design",
      className: "object-cover",
    },
    {
      title: "Natural language commands for effortless control",
      description: (
        <>
          <p>
            The Quick Access Panel understands natural language, letting you
            control Focusmo with simple, conversational commands. Type "start
            timer for 25 minutes" and watch as the system interprets your intent
            instantly.
          </p>
        </>
      ),
      media: {
        src: "/features/quick-access-commands.jpg",
        alt: "Quick Access Panel with natural language commands",
      },
      badge: "Smart NLP Technology",
      className: "object-cover",
    },
  ],
  integrationSection: {
    title: (
      <>
        Perfect for <br /> Modern Work Patterns
      </>
    ),
    description: (
      <>
        The Quick Access Panel integrates seamlessly with your workflow and
        Focusmo's other features, addressing the specific focus challenges faced
        by tech professionals, entrepreneurs, and students.
      </>
    ),
    media: {
      src: "/features/quick-access-ecosystem.jpg",
      alt: "Quick Access Panel integration with workflow",
    },
    badge: "Integrated Workflow Solution",
    className: "object-cover bg-slate-50",
    // these things are still not ready
    // additionalFeatures: [
    //   {
    //     title: "Control your Pomodoro timer without switching contexts",
    //     description: (
    //       <>
    //         <p>
    //           Manage your focus/break cycles directly from your development
    //           environment or design tool. Start, pause, skip, or check remaining
    //           time on your Pomodoro sessions without ever leaving your current
    //           application.
    //         </p>
    //       </>
    //     ),
    //     media: {
    //       src: "/features/pomodoro.mp4",
    //       alt: "Controlling Pomodoro from Quick Access",
    //     },
    //     feature: featureEnum.POMODORO_TIMER,
    //     badge: "Pomodoro Management",
    //   },
    //   {
    //     title:
    //       "Block distractions instantly when you notice yourself wandering",
    //     description: (
    //       <>
    //         <p>
    //           The moment you catch yourself about to check social media or news
    //           sites, trigger distraction blocking with a quick command. Start
    //           task with workspace using "@workspace" to immediately eliminate
    //           temptations and get back on track.
    //         </p>
    //       </>
    //     ),
    //     media: {
    //       src: "/workspaces.mp4",
    //       alt: "Activating distraction blocking from Quick Access",
    //     },
    //     feature: featureEnum.BLOCKING_DISTRACTIONS,
    //     badge: "Workspaces",
    //   },
    //   {
    //     title: "Check upcoming meetings without disrupting your flow",
    //     description: (
    //       <>
    //         <p>
    //           With a simple "meetings" command, instantly see what's coming up
    //           on your calendar without switching to a calendar app. Get just the
    //           information you need to stay aware of upcoming commitments while
    //           maintaining deep focus.
    //         </p>
    //       </>
    //     ),
    //     media: {
    //       src: "/meeting-alerts.mp4",
    //       alt: "Checking upcoming meetings from Quick Access",
    //     },
    //     feature: featureEnum.NEVER_MISS_MEETINGS,
    //     badge: "Meeting Awareness",
    //   },
    // ],
  },
  faqQuestions: [
    {
      question:
        "What's the default keyboard shortcut for the Quick Access Panel?",
      answer:
        "The default keyboard shortcut is Command+Shift+Space (Mac), but you can customize this to any combination that works best for your workflow in the preferences panel. Many users choose shortcuts that feel natural with their existing development tools or productivity apps.",
    },
    {
      question: "Does the Quick Access Panel work in all applications?",
      answer:
        "Yes, the Quick Access Panel is application-agnostic and works system-wide. Whether you're in your code editor, design software, browser, or any other application, the panel appears instantly with the same keyboard shortcut and provides full functionality.",
    },
    {
      question: "Can I use natural language to create tasks and set timers?",
      answer:
        "Absolutely! The Quick Access Panel understands natural language commands like 'start 25 minute focus session,' 'block Twitter until 5pm,' or 'remind me to call client tomorrow at 10am.' This natural input method makes it incredibly fast to execute commands without memorizing specific syntax.",
    },
    {
      question: "Does the panel learn from my usage patterns?",
      answer:
        "Yes, the Quick Access Panel incorporates intelligent learning that adapts to your workflow. Commands you use frequently will appear higher in suggestions, and the system will recognize patterns in your work habits to offer contextually relevant options based on time of day and your typical routines.",
    },
    {
      question: "Can I create custom commands or shortcuts?",
      answer:
        "Yes, you can create custom commands and shortcuts for your most frequent actions. For example, you might create a 'deep work' command that starts a timer, blocks distracting websites, and sets your status to 'focusing' all at once. These custom workflows can dramatically streamline your productivity system.",
    },
    {
      question: "How does this help with procrastination specifically?",
      answer:
        "The Quick Access Panel addresses procrastination in two key ways: First, by reducing friction in task capture, it prevents the 'I'll write it down later' mentality that leads to forgotten tasks. Second, by making it incredibly easy to start focus sessions or block distractions, it lowers the activation energy required to begin working on challenging tasks.",
    },
  ],
};
