/**
 * Landing page data for Calendar Integration feature
 */
import React from "react";

export const landingPageData = {
  heroData: {
    title: "Calendar Integration",
    subtitle: "Never Miss Important Meetings",
    description:
      "Stay on top of your schedule with smart calendar integration that notifies you of upcoming meetings without breaking your focus.",
    videoSrc: "/calendar.mp4",
    keyPoints: [
      "Smart Notifications",
      "Apple Calendar Sync",
      "Distraction-Free",
    ],
    primaryButton: {
      text: "Download Now",
      href: "/download",
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
      title: "Stay on top of your schedule without constant checking",
      description: (
        <>
          <p>
            Our Calendar Integration connects directly with your Apple Calendar,
            providing smart notifications that ensure you never miss an
            important meeting.
          </p>
          <p>
            Instead of constantly checking your calendar or being interrupted by
            standard notifications, Focusmo provides gentle, timely reminders
            that respect your focus state.
          </p>
        </>
      ),
      media: {
        src: "/features/calendar-integration-main.jpg",
        alt: "Calendar integration with notification example",
      },
      badge: "Seamless synchronization",
    },
    {
      title: "Smart notifications that respect your focus",
      description: (
        <>
          <p>
            Standard calendar notifications often go unnoticed during deep
            focus. Our system provides subtle but effective alerts that break
            through focus without jarring you out of flow.
          </p>
          <p>
            Customize when and how you're notified before meetings, ensuring you
            have just the right amount of preparation time for different types
            of commitments.
          </p>
        </>
      ),
      media: {
        src: "/features/calendar-notifications.jpg",
        alt: "Smart meeting notification examples",
      },
      badge: "Focus-aware alerts",
    },
    {
      title: "Automatic focus session scheduling",
      description: (
        <>
          <p>
            Focusmo doesn't just notify you about meetings - it helps you make
            the most of the time between them. The system automatically
            identifies focus opportunities in your calendar.
          </p>
          <p>
            When you have gaps between meetings, Focusmo suggests the perfect
            focus session length, helping you maximize productive work without
            risk of running into your next commitment.
          </p>
        </>
      ),
      media: {
        src: "/features/calendar-opportunities.jpg",
        alt: "Focus opportunity identified between meetings",
      },
      badge: "Maximize free time",
    },
  ],
  testimonials: [
    {
      name: "Thomas Wright",
      role: "Finance Director",
      content:
        "The calendar integration has saved me multiple times. I get so focused on spreadsheets that I'd miss meeting notifications, but Focusmo's ${persistent but gentle alerts} ensure I'm ${always prepared for calls}.",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Olivia Chen",
      role: "UX Researcher",
      content:
        "I love how it ${identifies focus opportunities} between my meetings. Instead of writing off a 45-minute gap, Focusmo suggests the perfect session length, helping me ${fit in meaningful work} between calls.",
      imageUrl:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=faces",
    },
    {
      name: "Ryan Jackson",
      role: "Project Manager",
      content:
        "With back-to-back meetings all day, I was struggling to find focus time. The ${calendar integration} helps me ${block out and protect} dedicated periods for actual work, and the notifications ensure I don't miss anything important.",
      imageUrl:
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=150&h=150&fit=crop&crop=faces",
    },
  ],
  faqQuestions: [
    {
      question: "Which calendar services does Focusmo support?",
      answer:
        "Focusmo currently integrates with Apple Calendar, which supports accounts from iCloud, Google, Microsoft Exchange, and other CalDAV providers. This means most major calendar services are compatible through your macOS calendar.",
    },
    {
      question: "Can I choose which calendars trigger notifications?",
      answer:
        "Yes, you can select which specific calendars Focusmo should monitor for meetings. This allows you to separate work and personal commitments, or focus only on your most important calendars.",
    },
    {
      question: "How far in advance will I be notified about meetings?",
      answer:
        "You can customize notification timing based on meeting type or calendar. For example, you might want a 10-minute heads-up for regular team check-ins, but 30 minutes notice for client presentations to allow preparation time.",
    },
    {
      question: "Can Focusmo automatically add focus sessions to my calendar?",
      answer:
        "Yes, with your permission, Focusmo can add your completed focus sessions to a designated calendar. This creates a comprehensive record of your productive time and helps you analyze the balance between focus work and meetings.",
    },
    {
      question: "Will calendar integration work when I'm offline?",
      answer:
        "Focusmo caches your calendar data, so you'll still receive meeting notifications even when temporarily offline. The system will automatically sync when connection is restored.",
    },
  ],
};
