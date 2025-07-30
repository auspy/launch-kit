export const landingPageData = {
  heroData: {
    title: "Appearance Customization",
    subtitle: "A Focus Timer That Feels Like You",
    description:
      "Make Focusmo your own with customizable colors, timer styles, progress bar designs, and themes that match your aesthetic.",
    videoSrc: "/customization.mp4",
    keyPoints: ["Custom Themes", "Visual Harmony", "Personal Expression"],
    primaryButton: {
      text: "Try Pro Features",
      href: "/pricing",
      icon: "Download",
    },
    secondaryButton: {
      text: "See Customization Options",
      href: "#customization-options",
      icon: "Palette",
    },
  },
  contentSections: [
    {
      title: "A productivity tool that matches your style",
      description: (
        <>
          <p>
            The tools we use every day should feel like our own. With extensive
            appearance customization, you can make Focusmo truly yours,
            reflecting your personal style and preferences.
          </p>
          <p>
            Choose from various timer styles, progress bar designs, color
            schemes, and themes to create a focus environment that feels
            comfortable and inspiring to you.
          </p>
        </>
      ),
      media: {
        src: "/features/appearance-customization.jpg",
        alt: "Various Focusmo appearance themes",
      },
      badge: "Your unique style",
    },
    {
      title: "Visual harmony reduces cognitive friction",
      description: (
        <>
          <p>
            When your tools clash visually with your environment, it creates
            subtle cognitive friction. Focusmo's appearance options let you
            create perfect visual harmony with your desktop theme.
          </p>
          <p>
            Whether you prefer dark mode, light mode, or something in between,
            your timer can blend seamlessly with your workspace, reducing visual
            distractions and making it feel like a natural extension of your
            system.
          </p>
        </>
      ),
      media: {
        src: "/features/visual-harmony.jpg",
        alt: "Focusmo blending with desktop environment",
      },
      badge: "Seamless integration",
    },
    {
      title: "Make focus feel more engaging",
      description: (
        <>
          <p>
            Aesthetics can dramatically impact how we feel about the tools we
            use. By personalizing your Focusmo's appearance, you can make the
            act of focusing more appealing and engaging.
          </p>
          <p>
            With beautiful, customized visuals that you enjoy looking at, you'll
            find yourself more drawn to your focus sessions and more likely to
            maintain your productivity practice over time.
          </p>
        </>
      ),
      media: {
        src: "/features/engaging-design.jpg",
        alt: "Engaging timer design options",
      },
      badge: "Focus made beautiful",
    },
  ],
  testimonials: [
    {
      name: "Emily Chen",
      role: "Visual Designer",
      content:
        "As a designer, I need my tools to ${match my aesthetic sensibilities}. Being able to customize Focusmo to complement my workspace has made it ${feel like a natural part of my environment} rather than a distracting element.",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Jason Park",
      role: "Software Developer",
      content:
        "I work in dark mode all day, so having a ${timer that matches my dark theme} is essential. The customization options let me create a ${low-contrast, eye-friendly design} that I can comfortably look at during long coding sessions.",
      imageUrl:
        "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Sarah Miller",
      role: "Content Creator",
      content:
        "The ${ability to change colors and styles} seems like a small thing, but it makes Focusmo feel like my own personal tool. I've created a ${bright, energizing theme} that actually makes me look forward to starting my timer.",
      imageUrl:
        "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop&crop=faces",
    },
  ],
  faqQuestions: [
    {
      question: "What elements of Focusmo can I customize?",
      answer:
        "You can customize nearly every visual aspect, including timer styles (digital, analog, progress bar), color schemes, background patterns or colors, icon styles, font choices, button designs, and notification appearances. You can also save multiple custom themes to switch between.",
    },
    {
      question: "Are there preset themes available?",
      answer:
        "Yes, if you don't want to design everything from scratch, Focusmo includes several professionally designed theme presets including Minimal, Dark, Light, Nature-inspired, High Contrast, and Energetic options. These can also serve as starting points for your own customizations.",
    },
    {
      question: "Will my customizations sync across devices?",
      answer:
        "Yes, with Cloud Sync enabled, your appearance settings and custom themes will synchronize across all your Mac devices, ensuring a consistent experience everywhere you use Focusmo.",
    },
    {
      question: "Can I change the appearance based on time of day?",
      answer:
        "Absolutely. You can set Focusmo to automatically switch between different themes based on time of day, matching your system's light/dark mode, or even based on the type of work you're doing through workspace integration.",
    },
    {
      question: "Will customization affect performance?",
      answer:
        "No, Focusmo's customization system is designed to be lightweight. Even elaborate visual themes won't impact the performance of the app or your system. The customization exists to enhance your experience without adding overhead.",
    },
  ],
};
