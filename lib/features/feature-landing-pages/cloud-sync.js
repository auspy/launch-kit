/**
 * Landing page data for Cloud Sync feature
 */

export const landingPageData = {
  heroData: {
    title: "Cloud Sync",
    subtitle: "Your Focus Data, Everywhere You Go",
    description:
      "Keep your tasks, settings, and focus history synchronized seamlessly across all your Mac devices.",
    videoSrc: "/cloud-sync.mp4",
    keyPoints: ["Multi-Device Sync", "Secure Backup", "Continuous Updates"],
    primaryButton: {
      text: "Try Pro Features",
      href: "/pricing",
      icon: "Download",
    },
    secondaryButton: {
      text: "How It Works",
      href: "#how-it-works",
      icon: "Info",
    },
  },
  contentSections: [
    {
      title: "Seamless transitions between devices",
      description: (
        <>
          <p>
            Start a focus session on your work Mac, continue it on your personal
            MacBook. Cloud Sync keeps your focus data consistent across all your
            devices.
          </p>
          <p>
            Tasks, timers, settings, and history automatically synchronize in
            real-time, ensuring you have the same productive experience no
            matter which device you're using.
          </p>
        </>
      ),
      media: {
        src: "/features/cloud-sync-devices.jpg",
        alt: "Synchronization across multiple Mac devices",
      },
      badge: "Work anywhere",
    },
    {
      title: "Never lose your focus data",
      description: (
        <>
          <p>
            Cloud Sync serves as an automatic backup of your focus history,
            tasks, and settings. If you get a new Mac or need to reinstall your
            system, your data remains safe.
          </p>
          <p>
            Simply sign in to your Focusmo account on your new device, and all
            your focus history, custom settings, and tasks will be restored
            instantly.
          </p>
        </>
      ),
      media: {
        src: "/features/cloud-sync-backup.jpg",
        alt: "Data backup and restoration",
      },
      badge: "Peace of mind",
    },
    {
      title: "Real-time updates across your ecosystem",
      description: (
        <>
          <p>
            Mark a task complete on one device, and it's instantly updated
            everywhere. Adjust your Pomodoro settings on your iMac, and they're
            immediately available on your MacBook.
          </p>
          <p>
            Cloud Sync works silently in the background, ensuring your focus
            ecosystem stays in perfect harmony without requiring any manual
            intervention.
          </p>
        </>
      ),
      media: {
        src: "/features/cloud-sync-realtime.jpg",
        alt: "Real-time synchronization demonstration",
      },
      badge: "Instant updates",
    },
  ],
  testimonials: [
    {
      name: "Martin Brooks",
      role: "Remote Developer",
      content:
        "I work between my home office and cafes throughout the week. Cloud Sync means my ${tasks and timer settings follow me} anywhere I go. I just ${pick up exactly where I left off}, regardless of which Mac I'm using.",
      imageUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Julia Mendez",
      role: "Digital Nomad",
      content:
        "When my MacBook died unexpectedly during travel, I thought I'd lost weeks of task organization. But after getting a replacement, ${all my data was restored} within minutes of signing in. My ${entire productivity system} was intact!",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Terrence Washington",
      role: "UI/UX Designer",
      content:
        "I have a desktop for intensive design work and a laptop for client meetings. The seamless sync means I can ${check off completed tasks} in meetings and have my ${workspaces perfectly mirrored} across both machines. Essential for my workflow.",
      imageUrl:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces",
    },
  ],
  faqQuestions: [
    {
      question: "Is my data secure in the cloud?",
      answer:
        "Yes, Focusmo uses state-of-the-art encryption for all synchronized data. Your information is encrypted both during transfer and at rest in our secure cloud infrastructure. We never access your personal productivity data.",
    },
    {
      question: "Does Cloud Sync work offline?",
      answer:
        "Focusmo works completely offline, with Cloud Sync automatically resuming when you reconnect to the internet. Any changes made while offline are queued and synchronized once connectivity is restored.",
    },
    {
      question: "How much data can I sync across devices?",
      answer:
        "Focusmo Pro includes unlimited cloud storage for your productivity data. This includes complete historical records of focus sessions, all tasks (even completed ones), and all custom settings.",
    },
    {
      question: "What happens if there's a conflict between devices?",
      answer:
        "If you make changes to the same item on multiple devices while offline, our smart conflict resolution will preserve both versions when possible or use the most recent changes as the source of truth.",
    },
    {
      question: "Can I control which data gets synchronized?",
      answer:
        "Yes, you can customize synchronization settings to include or exclude specific data types. For example, you might choose to sync tasks but not history, or sync everything except certain workspace configurations.",
    },
  ],
};
