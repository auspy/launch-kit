/**
 * Landing page data for Pomodoro Timer feature
 */

import { featureEnum } from "@/lib/features/featureEnum";

export const landingPageData = {
  heroData: {
    title: "Stay productive longer",
    subtitle: "with strategic breaks",
    description: (
      <span className="text-start">
        Focusmo's pomodoro timer helps you{" "}
        <strong> beat burnout and build momentum</strong> on autopilot using
        timed work sessions and breaks.
      </span>
    ),
    videoSrc: "/features/pomodoro.mp4",
    keyPoints: [
      "Customizable Work/Break Periods",
      "Smart Break Management",
      "Detailed Analytics",
    ],
    primaryButton: {
      text: "Download for Mac",
      href: "/download",
      icon: "Download",
    },
    secondaryButton: {
      text: "Learn about the Science",
      href: "https://www.verywellmind.com/pomodoro-technique-history-steps-benefits-and-drawbacks-6892111",
      target: "_blank",
      rel: "noopener noreferrer",
      icon: "BookOpen",
    },
  },
  contentSections: [
    {
      title: "Balance focus and rest automatically with Pomodoro",
      description: (
        <>
          <span>
            Stop burning out and start thriving. Our intelligent Pomodoro timer
            creates the perfect balance between intense focus and essential
            recovery, working with your brain's natural rhythm instead of
            against it.
          </span>
          <span>
            No more losing hours to unfocused work or forgetting to take breaks.
            Focusmo gently guides you through customizable work sprints and
            rejuvenating breaks, maintaining your energy and attention
            throughout the entire day.
          </span>
        </>
      ),
      media: {
        src: "/features/pomodoro-main.jpg",
        alt: "Focusmo Pomodoro timer interface showing work session",
      },
      badge: "Stop Burnout",
      className: "object-cover",
    },
    {
      title: "Work smarter with proven time management",
      description: (
        <>
          <span>
            The struggle to maintain focus isn't your fault—it's how your brain
            is wired. The Pomodoro Technique works because it aligns with your
            natural attention cycles, helping you beat distractions and mental
            fatigue.
          </span>
          <span>
            Instead of fighting against attention dips, Focusmo's implementation
            harnesses these natural rhythms, creating a sustainable productivity
            system that prevents burnout while maximizing your most focused
            hours.
          </span>
        </>
      ),
      media: {
        src: "/features/pomodoro-science.jpg",
        alt: "Visualization of focus cycles and productivity patterns",
      },
      badge: "Science-Backed Methodology",
      className: "object-cover",
    },
    {
      title: "Customizable work and break periods",
      description: (
        <>
          <span>
            Everyone's focus pattern is unique. That's why our Pomodoro system
            adapts to you, not the other way around. Whether you thrive in
            traditional 25-minute sessions or need longer deep work periods,
            Focusmo flexes to match your style.
          </span>
          <span>
            Customize every aspect—work duration, break lengths, session counts,
            and notification styles—creating a personalized focus system that
            feels natural and helps you tackle your specific productivity
            challenges.
          </span>
        </>
      ),
      media: {
        src: "/features/pomodoro-customize.jpg",
        alt: "Pomodoro customization settings with various options",
      },
      badge: "Personalized Experience",
      className: "object-cover",
    },
    {
      title: "See your focus transform over time using analytics",
      description: (
        <>
          <span>
            "Am I making progress?" is the question that plagues every
            productivity journey. Focusmo eliminates that uncertainty by showing
            your focus improvements with clear, motivating visualizations.
          </span>
          <span>
            Track completed sessions, analyze your focus patterns, identify your
            golden hours of productivity, and watch as your concentration
            ability strengthens day by day. Transform abstract "focus work" into
            concrete, measurable progress.
          </span>
        </>
      ),
      media: {
        src: "/features/pomodoro-stats.jpg",
        alt: "Analytics dashboard showing Pomodoro session statistics",
      },
      badge: "Data-Driven Improvement",
      className: "object-cover",
      feature: featureEnum.ANALYTICS,
    },
  ],
  integrationSection: {
    title: (
      <>
        Focusmo Makes <br /> Pomodoro Even Better
      </>
    ),
    description: (
      <>
        Focusmo's Pomodoro timer is powerful on its own, but unlike standalone
        timers, Focusmo creates a complete ecosystem that works together to
        maximize your concentration.
      </>
    ),
    media: {
      src: "/features/pomodoro-integrations.jpg",
      alt: "Focusmo's integrated features working together",
    },
    badge: "Seamless Focus Ecosystem",
    className: "object-cover bg-slate-50",
    additionalFeatures: [
      {
        title: "Floating timer that stays visible everywhere",
        description: (
          <>
            <span>
              Keep your Pomodoro rhythm visible at all times with our
              non-intrusive floating timer. It stays on top of all applications
              while you work across multiple windows, documents, or monitors,
              maintaining time awareness without breaking your focus.
            </span>
          </>
        ),
        media: {
          src: "/follow.mp4",
          alt: "Floating timer staying visible across applications",
        },
        feature: featureEnum.FLOATING_TIMER,
        badge: "Floating Timer",
      },
      {
        title: "Block apps and websites during work sessions",
        description: (
          <>
            <span>
              Automatically block distracting websites and apps during Pomodoro
              work intervals, then regain access during breaks. This natural
              boundary between focus and relaxation helps you maintain deeper
              concentration when it matters most.
            </span>
          </>
        ),
        media: {
          src: "/workspaces.mp4",
          alt: "Distraction blocking during Pomodoro work sessions",
        },
        feature: featureEnum.WORKSPACES,
        badge: "Workspaces",
      },
      {
        title: "Track all focus sessions in your personal calendar",
        description: (
          <>
            <span>
              Automatically log Pomodoro sessions to your favorite calendar.
              Focusmo tracks all your events in apple calendar for visual
              productivity tracking.
              <br />
              <br />
              <span className="text-sm text-gray-450">
                (You can choose to disable this feature.)
              </span>
            </span>
          </>
        ),
        media: {
          src: "/calendar.mp4",
          alt: "Calendar integration with Pomodoro sessions",
        },
        feature: featureEnum.CALENDAR_INTEGRATION,
        badge: "Calendar Integration",
      },
      {
        title: "Never miss important meetings even during deep work",
        description: (
          <>
            <span>
              Stay focused without missing important commitments. Focusmo's
              calendar integration provides fullscreen notifications before the
              meetings ensuring you're aware of upcoming meetings while
              maintaining your deep work state.
            </span>
          </>
        ),
        media: {
          src: "/calendar.mp4",
          alt: "Calendar integration with Pomodoro sessions",
        },
        feature: featureEnum.NEVER_MISS_MEETINGS,
        badge: "Never Miss Meetings",
      },
    ],
  },
  // comparisonData: {
  //   features: [
  //     {
  //       name: "Customizable Work/Break Periods",
  //       description:
  //         "Ability to adjust work and break durations to your preference",
  //       focusMode: true,
  //       basic: "Limited",
  //       forest: true,
  //       tomato: false,
  //     },
  //     {
  //       name: "Distraction Blocking",
  //       description:
  //         "Block distracting websites and apps during work sessions",
  //       focusMode: true,
  //       basic: false,
  //       forest: "Limited",
  //       tomato: false,
  //     },
  //     {
  //       name: "Session Statistics",
  //       description: "Track and analyze your focus sessions over time",
  //       focusMode: true,
  //       basic: false,
  //       forest: true,
  //       tomato: "Basic",
  //     },
  //     {
  //       name: "Desktop App",
  //       description: "Native desktop experience with system integration",
  //       focusMode: true,
  //       basic: false,
  //       forest: false,
  //       tomato: "Web only",
  //     },
  //     {
  //       name: "Cross-Device Sync",
  //       description: "Synchronize your data across multiple devices",
  //       focusMode: true,
  //       basic: false,
  //       forest: "Premium",
  //       tomato: false,
  //     },
  //   ],
  //   competitors: [
  //     {
  //       id: "basic",
  //       name: "Basic Timer Apps",
  //       summary: "Limited Features",
  //     },
  //     {
  //       id: "forest",
  //       name: "Forest App",
  //       summary: "Gamified Focus",
  //     },
  //     {
  //       id: "tomato",
  //       name: "TomatoTimer",
  //       summary: "Web-Only Solution",
  //     },
  //   ],
  // },
  testimonials: [
    {
      name: "Akiko Tanaka",
      role: "Software Developer",
      content:
        "After experimenting for a couple weeks, I found that ${longer focus blocks} with ${shorter breaks} match my coding rhythm perfectly. I wasn't expecting it, but my ${pull requests have fewer bugs} now that I'm not trying to code for 3 hours straight.",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Carlos Rodriguez",
      role: "Content Creator",
      content:
        "With my ADHD, I always felt timing systems were too restrictive. This is the ${first app I've stuck with for more than a month}. Yesterday I finished editing a video that would normally take me three days!",
      imageUrl:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Sarah O'Connor",
      role: "Graduate Student",
      content:
        "My thesis advisor was shocked when I showed him how much I'd written in just two weeks. The ${structured approach} helped me ${avoid that paralysis} that comes from staring at a blank page.",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Raj Patel",
      role: "Product Manager",
      content:
        "Used to power through prep for our weekly demos until midnight, thinking that made me productive. Now I ${take actual breaks} and somehow get everything done by 6pm. My wife has stopped complaining about me being a zombie on weekends.",
      imageUrl:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Mei Lin",
      role: "Freelance Illustrator",
      content:
        "My wrist pain from marathon drawing sessions was getting unbearable. Started using this to ${force myself to take breaks} and not only has the pain subsided, but my ${art quality improved}. Just finished a project ahead of schedule!",
      imageUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Thomas Okonkwo",
      role: "High School Teacher",
      content:
        "Grading papers used to take my entire Sunday. Now I break it into ${manageable chunks} throughout the weekend and actually have time for myself. One of my students even asked why I've been ${less cranky} during first period!",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
  ],
  faqQuestions: [
    {
      question: "What is the Pomodoro Technique?",
      answer:
        "The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are known as 'pomodoros', the plural in English of the Italian word pomodoro (tomato), after the tomato-shaped kitchen timer that Cirillo used as a university student.",
    },
    {
      question: "How do I use the Pomodoro Timer in Focusmo?",
      answer:
        "Simply select a task you want to focus on, set your desired work interval (default is 25 minutes), and click Start. The timer will count down, and when it reaches zero, it will alert you to take a break. After your break, it will prompt you to start another work session. You can customize all timings in the settings.",
    },
    {
      question: "Can I customize the work and break durations?",
      answer:
        "Yes! Focusmo allows you to fully customize your Pomodoro experience. You can set your preferred work interval duration, short break length, long break length, and how many sessions before a long break.",
    },
    {
      question: "Does the Pomodoro Timer work when I'm offline?",
      answer:
        "Absolutely. The Pomodoro Timer works completely offline once the app is installed on your device, so you can stay productive even without an internet connection.",
    },
    {
      question: "Can I see statistics about my Pomodoro sessions?",
      answer:
        "Yes, Focusmo keeps track of your Pomodoro sessions, showing you daily and weekly stats about your focus time, completed sessions, and productivity trends. This helps you understand your work patterns and optimize your schedule.",
    },
  ],
};
