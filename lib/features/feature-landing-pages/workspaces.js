import { featureEnum } from "@/lib/features/featureEnum";

export const landingPageData = {
  heroData: {
    title: "Reclaim your focus",
    subtitle: "by blocking distractions",
    description: (
      <>
        Focusmo for macOS{" "}
        <strong>
          {" "}
          blocks distracting websites and apps during your focus sessions
        </strong>
        , helping you resist temptations and stay on track with what truly
        matters.
      </>
    ),
    videoSrc: "/website-blocking.mp4",
    keyPoints: [
      "Custom Blocking Rules",
      "Scheduled Blocking Times",
      "Distraction-Free Environments",
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
      title: "Stop fighting willpower battles you can't win",
      description: (
        <>
          <p>
            It's not about lack of discipline—your brain is literally wired to
            seek novelty and distraction. Focusmo creates a protective barrier
            between you and the digital temptations specifically engineered to
            hijack your attention.
          </p>
          <p>
            Instead of exhausting your willpower through constant resistance,
            our intelligent blocking system removes the temptation entirely,
            creating a distraction-free environment where deep focus becomes the
            path of least resistance.
          </p>
        </>
      ),
      media: {
        src: "/features/website-blocking-main.jpg",
        alt: "Website and app blocking interface",
      },
      badge: "Willpower Amplifier",
      className: "object-cover",
    },
    {
      title: "Customize blocking to match your unique challenges",
      description: (
        <>
          <p>
            Not everyone struggles with the same distractions. Focusmo lets you
            create personalized blocking rules for the specific websites and
            applications that derail your productivity—whether it's social
            media, news sites, email, games, or any other digital temptation.
          </p>
          <p>
            Fine-tune your blocking settings with flexible options like timed
            access, scheduled blocking periods, and allowlist
            capabilities—ensuring the system works with your workflow rather
            than against it.
          </p>
        </>
      ),
      media: {
        src: "/features/blocking-customization.jpg",
        alt: "Custom blocking rule configuration",
      },
      badge: "Personalized Protection",
      className: "object-cover",
    },
    {
      title: "Break the social media scrolling cycle",
      description: (
        <>
          <p>
            34% of our users identified social media as their primary focus
            challenge. Focusmo's specialized social media blocking targets these
            particularly addictive platforms with enhanced blocking capabilities
            designed to break the checking habit.
          </p>
          <p>
            Instead of endless scrolling, you'll be gently redirected to your
            current task when temptation strikes. Over time, this reinforces
            healthier digital habits and reduces the automatic reaching for
            distractions when work gets challenging.
          </p>
        </>
      ),
      media: {
        src: "/features/social-media-blocking.jpg",
        alt: "Social media blocking in action",
      },
      badge: "Break Free from Social Media",
      className: "object-cover",
    },
    {
      title: "Schedule distraction-free periods automatically",
      description: (
        <>
          <p>
            Consistency is key to productivity. Focusmo allows you to schedule
            regular distraction-free periods that activate automatically—perfect
            for morning focus rituals, deep work sessions, or creating
            boundaries between work and personal time.
          </p>
          <p>
            Set it once, and let Focusmo handle the rest. Your blocking
            schedules can be customized for different days of the week,
            automatically adapting to your ideal routine and helping you
            establish consistent productive habits.
          </p>
        </>
      ),
      media: {
        src: "/features/scheduled-blocking.jpg",
        alt: "Scheduled blocking calendar interface",
      },
      badge: "Automatic Protection",
      className: "object-cover",
    },
  ],
  integrationSection: {
    title: (
      <>
        Block Distractions <br /> When It Matters Most
      </>
    ),
    description: (
      <>
        Website and app blocking becomes even more powerful when integrated with
        Focusmo's other productivity features—creating automated, intelligent
        protection that adapts to your workflow.
      </>
    ),
    media: {
      src: "/features/blocking-ecosystem.jpg",
      alt: "Website blocking integrated with other features",
    },
    badge: "Smart Distraction Defense",
    className: "object-cover bg-slate-50",
    additionalFeatures: [
      {
        title: "Block distractions during Pomodoro work sessions",
        description: (
          <>
            <p>
              Automatically activate blocking during Pomodoro work intervals,
              then regain access during breaks. This creates a natural rhythm
              between focused work and momentary access to communications or
              relaxation sites—exactly when each is appropriate.
            </p>
          </>
        ),
        media: {
          src: "/features/pomodoro.mp4",
          alt: "Pomodoro timer with automatic blocking",
        },
        feature: featureEnum.POMODORO_TIMER,
        badge: "Focus-Break Balance",
      },
      {
        title: "Different projects, different blocking rules",
        description: (
          <>
            <p>
              With Workspaces, you can create multiple blocking profiles for
              different types of work. Writing mode might block social media but
              allow research sites, while coding mode might block both but
              permit documentation resources—perfect context-switching for tech
              professionals.
            </p>
          </>
        ),
        media: {
          src: "/workspaces.mp4",
          alt: "Workspace-specific blocking rules",
        },
        feature: featureEnum.WORKSPACES,
        badge: "Context-Specific Blocking",
      },
      {
        title: "See how much time you've saved from distractions",
        description: (
          <>
            <p>
              Our analytics track how often blocking has prevented distraction
              attempts, showing you exactly how much focused time you've
              reclaimed. This data provides powerful motivation as you see the
              cumulative impact of avoiding digital distractions.
            </p>
          </>
        ),
        media: {
          src: "/track_focus_time.mp4",
          alt: "Analytics showing time saved from distractions",
        },
        feature: featureEnum.ANALYTICS,
        badge: "Quantified Focus Improvement",
      },
    ],
  },
  testimonials: [
    {
      name: "Alex Chen",
      role: "Software Engineer",
      content:
        "As a developer, I need access to documentation sites but ${not social media}. Being able to create custom rules that block only what distracts me has ${increased my productive coding time by 40%}. The automatic blocking during Pomodoro sessions is perfect.",
      imageUrl:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Sophia Rodriguez",
      role: "Startup Founder",
      content:
        "The ${scheduled blocking} feature has been life-changing. I automatically block all distractions from 9-12 each morning for deep work. My team knows this is my ${creation time}, and I've launched two new product features since implementing this routine.",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Jordan Williams",
      role: "Computer Science Student",
      content:
        "With my ADHD, I would constantly ${check social media without even realizing it}. Focusmo's blocking has helped me stay on task during study sessions. I'm ${completing assignments days before deadlines} now instead of the night before.",
      imageUrl:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Mira Patel",
      role: "UX Designer",
      content:
        "I needed something that would block Slack and email during my creative time, but still let me access design resources. The ${custom blocking rules} give me exactly that flexibility. My ${design thinking has improved dramatically} without constant interruptions.",
      imageUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "David Kim",
      role: "Marketing Strategist",
      content:
        "The irony of my job is that I need to ${research social media trends} but not get sucked into them. The timed access feature is perfect—I get 20 minutes of research time, then sites lock again. My ${productivity has doubled} while still staying informed.",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Rebecca Taylor",
      role: "Content Creator",
      content:
        "The ${analytics showing blocked attempts} was eye-opening. I tried to access blocked sites 47 times in one day without thinking! Now I'm much more aware of my habits, and that number drops each week. My ${content production has increased 30%}.",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
    },
  ],
  faqQuestions: [
    {
      question: "How does the website and app blocking work?",
      answer:
        "Focusmo uses a advanced system-level blocking that prevents access to distracting websites and applications during your focus sessions. When you try to access a blocked site or app, you'll see a friendly reminder that you're in focus mode. The blocking can be customized with different levels of strictness—from gentle nudges to complete lockout—depending on your preferences.",
    },
    {
      question: "Can I customize which websites and apps are blocked?",
      answer:
        "Absolutely. Focusmo gives you complete control over your blocking list. You can block specific websites, entire categories (like social media or news), or specific applications. You can also create exceptions for work-related sites or tools you need. The system can even suggest common distractions to block based on your usage patterns.",
    },
    {
      question: "What if I need temporary access to a blocked site?",
      answer:
        "Focusmo offers several options for temporary access. You can request a timed break (e.g., 5 minutes of access), add a site to your allowlist temporarily, or pause blocking briefly. These options provide flexibility while still maintaining accountability—each exception is logged so you can review your patterns later.",
    },
    {
      question: "Can blocking be scheduled for specific times?",
      answer:
        "Yes, you can schedule blocking to activate automatically at specific times. For example, you might want to block social media during work hours (9am-5pm) on weekdays but allow access on evenings and weekends. The scheduler supports complex patterns like 'Every Monday, Wednesday, and Friday from 10am-2pm' to match your unique routine.",
    },
    {
      question: "Will this slow down my browsing or computer performance?",
      answer:
        "No, Focusmo's blocking system is designed to be lightweight and efficient. It runs in the background with minimal resource usage and won't slow down your browsing experience or overall computer performance. The system is optimized to provide powerful blocking without any noticeable impact on your system.",
    },
    {
      question: "Can I use this for parental controls or team productivity?",
      answer:
        "While Focusmo is primarily designed for personal productivity, many parents and team leaders use it to help establish healthy digital boundaries. For team settings, each team member would need to install Focusmo on their own device, but workspace configurations can be shared to ensure consistent blocking rules across the team.",
    },
  ],
};
