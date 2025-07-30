/**
 * Landing page data for Keyboard Shortcuts feature
 */

export const landingPageData = {
  heroData: {
    title: "Global Keyboard Shortcuts",
    subtitle: "Control Focusmo From Anywhere",
    description:
      "Access any feature instantly with customizable global keyboard shortcuts, keeping your hands on the keyboard and mind on your work.",
    videoSrc: "/shortcuts.mp4",
    keyPoints: ["Fully Customizable", "System-Wide", "No Mouse Required"],
    primaryButton: {
      text: "Download Free",
      href: "/download",
      icon: "Download",
    },
    secondaryButton: {
      text: "View Shortcuts",
      href: "#shortcut-list",
      icon: "Keyboard",
    },
  },
  contentSections: [
    {
      title: "Control Focusmo without leaving your keyboard",
      description: (
        <>
          <p>
            Global keyboard shortcuts put the full power of Focusmo at your
            fingertips. Start, pause, or reset timers, add tasks, or open the
            quick access panel without ever touching your mouse.
          </p>
          <p>
            These shortcuts work system-wide, so you can control Focusmo from
            any application you're working in, maintaining your flow without
            switching windows.
          </p>
        </>
      ),
      media: {
        src: "/features/keyboard-shortcuts-main.jpg",
        alt: "Global keyboard shortcuts demonstration",
      },
      badge: "Stay in flow",
    },
    {
      title: "Customize every shortcut to match your workflow",
      description: (
        <>
          <p>
            Everyone's keyboard habits are different. That's why every shortcut
            in Focusmo can be customized to match your preferences and avoid
            conflicts with other applications.
          </p>
          <p>
            Whether you prefer function keys, letter combinations, or number
            keys, you can create a shortcut system that feels natural and
            intuitive for your specific workflow.
          </p>
        </>
      ),
      media: {
        src: "/features/shortcuts-customization.jpg",
        alt: "Keyboard shortcut customization interface",
      },
      badge: "Make it yours",
    },
    {
      title: "For power users who value efficiency",
      description: (
        <>
          <p>
            Every time you move your hand from keyboard to mouse, it breaks your
            concentration and slows you down. Our keyboard shortcuts eliminate
            these micro-disruptions.
          </p>
          <p>
            With a comprehensive set of shortcuts covering every feature, you
            can operate Focusmo with maximum efficiency, keeping your attention
            on your work rather than the tool.
          </p>
        </>
      ),
      media: {
        src: "/features/shortcuts-efficiency.jpg",
        alt: "Power user using keyboard shortcuts",
      },
      badge: "Maximum efficiency",
    },
  ],
  testimonials: [
    {
      name: "Alan Zhang",
      role: "Software Engineer",
      content:
        "As a vim user, I ${live and die by keyboard shortcuts}. Being able to start a timer with Cmd+Shift+T or add a task with Cmd+Shift+A without leaving my code editor has ${saved countless context switches} every day.",
      imageUrl:
        "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Mira Johnson",
      role: "Content Writer",
      content:
        "The ability to ${customize every shortcut} made all the difference. I mapped Focusmo controls to match my writing software, creating a consistent experience. Now I can ${control my timer without breaking creative flow}.",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Phillip Morris",
      role: "Financial Analyst",
      content:
        "When I'm deep in spreadsheets, moving to the mouse breaks my concentration. With Focusmo's shortcuts, I can ${control everything without leaving Excel}. Hitting Cmd+Option+B for a short break has become ${second nature}.",
      imageUrl:
        "https://images.unsplash.com/photo-1553267751-1c148a7280a1?w=150&h=150&fit=crop&crop=faces",
    },
  ],
  faqQuestions: [
    {
      question: "What are the default keyboard shortcuts?",
      answer:
        "Focusmo comes with intuitive defaults like Cmd+Shift+Space for the Quick Access Panel, Cmd+Shift+T for timer controls, Cmd+Shift+A for adding tasks, and Cmd+Shift+B for toggling breaks. All shortcuts can be customized to your preference.",
    },
    {
      question: "Can I create shortcuts for specific timer durations?",
      answer:
        "Yes, you can create custom shortcuts for specific timer durations, such as starting a 25-minute Pomodoro or a 5-minute break directly. This is perfect for users who frequently switch between different time intervals.",
    },
    {
      question: "What if my shortcuts conflict with other applications?",
      answer:
        "Focusmo will alert you about potential conflicts with common applications. If a conflict occurs, you can easily reassign shortcuts through the settings panel. The system is designed to work harmoniously with your existing shortcuts.",
    },
    {
      question: "Can I temporarily disable keyboard shortcuts?",
      answer:
        "Yes, you can toggle shortcuts on/off with a master switch for situations where you need to avoid accidental triggers, such as when giving presentations or playing games that use many keyboard combinations.",
    },
    {
      question: "Are keyboard shortcuts available on all plans?",
      answer:
        "Yes, global keyboard shortcuts are available on all Focusmo plans, including the free version. We believe efficient keyboard control is essential for maintaining productivity regardless of subscription level.",
    },
  ],
};
