import { featureEnum } from "@/lib/features/featureEnum";

export const landingPageData = {
  heroData: {
    title: "Never be late to",
    subtitle: "meetings ever again",
    description:
      "Focusmo's full-screen meeting alerts make it virtually impossible to miss important meetings, perfect for deep workers or anyone with ADHD.",
    videoSrc: "/meeting-alerts.mp4",
    keyPoints: [
      "Impossible-to-Miss Alerts",
      "Calendar Integration",
      "Customizable Alerts",
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
      title: "Unmissable alerts for your most important meetings",
      description: (
        <>
          <p>
            When you're in a state of flow, those subtle notification bubbles
            might as well be invisible. Focusmo's meeting alerts command
            attention by temporarily taking over your screen with important
            meeting information—making them virtually impossible to miss.
          </p>
          <p>
            No more embarrassing late joins, missing client calls, or that
            panicked "I completely forgot about our meeting" feeling. Stay in
            deep focus knowing that when it truly matters, Focusmo will pull you
            back at exactly the right moment.
          </p>
        </>
      ),
      media: {
        src: "/features/meeting-alerts-main.jpg",
        alt: "Full-screen meeting notification that's impossible to miss",
      },
      badge: "Never Be Late Again",
      className: "object-cover",
    },
    {
      title: "Personalize your alerts exactly how you want them",
      description: (
        <>
          <p>
            No two workflows are the same—that's why Focusmo lets you customize
            every aspect of your meeting alerts. Adjust transparency levels for
            different contexts, choose colors that catch your attention, select
            sounds that cut through your focus, and set the perfect timing for
            your needs.
          </p>
          <p>
            Whether you prefer subtle notifications or attention-demanding
            alerts, you can fine-tune the experience to match your personal
            style and sensitivity. Create different profiles for various meeting
            types—subtle for daily stand-ups, unmissable for client
            presentations.
          </p>
        </>
      ),
      media: {
        src: "/features/meeting-join-links.jpg",
        alt: "Customizable alert settings interface",
      },
      badge: "Customizable Alerts",
      className: "object-cover",
    },
    {
      title: "Smart calendar connection with powerful filtering",
      description: (
        <>
          <p>
            Focusmo seamlessly connects with your calendar and automatically
            detects all your meetings and events. You're in complete control of
            which events trigger alerts through powerful filtering options based
            on keywords, participants, calendar source, and more.
          </p>
          <p>
            Only want alerts for client meetings? Filter by the word "client" in
            the title. Need to prioritize meetings with your boss? Create a
            filter for their name in the attendee list. This intelligent
            filtering system ensures you only get interrupted for what truly
            matters to you.
          </p>
        </>
      ),
      media: {
        src: "/features/meeting-alerts-context.jpg",
        alt: "Different alert styles based on meeting importance",
      },
      badge: "Smart Calendar Integration",
      className: "object-cover",
    },
    {
      title: (
        <>
          Perfect for Deep Workers <br /> and People with ADHD
        </>
      ),
      description: (
        <>
          <p>
            Focusmo's meeting alerts were specifically designed for people who
            experience hyperfocus(that state where you're so absorbed in your
            work that the outside world fades away). Whether you're a developer,
            designer, writer, or anyone who loses track of time when focused,
            our system ensures you stay connected to your schedule.
          </p>
        </>
      ),
      media: {
        src: "/features/customizable-alerts.jpg",
        alt: "Customizable alert styles",
      },
      badge: "Hyperfocus-Friendly",
      className: "object-cover",
    },
  ],
  integrationSection: {
    title: (
      <>
        Perfect for Deep Workers <br /> and People with ADHD
      </>
    ),
    description: (
      <>
        Focusmo's meeting alerts were specifically designed for people who
        experience hyperfocus(that state where you're so absorbed in your work
        that the outside world fades away). Whether you're a developer,
        designer, writer, or anyone who loses track of time when focused, our
        system ensures you stay connected to your schedule.
      </>
    ),
    media: {
      src: "/features/deep-focus-meetings.jpg",
      alt: "Person in deep focus with meeting alert overlay",
    },
    badge: "Hyperfocus-Friendly",
    className: "object-cover bg-slate-50",
    // additionalFeatures: [
    //   {
    //     title: "Time-awareness during Pomodoro sessions",
    //     description: (
    //       <>
    //         <p>
    //           Even during intense Pomodoro work sessions, never miss important
    //           meetings. Focusmo intelligently integrates meeting alerts with
    //           your Pomodoro workflow, ensuring you maintain both your deep work
    //           rhythm and your professional commitments.
    //         </p>
    //       </>
    //     ),
    //     media: {
    //       src: "/features/pomodoro.mp4",
    //       alt: "Pomodoro timer with meeting alert integration",
    //     },
    //     feature: featureEnum.POMODORO,
    //     badge: "Pomodoro Integration",
    //   },
    //   {
    //     title: "Floating timer keeps meetings on your radar",
    //     description: (
    //       <>
    //         <p>
    //           The floating timer doesn't just track your focus sessions—it also
    //           displays upcoming meetings in your peripheral vision. This gentle
    //           awareness helps you pace your work knowing exactly how much time
    //           remains before your next commitment.
    //         </p>
    //       </>
    //     ),
    //     media: {
    //       src: "/follow.mp4",
    //       alt: "Floating timer with upcoming meeting display",
    //     },
    //     feature: featureEnum.FLOATING_TIMER,
    //     badge: "Meeting Awareness",
    //   },
    //   {
    //     title: "Track meeting attendance and participation",
    //     description: (
    //       <>
    //         <p>
    //           Focusmo's analytics don't just track your focus time—they also
    //           monitor your meeting attendance and punctuality. Gain insights
    //           into your meeting patterns and see how your focus sessions
    //           interact with your collaborative commitments over time.
    //         </p>
    //       </>
    //     ),
    //     media: {
    //       src: "/calendar.mp4",
    //       alt: "Meeting attendance analytics dashboard",
    //     },
    //     feature: featureEnum.ANALYTICS,
    //     badge: "Meeting Analytics",
    //   },
    // ],
  },
  faqQuestions: [
    {
      question: "How does this differ from regular calendar notifications?",
      answer:
        "Unlike standard calendar notifications that appear in a corner of your screen and are easy to miss, Focusmo uses full-screen alerts that are impossible to ignore. It's specifically designed for deep workers and people with ADHD who might otherwise miss subtle notifications when in a state of flow or hyperfocus.",
    },
    {
      question: "Can I customize how much advance notice I receive?",
      answer:
        "Yes, you can set custom alert times for different meeting types. For example, you might want a 5-minute warning for internal team meetings but a 15-minute heads-up for client presentations to give yourself preparation time. You can also customize notifications based on keywords in the meeting title or attendees.",
    },

    {
      question: "Can I temporarily disable meeting notifications?",
      answer:
        "Yes, you can easily disable calendar notifications directly from Focusmo.",
    },
    {
      question: "Will it alert me about all calendar events?",
      answer:
        "You have complete control over which calendars and event types trigger alerts. You can include work calendars while excluding personal ones, or create filtering rules based on meeting attributes like title, attendees, or duration. This ensures you only get alerted for truly relevant meetings.",
    },
  ],
};
