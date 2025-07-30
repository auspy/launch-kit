export const landingPageData = {
  heroData: {
    title: "Daily Reminders",
    subtitle: "Build a Consistent Focus Habit",
    description:
      "Establish and maintain a productive focus routine with intelligent daily reminders tailored to your work patterns.",
    videoSrc: "/reminders.mp4",
    keyPoints: ["Smart Timing", "Habit Building", "Gentle Nudges"],
    primaryButton: {
      text: "Try Pro Features",
      href: "/pricing",
      icon: "Download",
    },
    secondaryButton: {
      text: "Learn More",
      href: "#how-it-works",
      icon: "Info",
    },
  },
  contentSections: [
    {
      title: "Build focus habits that stick",
      description: (
        <>
          <p>
            Consistency is the key to productivity, but establishing new habits
            can be challenging. Daily Reminders provide the gentle structure you
            need to build lasting focus routines.
          </p>
          <p>
            Set personalized reminders to start your focus sessions at the same
            time each day, creating a rhythm that transforms focused work from
            an occasional effort into an automatic habit.
          </p>
        </>
      ),
      media: {
        src: "/features/reminders-habits.jpg",
        alt: "Daily focus habit building interface",
      },
      badge: "Consistency builder",
    },
    {
      title: "Smart reminders that learn your patterns",
      description: (
        <>
          <p>
            Not just simple alarms, Focusmo's reminders adapt to your unique
            work patterns. The system learns when you're most productive and
            suggests optimal times for deep focus.
          </p>
          <p>
            Over time, reminders become more intelligent, adjusting to your
            natural rhythm and helping you capitalize on your peak productivity
            windows for maximum effectiveness.
          </p>
        </>
      ),
      media: {
        src: "/features/reminders-smart.jpg",
        alt: "Smart reminder timing suggestions",
      },
      badge: "Intelligent timing",
    },
    {
      title: "Gentle guidance, not rigid structure",
      description: (
        <>
          <p>
            Daily Reminders are designed to support your intentions, not control
            your schedule. The gentle nudges respect your workflow and current
            context.
          </p>
          <p>
            Unlike calendar events that demand immediate attention, these
            reminders serve as supportive cues that help you transition into
            focus sessions at natural breaking points in your day.
          </p>
        </>
      ),
      media: {
        src: "/features/reminders-gentle.jpg",
        alt: "Gentle reminder notifications",
      },
      badge: "Supportive structure",
    },
  ],
  testimonials: [
    {
      name: "David Wilson",
      role: "Freelance Consultant",
      content:
        "The 10am daily reminder has been my anchor. Even with an ${unpredictable client schedule}, having this consistent prompt to focus has helped me ${build a morning deep work ritual} that's become the most productive part of my day.",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Aisha Johnson",
      role: "PhD Student",
      content:
        "I struggled with consistency in my research until trying these reminders. The system ${learned when I'm naturally most alert} and now nudges me to start deep work sessions at those times. My ${dissertation progress has accelerated dramatically}.",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Tyler Rodriguez",
      role: "Marketing Manager",
      content:
        "What I love is the ${gentle approach}. These aren't jarring alarms but subtle nudges that respect when I'm already in flow. They've helped me ${transform from a reactive worker} to someone who proactively schedules focus time.",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
    },
  ],
  faqQuestions: [
    {
      question: "How are Daily Reminders different from calendar events?",
      answer:
        "Unlike calendar events that block specific time slots, Daily Reminders are flexible nudges that help you start focus sessions at consistent times. They're designed to build habits rather than schedule meetings, with gentler notifications that respect your current work state.",
    },
    {
      question: "Can I set different reminders for different days?",
      answer:
        "Yes, you can create custom reminder schedules for each day of the week. For example, you might set earlier focus reminders on Mondays when you're fresh, and later ones on Fridays when you typically have more meetings.",
    },
    {
      question: "How does the smart timing feature work?",
      answer:
        "The intelligent timing system analyzes your historical focus patterns to identify when you're naturally most productive. It then suggests optimal times for your daily reminders, helping you align your intentional focus sessions with your body's natural rhythm.",
    },
    {
      question: "Can I temporarily disable reminders for vacation?",
      answer:
        "Absolutely. You can easily pause your reminder schedule for vacations, holidays, or any period when you need a break. The system also integrates with your calendar to automatically adjust when you're out of office.",
    },
    {
      question: "Will reminders become annoying if I ignore them?",
      answer:
        "No, Daily Reminders are designed with respect for your attention. If you consistently ignore a reminder at a certain time, the system will suggest adjusting it to a more suitable time rather than repeatedly interrupting you when you're unavailable.",
    },
  ],
};
