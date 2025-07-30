/**
 * Landing page data for Focus Analytics feature
 */

export const landingPageData = {
  heroData: {
    title: "Focus Analytics",
    subtitle: "Turn Focus Data Into Productivity Insights",
    description:
      "Transform your daily sessions into actionable improvements with insightful analytics about your focus patterns.",
    videoSrc: "/track_focus_time.mp4",
    keyPoints: [
      "Productivity Patterns",
      "Actionable Insights",
      "Visual Reports",
    ],
    primaryButton: {
      text: "Try Pro Features",
      href: "/pricing",
      icon: "Download",
    },
    secondaryButton: {
      text: "See Sample Insights",
      href: "#sample-insights",
      icon: "BarChart2",
    },
  },
  contentSections: [
    {
      title: "Understand your unique focus patterns",
      description: (
        <>
          <p>
            Everyone's productivity rhythm is different. Focus Analytics reveals
            your personal patterns, helping you identify your peak performance
            hours, optimal work intervals, and focus trends.
          </p>
          <p>
            Through beautiful visualizations, you'll discover when you're
            naturally most focused, how long your optimal sessions last, and
            which days of the week you're most productive.
          </p>
        </>
      ),
      media: {
        src: "/features/analytics-patterns.jpg",
        alt: "Focus pattern analysis visualization",
      },
      badge: "Personal insights",
    },
    {
      title: "Turn data into actionable improvements",
      description: (
        <>
          <p>
            Unlike complex analytics that leave you wondering "so what?",
            Focusmo provides clear, actionable recommendations based on your
            actual usage patterns.
          </p>
          <p>
            The system identifies opportunities to optimize your schedule,
            suggests ideal focus session lengths, and helps you build more
            effective productivity habits based on your real data.
          </p>
        </>
      ),
      media: {
        src: "/features/analytics-actions.jpg",
        alt: "Actionable recommendations from focus data",
      },
      badge: "Practical guidance",
    },
    {
      title: "Track your progress over time",
      description: (
        <>
          <p>
            See your focus skills improve with daily, weekly, and monthly trends
            that show your growth. Celebrate milestones as your focus capacity
            expands and your productivity increases.
          </p>
          <p>
            Focus Analytics helps you build motivation by visualizing your
            improvement journey, showing how small daily habits compound into
            significant productivity gains over time.
          </p>
        </>
      ),
      media: {
        src: "/features/analytics-progress.jpg",
        alt: "Long-term focus improvement trends",
      },
      badge: "Visualize improvement",
    },
  ],
  testimonials: [
    {
      name: "Rachel Kim",
      role: "Doctoral Researcher",
      content:
        "I discovered I'm ${most productive between 10am-1pm} through the analytics. I've restructured my day to tackle complex research during those hours, and my ${output has nearly doubled}. The data doesn't lie!",
      imageUrl:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Leo Martinez",
      role: "Creative Director",
      content:
        "The ${visual reports} showed me I was attempting focus sessions that were too long. After adjusting to the ${recommended 35-minute blocks}, my creative output improved dramatically and I felt less drained at day's end.",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Sophia Williams",
      role: "Marketing Consultant",
      content:
        "As a freelancer, tracking my ${actual productive hours} has been invaluable. I can now predict how long projects will take with remarkable accuracy, and the ${week-over-week improvement} keeps me motivated to maintain my focus practice.",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=faces",
    },
  ],
  faqQuestions: [
    {
      question: "What kind of metrics does Focus Analytics track?",
      answer:
        "Focus Analytics tracks a comprehensive set of metrics including total focus time, session completion rates, focus streak data, productivity by time of day, break patterns, task completion velocity, and focus quality scores based on your sessions.",
    },
    {
      question: "Will the analytics feel overwhelming or complicated?",
      answer:
        "No, we've designed Focus Analytics to be approachable and useful even if you're not data-savvy. The insights are presented in simple, visual formats with clear explanations and actionable recommendations.",
    },
    {
      question: "How long does it take to get meaningful insights?",
      answer:
        "You'll start seeing basic patterns after just a week of regular use. More sophisticated insights about your optimal focus times and productivity trends become available after 2-3 weeks as the system learns your unique patterns.",
    },
    {
      question: "Can I export my analytics data?",
      answer:
        "Yes, you can export your focus data in several formats (CSV, PDF, or JSON) for personal record-keeping or to use in other productivity tools. This makes it easy to maintain a complete record of your productivity journey.",
    },
    {
      question: "Is my analytics data private?",
      answer:
        "Absolutely. Your focus analytics data is private and stored securely. We use this data only to provide insights to you, and it's never shared with third parties or used for any purpose other than improving your personal productivity.",
    },
  ],
};
