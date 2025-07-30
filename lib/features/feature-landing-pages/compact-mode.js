export const landingPageData = {
  heroData: {
    title: "Compact Mode",
    subtitle: "Focusmo That Stays Out of Your Way",
    description:
      "Keep your dock clean while still maintaining quick access to Focusmo through the menu bar.",
    videoSrc: "/compact-mode.mp4",
    keyPoints: ["Menu Bar Access", "Clean Dock", "Minimal Presence"],
    primaryButton: {
      text: "Try Pro Features",
      href: "/pricing",
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
      title: "Keep your dock clean and distraction-free",
      description: (
        <>
          <p>
            A cluttered dock can be visually distracting and make it harder to
            find the apps you need. Compact Mode hides Focusmo's dock icon when
            not in use, reducing visual noise.
          </p>
          <p>
            This keeps your workspace clean and minimalist while still providing
            all the focus-enhancing benefits of the app through a subtle menu
            bar icon.
          </p>
        </>
      ),
      media: {
        src: "/features/compact-mode-dock.jpg",
        alt: "Clean dock with hidden Focusmo icon",
      },
      badge: "Visual simplicity",
    },
    {
      title: "Quick access from anywhere via the menu bar",
      description: (
        <>
          <p>
            The menu bar icon provides instant access to Focusmo's core features
            - start a timer, add a task, or check your progress with a single
            click from any application.
          </p>
          <p>
            The streamlined menu gives you just what you need without
            overwhelming options, making it perfect for quick interactions that
            don't disrupt your workflow.
          </p>
        </>
      ),
      media: {
        src: "/features/menu-bar-access.jpg",
        alt: "Menu bar access to Focusmo",
      },
      badge: "Always available",
    },
    {
      title: "Focusmo that respects your desktop space",
      description: (
        <>
          <p>
            Some productivity apps demand constant attention with large windows
            or persistent icons. Compact Mode is built on the philosophy that
            the best productivity tool is one that helps without getting in your
            way.
          </p>
          <p>
            Focusmo works silently in the background, tracking your focus time
            and managing your tasks while maintaining a minimal presence on your
            desktop.
          </p>
        </>
      ),
      media: {
        src: "/features/compact-presence.jpg",
        alt: "Minimal desktop presence example",
      },
      badge: "Background helper",
    },
  ],
  testimonials: [
    {
      name: "Andrew Peterson",
      role: "Graphic Designer",
      content:
        "As someone who keeps a ${meticulously organized desktop}, I love that I can hide the dock icon. Focusmo stays in my menu bar, ${ready when I need it} but completely out of the way when I'm deep in creative work.",
      imageUrl:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Linda Choi",
      role: "Technical Writer",
      content:
        "The ${menu bar access} is perfect for quick timer checks without breaking concentration. I don't need a full window for that! It's a ${small detail that makes a big difference} in maintaining flow while writing documentation.",
      imageUrl:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Marco Rossi",
      role: "Indie Developer",
      content:
        "I run so many dev tools that my dock was becoming unusable. Compact Mode lets me ${keep Focusmo running all day} without contributing to the clutter. It's ${there when I need it}, invisible when I don't.",
      imageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces",
    },
  ],
  faqQuestions: [
    {
      question: "Can I switch between compact mode and normal mode?",
      answer:
        "Yes, you can easily toggle between compact mode and normal mode through the preferences. This gives you flexibility to use the full application window when managing tasks or reviewing analytics, and switch to compact mode when you want to minimize distractions.",
    },
    {
      question: "Will I still get notifications in compact mode?",
      answer:
        "Absolutely. All notifications function normally in compact mode, including timer completions, meeting alerts, and scheduled reminders. The notification style follows your preferences regardless of whether the dock icon is visible.",
    },
    {
      question: "Does compact mode affect any features?",
      answer:
        "Compact mode only changes how you access Focusmo, not what it can do. All features remain fully functional, including timers, task management, analytics, and integrations. The menu bar provides quick access to essential functions.",
    },
    {
      question: "Will Focusmo start in compact mode automatically?",
      answer:
        "You can set Focusmo to launch in compact mode by default. It can also remember your last state, so if you closed it in compact mode, it will open that way next time. This behavior is customizable in preferences.",
    },
    {
      question: "Can I use keyboard shortcuts in compact mode?",
      answer:
        "Yes, all global keyboard shortcuts work identically in compact mode. In fact, many users combine compact mode with keyboard shortcuts for a completely mouse-free, distraction-free productivity system.",
    },
  ],
};
