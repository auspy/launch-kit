export const landingPageData = {
  heroData: {
    title: "Notification Styles",
    subtitle: "Alerts That Respect Your Focus",
    description:
      "Choose from various notification styles to match your work preferences, including subtle alerts and fullscreen focus cues.",
    videoSrc: "/notifications.mp4",
    keyPoints: ["Customizable Alerts", "Focus-Aware", "Distraction Balance"],
    primaryButton: {
      text: "Try Pro Features",
      href: "/pricing",
      icon: "Download",
    },
    secondaryButton: {
      text: "See Notification Styles",
      href: "#notification-styles",
      icon: "Bell",
    },
  },
  contentSections: [
    {
      title: "Notifications that match your focus needs",
      description: (
        <>
          <p>
            Everyone's focus style is different. Some need prominent alerts to
            break hyperfocus, while others need gentle nudges that won't disrupt
            their flow state.
          </p>
          <p>
            Focusmo offers multiple notification styles - from subtle
            unobtrusive alerts to attention-grabbing fullscreen transitions -
            letting you choose the right level of interruption for different
            situations.
          </p>
        </>
      ),
      media: {
        src: "/features/notification-styles.jpg",
        alt: "Different notification style examples",
      },
      badge: "Your focus, your choice",
    },
    {
      title: "Different alerts for different contexts",
      description: (
        <>
          <p>
            Break completions might need prominent alerts, while upcoming
            meetings could use gentle reminders. Focusmo lets you customize
            notifications for each type of event.
          </p>
          <p>
            Set more noticeable alerts for critical events like meeting
            reminders, and subtle notifications for regular timer updates,
            creating the perfect balance for your workflow.
          </p>
        </>
      ),
      media: {
        src: "/features/context-notifications.jpg",
        alt: "Context-specific notification settings",
      },
      badge: "Contextual awareness",
    },
    {
      title: "Find your perfect notification balance",
      description: (
        <>
          <p>
            Too many notifications create distraction and stress, but missing
            important alerts disrupts your productivity. Finding the right
            balance is essential.
          </p>
          <p>
            With Focusmo's customizable notification system, you can fine-tune
            exactly when, how, and for what you receive alerts, creating an
            environment that keeps you informed without overwhelming your
            attention.
          </p>
        </>
      ),
      media: {
        src: "/features/notification-balance.jpg",
        alt: "Notification balance configuration",
      },
      badge: "Attention harmony",
    },
  ],
  testimonials: [
    {
      name: "Noah Taylor",
      role: "Game Developer",
      content:
        "I get so deep in code that I need the ${fullscreen break notifications} to actually notice them. Being able to customize this saved my wrists from RSI by ensuring I ${actually take breaks} even during intense development sessions.",
      imageUrl:
        "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Emma Rodriguez",
      role: "Financial Analyst",
      content:
        "The ${subtle notification style} is perfect when I'm working with clients. I get gentle reminders about upcoming meetings without ${flashy alerts that would look unprofessional} during presentations or discussions.",
      imageUrl:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "William Chen",
      role: "Freelance Writer",
      content:
        "Being able to set ${different notification styles for different times of day} has been revolutionary. Subtle during deep work, more noticeable during administrative time. It's like having a ${personal assistant that knows my schedule}.",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    },
  ],
  faqQuestions: [
    {
      question: "What notification styles are available?",
      answer:
        "Focusmo offers several notification styles including standard macOS notifications, subtle menu bar indicators, gentle on-screen overlays, moderate alert windows, and full-screen transition notices for maximum attention when needed.",
    },
    {
      question: "Can I customize notifications for different events?",
      answer:
        "Yes, you can set different notification styles for various events like timer completions, break reminders, meeting alerts, and task deadlines. Each can have its own style, sound, and prominence level.",
    },
    {
      question: "Do notifications respect Do Not Disturb mode?",
      answer:
        "By default, Focusmo respects your system-wide Do Not Disturb settings. However, you can optionally allow critical notifications (like meeting alerts) to bypass DND if needed for your workflow.",
    },
    {
      question: "Can notifications change based on my focus state?",
      answer:
        "Yes, with the Pro version, Focusmo can intelligently adjust notification styles based on your detected focus state. If you're in deep focus, it may use more prominent alerts, while using subtler notifications when you're already task-switching.",
    },
    {
      question: "Are notification sounds customizable too?",
      answer:
        "Absolutely. You can choose from our library of notification sounds designed for optimal attention without being jarring, or import your own custom sounds for each notification type.",
    },
  ],
};
