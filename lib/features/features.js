/**
 * Features data for Focusmo
 * This file contains all feature information displayed on the website
 */

import { getLandingPageData } from "@/lib/features/feature-landing-pages";
import { getFeatureSectionData } from "@/lib/features/feature-sections";
import { featureEnum } from "@/lib/features/featureEnum";
import { CHALLENGES } from "@/lib/features/feature-challenges";

// Feature Categories
export const CATEGORIES = {
  TRACKING: "tracking",
  BLOCKING: "blocking",
  BREAK_MANAGEMENT: "break management",
  TIME_AWARENESS: "time awareness",
  CLOUD_SYNC: "cloud sync",
  CALENDAR: "calendar",
  CUSTOMIZATION: "customization",
  NOTIFICATIONS: "notifications",
  UTILITY: "utility",
};

// Focus Goals from the app
export const GOALS = {
  TIME_MANAGEMENT: "time-management",
  TRACKING: "time-tracking",
  BLOCKING: "blocking-distractions",
  BREAKS: "taking-breaks",
  TIME_AWARENESS: "time-awareness",
};

// Challenge details
export const challengeDetails = {
  [CHALLENGES.HYPERFOCUS]: {
    icon: "🎯",
    title: "Getting too absorbed in tasks",
    description: "Hyperfocus - losing track of time and other priorities",
  },
  [CHALLENGES.PROCRASTINATION]: {
    icon: "🦥",
    title: "Putting things off",
    description: "Procrastination - struggling to start important tasks",
  },
  // [CHALLENGES.NOISY_ENVIRONMENT]: {
  //   icon: "🔊",
  //   title: "Noisy environment",
  //   description: "Noisy kids, traffic, neighbors, etc.",
  // },
  [CHALLENGES.RACING_THOUGHTS]: {
    icon: "💭",
    title: "Racing thoughts",
    description: "Mind wandering and difficulty staying focused",
  },
  [CHALLENGES.SOCIAL_MEDIA]: {
    icon: "📱",
    title: "Social media temptations",
    description: "Getting lost in feeds and endless scrolling",
  },
  [CHALLENGES.NOTIFICATIONS]: {
    icon: "🔔",
    title: "Too many notifications",
    description: "Constant interruptions from apps and messages",
  },
  [CHALLENGES.ADHD]: {
    icon: "🧠",
    title: "ADHD/attention challenges",
    description: "Difficulty maintaining attention and focus",
  },
};

// Goal details
export const goalDetails = {
  [GOALS.TIME_MANAGEMENT]: {
    icon: "⏰",
    title: "Better time management",
    description: "Stay on track with tasks and deadlines",
  },
  [GOALS.TRACKING]: {
    icon: "📊",
    title: "Track where my time goes",
    description: "Understand how I spend my working hours",
  },
  [GOALS.BLOCKING]: {
    icon: "🚫",
    title: "Block distracting apps/sites",
    description: "Stay focused by limiting access to distractions",
  },
  [GOALS.BREAKS]: {
    icon: "☕️",
    title: "Remember to take breaks",
    description: "Maintain productivity with regular breaks",
  },
  [GOALS.TIME_AWARENESS]: {
    icon: "⌛️",
    title: "Better sense of time passing",
    description: "Combat time blindness and stay aware",
  },
};

export const features = [
  {
    id: featureEnum.POMODORO_TIMER,
    title: "Pomodoro Timer",
    shortDescription: "Master your focus with science-backed work-rest cycles",
    description:
      "Transform your productivity with our intelligent Pomodoro timer that adapts to your natural rhythm. Work in focused sprints with customizable durations, take rejuvenating breaks, and track your progress.",
    detailedDescription: `Our enhanced Pomodoro Timer combines the proven time-management technique with modern adaptability. Work in focused sprints that match your natural rhythm, then take well-deserved breaks that help your brain recharge and consolidate learning.

Unlike rigid traditional timers, our system adapts to your workflow with customizable intervals, intelligent break reminders, and seamless task integration. Perfect for professionals, students, and anyone looking to maintain peak productivity without burnout.`,
    icon: "Timer",
    imageUrl: "/pomodoro.mp4",
    benefits: [
      "Prevent burnout with scientifically-designed work/rest cycles",
      "Customize intervals to match your natural productivity rhythm",
      "Track sessions with detailed productivity insights",
      "Maintain peak performance with structured breaks",
      "Build sustainable work habits that improve over time",
    ],
    keyPoints: [
      "Fully customizable work and break durations",
      "Smart notifications and visual progress tracking",
      "Detailed session statistics and insights",
      "Automatic mode switching with break reminders",
      "Seamless task integration",
    ],
    challenges: [
      CHALLENGES.HYPERFOCUS,
      CHALLENGES.PROCRASTINATION,
      CHALLENGES.RACING_THOUGHTS,
      CHALLENGES.ADHD,
    ],
    goals: [
      GOALS.TIME_MANAGEMENT,
      GOALS.BREAKS,
      GOALS.TIME_AWARENESS,
      GOALS.TRACKING,
    ],
    releaseVersion: "3.0.0",
    categories: [CATEGORIES.BREAK_MANAGEMENT, CATEGORIES.TIME_AWARENESS],
    isPro: true,
    get featureSection() {
      return getFeatureSectionData(featureEnum.POMODORO_TIMER);
    },
    get landingPage() {
      return getLandingPageData(featureEnum.POMODORO_TIMER);
    },
  },
  {
    id: featureEnum.FLOATING_TIMER,
    title: "Floating Timer",
    shortDescription:
      "Always visible timer that stays on top without getting in your way",
    description:
      "Keep track of time without disrupting your workflow with our elegant floating timer that follows you across your screen.",
    detailedDescription: `Our floating focus timer keeps you aware of time without disrupting your workflow. Perfect for professionals who need to stay on track.

Unlike traditional timers that get buried under windows, our always-visible companion stays gently present. It keeps you connected to time without adding to the noise.`,
    icon: "Clock",
    imageUrl: "/follow.mp4",
    benefits: [
      "Stay aware of time passing without constantly checking the clock",
      "Never lose track of your focus session under other windows",
      "Customize the timer's appearance to match your workflow",
      "Position the timer wherever works best for you",
    ],
    keyPoints: [
      "Always-on-top functionality",
      "Drag and position anywhere on screen",
      "Transparency and size adjustments",
      "Unobtrusive design",
    ],
    challenges: [
      CHALLENGES.HYPERFOCUS,
      CHALLENGES.ADHD,
      CHALLENGES.RACING_THOUGHTS,
    ],
    goals: [GOALS.TIME_AWARENESS, GOALS.TIME_MANAGEMENT],
    releaseVersion: "2.0.0",
    categories: [CATEGORIES.TIME_AWARENESS],
    isPro: false,
    get featureSection() {
      return getFeatureSectionData(featureEnum.FLOATING_TIMER);
    },
    get landingPage() {
      return getLandingPageData(featureEnum.FLOATING_TIMER);
    },
  },
  {
    id: featureEnum.WORKSPACES,
    title: "Workspaces",
    shortDescription: "Block apps and websites using customizable workspaces",
    description:
      "Create dedicated focus environments with workspace-specific app and website blocking",
    detailedDescription: `Create custom workspaces for different projects or contexts, each with their own specific app and website blocking rules.

Switch between work, study, or creative modes with a single click, automatically applying the right blocking rules for each context. Workspaces help you maintain focus by creating the perfect digital environment for each type of task.`,
    icon: "Layout",
    imageUrl: "/workspaces.mp4",
    benefits: [
      "Create context-specific environments",
      "Eliminate distractions based on what you're working on",
      "Switch between work modes quickly",
      "Maintain separate blocking rules for different projects",
    ],
    keyPoints: [
      "Custom workspaces for different contexts",
      "Per-workspace app and website blocking",
      "Quick workspace switching",
      "Workspace statistics tracking",
    ],
    challenges: [
      CHALLENGES.RACING_THOUGHTS,
      CHALLENGES.SOCIAL_MEDIA,
      CHALLENGES.NOTIFICATIONS,
      CHALLENGES.ADHD,
    ],
    goals: [GOALS.BLOCKING, GOALS.TIME_MANAGEMENT],
    releaseVersion: "4.6.0",
    categories: [CATEGORIES.BLOCKING],
    isPro: true,
    comingSoon: true,
    get featureSection() {
      return getFeatureSectionData(featureEnum.WORKSPACES);
    },
    get landingPage() {
      return getLandingPageData(featureEnum.WORKSPACES);
    },
  },
  {
    id: featureEnum.QUICK_ACCESS,
    title: "Quick Access Panel",
    shortDescription: "Spotlight-style command bar for instant control",
    description:
      "Control everything without breaking your flow using our intuitive command bar that's just a keyboard shortcut away.",
    detailedDescription: `Focusmo's Quick Access Panel lets you quickly capture todos and control your timers from anywhere. Stay in flow with lightning-fast keyboard shortcuts and our smart quick access panel.

Unlike traditional apps that force you to hunt through menus, every feature is just a keystroke away - keeping you in your productivity zone.`,
    icon: "Search",
    imageUrl: "/quick_access_panel.mp4",
    benefits: [
      "Control everything with just your keyboard",
      "Quickly add tasks without switching contexts",
      "Access any feature instantly",
      "Stay in your workflow without distractions",
    ],
    keyPoints: [
      "Global keyboard shortcut activation",
      "Intuitive command search",
      "Quick task entry",
      "Timer controls without leaving your work",
    ],
    challenges: [
      CHALLENGES.RACING_THOUGHTS,
      CHALLENGES.ADHD,
      CHALLENGES.SOCIAL_MEDIA,
    ],
    goals: [GOALS.TIME_MANAGEMENT, GOALS.BLOCKING],
    releaseVersion: "3.5.0",
    categories: [CATEGORIES.UTILITY],
    isPro: false,
    get featureSection() {
      return getFeatureSectionData(featureEnum.QUICK_ACCESS);
    },
    get landingPage() {
      return getLandingPageData(this.id);
    },
  },
  {
    id: featureEnum.CLOUD_SYNC,
    title: "Cloud Sync",
    shortDescription:
      "Keep your tasks and settings in sync across multiple devices",
    description:
      "Experimental feature that synchronizes your tasks, settings, and progress across multiple Mac devices",
    detailedDescription: `Our Cloud Sync feature keeps your focus data consistent across all your devices. Start a task on one device and continue it on another without missing a beat.

This experimental feature synchronizes your tasks, settings, focus history, and preferences to ensure a seamless experience no matter which device you're using.`,
    icon: "Cloud",
    imageUrl: "/cloud-sync.mp4",
    benefits: [
      "Work seamlessly across multiple devices",
      "Never lose your focus data",
      "Keep settings consistent everywhere",
      "Access your tasks from any Mac",
    ],
    keyPoints: [
      "Secure multi-device synchronization",
      "Real-time updates",
      "Works with macOS across devices",
      "Background syncing",
    ],
    challenges: [CHALLENGES.PROCRASTINATION],
    goals: [GOALS.TIME_MANAGEMENT, GOALS.TRACKING],
    releaseVersion: "4.2.0",
    categories: [CATEGORIES.CLOUD_SYNC],
    isPro: true,
    get featureSection() {
      return getFeatureSectionData(featureEnum.CLOUD_SYNC);
    },
    get landingPage() {
      return getLandingPageData(this.id);
    },
  },
  {
    id: featureEnum.KEYBOARD_SHORTCUTS,
    title: "Global Keyboard Shortcuts",
    shortDescription:
      "Control Focusmo from anywhere with custom keyboard shortcuts",
    description:
      "Access any feature instantly with customizable global keyboard shortcuts, keeping your hands on the keyboard and mind on your work.",
    detailedDescription: `Focusmo's global keyboard shortcuts put the full power of the app at your fingertips. Start, pause, or reset timers, add tasks, or open the quick access panel without ever touching your mouse.

Customize any shortcut to match your workflow and preferences, ensuring the app works exactly how you want it to.`,
    icon: "Keyboard",
    imageUrl: "/shortcuts.mp4",
    benefits: [
      "Control the app without leaving your keyboard",
      "Customize shortcuts to match your workflow",
      "Access any feature instantly",
      "Stay in flow without disruptions",
    ],
    keyPoints: [
      "Fully customizable shortcuts",
      "Global system-wide access",
      "Common action presets",
      "Easy shortcut management",
    ],
    challenges: [CHALLENGES.RACING_THOUGHTS, CHALLENGES.ADHD],
    goals: [GOALS.TIME_MANAGEMENT],
    releaseVersion: "3.0.0",
    categories: [CATEGORIES.TRACKING],
    isPro: false,
    get featureSection() {
      return getFeatureSectionData(featureEnum.KEYBOARD_SHORTCUTS);
    },
    get landingPage() {
      return getLandingPageData(this.id);
    },
  },
  {
    id: featureEnum.ANALYTICS,
    title: "Focus Analytics",
    shortDescription: "Learn and improve with simple productivity insights",
    description:
      "Transform your daily sessions into actionable improvements with insightful analytics about your focus patterns",
    detailedDescription: `Transform your daily sessions into actionable improvements. Spot your most productive hours, understand your focus patterns, and optimize your work habits automatically.

Unlike overwhelming analytics dashboards, our insights tell you exactly what to adjust to make tomorrow more productive than today.`,
    icon: "BarChart",
    imageUrl: "/track_focus_time.mp4",
    benefits: [
      "Identify your peak productivity hours",
      "Understand your focus patterns",
      "Make data-driven improvements to your routine",
      "Visualize your progress over time",
    ],
    keyPoints: [
      "Simple, actionable insights",
      "Daily and weekly focus statistics",
      "Productivity trend analysis",
      "Task completion tracking",
    ],
    challenges: [CHALLENGES.HYPERFOCUS, CHALLENGES.PROCRASTINATION],
    goals: [GOALS.TRACKING, GOALS.TIME_AWARENESS, GOALS.TIME_MANAGEMENT],
    releaseVersion: "3.1.0",
    categories: [CATEGORIES.TRACKING],
    isPro: true,
    get featureSection() {
      return getFeatureSectionData(featureEnum.ANALYTICS);
    },
    get landingPage() {
      return getLandingPageData(this.id);
    },
  },
  {
    id: featureEnum.COMPACT_MODE,
    title: "Compact Mode",
    shortDescription: "Hide the dock icon and access Focusmo from the menu bar",
    description:
      "Keep your dock clean while still maintaining access to Focusmo through the menu bar",
    detailedDescription: `With Compact Mode, Focusmo can hide its dock icon when the main window is closed, keeping your dock clean and distraction-free.

You can still access all Focusmo features through the menu bar icon, ensuring the app stays out of your way when you don't need it but remains instantly accessible when you do.`,
    icon: "Minimize2",
    imageUrl: "/compact-mode.mp4",
    benefits: [
      "Reduce visual clutter in your dock",
      "Maintain quick access via menu bar",
      "Keep Focusmo running without visual distractions",
      "Streamline your desktop experience",
    ],
    keyPoints: [
      "Toggle dock icon visibility",
      "Menu bar quick access",
      "Minimal UI footprint",
      "Background operation",
    ],
    challenges: [CHALLENGES.NOTIFICATIONS, CHALLENGES.RACING_THOUGHTS],
    goals: [GOALS.BLOCKING],
    releaseVersion: "4.2.0",
    categories: [CATEGORIES.UTILITY],
    isPro: true,
    get featureSection() {
      return getFeatureSectionData(featureEnum.COMPACT_MODE);
    },
    get landingPage() {
      return getLandingPageData(this.id);
    },
  },
  {
    id: featureEnum.CUSTOM_NOTIFICATIONS,
    title: "Notification Styles",
    shortDescription: "Customize how and when Focusmo notifies you",
    description:
      "Choose from various notification styles to match your work preferences, including subtle alerts and fullscreen focus cues.",
    detailedDescription: `Focusmo offers multiple notification styles to match your personal preferences and work environment. Choose from subtle unobtrusive alerts, standard notifications, or even full-screen focus cues.

Customize when and how you're notified about timer completions, upcoming breaks, scheduled meetings, and more. Our notification system is designed to keep you informed without breaking your concentration.`,
    icon: "Bell",
    imageUrl: "/notifications.mp4",
    benefits: [
      "Notifications that match your work style",
      "Reduce notification fatigue",
      "Stay aware without disruptions",
      "Choose the right level of interruption",
    ],
    keyPoints: [
      "Multiple notification styles",
      "Customizable for each event type",
      "Fullscreen focus mode option",
      "Sound and visual alert combinations",
    ],
    challenges: [CHALLENGES.HYPERFOCUS, CHALLENGES.NOTIFICATIONS],
    goals: [GOALS.TIME_AWARENESS, GOALS.BREAKS],
    releaseVersion: "4.3.0",
    categories: [CATEGORIES.NOTIFICATIONS],
    isPro: true,
    get featureSection() {
      return getFeatureSectionData(featureEnum.CUSTOM_NOTIFICATIONS);
    },
    get landingPage() {
      return getLandingPageData(this.id);
    },
  },
  {
    id: featureEnum.DAILY_REMINDERS,
    title: "Daily Reminders",
    shortDescription:
      "Smart reminders that help you build a consistent focus routine",
    description:
      "Set up intelligent daily reminders that help you establish and maintain a productive focus routine.",
    detailedDescription: `Daily Reminders help you build consistent focus habits by gently nudging you to start your focus sessions at the right time each day.

You can customize your reminder schedule based on your work patterns and preferences. The system learns from your behavior to suggest optimal times for deep work, making it easier to maintain a productive daily routine.`,
    icon: "AlarmClock",
    imageUrl: "/reminders.mp4",
    benefits: [
      "Build consistent focus habits",
      "Never forget to use your focus time",
      "Customize reminder timing to match your schedule",
      "Gradually improve your routine with gentle cues",
    ],
    keyPoints: [
      "Customizable daily reminders",
      "Smart timing suggestions",
      "Multiple reminder styles",
      "Weekly schedule management",
    ],
    challenges: [CHALLENGES.PROCRASTINATION, CHALLENGES.ADHD],
    goals: [GOALS.TIME_MANAGEMENT, GOALS.TIME_AWARENESS],
    releaseVersion: "4.5.0",
    categories: [CATEGORIES.NOTIFICATIONS],
    isPro: true,
    get featureSection() {
      return getFeatureSectionData(featureEnum.DAILY_REMINDERS);
    },
    get landingPage() {
      return getLandingPageData(this.id);
    },
  },
  {
    id: featureEnum.TIME_TRACKING,
    title: "Time Tracking",
    shortDescription:
      "Automatically log and visualize where your time goes in Apple calendar",
    description:
      "Gain powerful insights into your focus habits with automatic time tracking that reveals where your hours actually go.",
    detailedDescription: `Understand your productivity patterns with our seamless time tracking system. Focusmo automatically logs your focus sessions, tasks completed, and time spent on different projects.

Unlike traditional time trackers that require manual input, our system works in the background, creating accurate records of your productive time with minimal effort on your part.`,
    icon: "Clock",
    imageUrl: "/time-tracking.mp4",
    benefits: [
      "Understand where your time actually goes",
      "Identify your most productive periods",
      "Track time spent on different projects",
      "Generate accurate reports for clients or management",
    ],
    keyPoints: [
      "Automatic session tracking",
      "Project and task categorization",
      "Detailed visual reports",
      "Export capabilities for invoicing/reporting",
    ],
    challenges: [CHALLENGES.HYPERFOCUS, CHALLENGES.PROCRASTINATION],
    goals: [GOALS.TRACKING, GOALS.TIME_AWARENESS, GOALS.TIME_MANAGEMENT],
    releaseVersion: "3.2.0",
    categories: [CATEGORIES.TRACKING],
    isPro: true,
    get featureSection() {
      return getFeatureSectionData(featureEnum.TIME_TRACKING);
    },
    get landingPage() {
      return getLandingPageData(this.id);
    },
  },
  {
    id: featureEnum.APPEARANCE_CUSTOMIZATION,
    title: "Customizations",
    shortDescription: "Personalize Focusmo with custom colors and timer styles",
    description:
      "Make Focusmo your own with customizable colors, timer styles, progress bar designs, and themes.",
    detailedDescription: `Personalize your Focusmo experience with our extensive appearance customization options. Choose from various timer styles, progress bar designs, color schemes, and more.

Find the perfect visual design that matches your desktop environment and personal preferences. The right aesthetic can make focusing easier and more enjoyable, helping you stay engaged with your productivity system.`,
    icon: "Palette",
    imageUrl: "/customization.mp4",
    benefits: [
      "Create a timer that matches your aesthetic",
      "Choose designs that help you focus better",
      "Reduce visual friction with harmonious colors",
      "Express your personal style",
    ],
    keyPoints: [
      "Multiple timer and progress bar styles",
      "Custom color selection",
      "Font and size adjustments",
      "Theme presets for quick styling",
    ],
    challenges: [CHALLENGES.RACING_THOUGHTS, CHALLENGES.ADHD],
    goals: [GOALS.TIME_AWARENESS],
    releaseVersion: "3.2.0",
    categories: [CATEGORIES.CUSTOMIZATION],
    isPro: true,
    get featureSection() {
      return getFeatureSectionData(featureEnum.APPEARANCE_CUSTOMIZATION);
    },
    get landingPage() {
      return getLandingPageData(this.id);
    },
  },
  {
    id: featureEnum.TASK_RESET,
    title: "Task Reset",
    shortDescription:
      "Start fresh with a clean task list focused on what matters now",
    description:
      "Reset your task list to focus only on current priorities, eliminating backlog overwhelm.",
    detailedDescription: `The Task Reset feature lets you declutter your to-do list and start fresh when you need to refocus. Instead of an ever-growing backlog, you can choose to focus only on what truly matters right now.

This feature helps prevent the paralysis that comes from an overwhelming task list, allowing you to prioritize effectively and make meaningful progress on your most important work.`,
    icon: "RotateCcw",
    imageUrl: "/task-reset.mp4",
    benefits: [
      "Eliminate task list overwhelm",
      "Focus only on what matters now",
      "Start fresh when priorities change",
      "Prevent backlog paralysis",
    ],
    keyPoints: [
      "One-click task list reset",
      "Selective task retention",
      "Backlog management",
      "Priority-based filtering",
    ],
    challenges: [
      CHALLENGES.PROCRASTINATION,
      CHALLENGES.RACING_THOUGHTS,
      CHALLENGES.ADHD,
    ],
    goals: [GOALS.TIME_MANAGEMENT],
    releaseVersion: "4.6.0",
    categories: [CATEGORIES.PRODUCTIVITY],
    isPro: true,
  },
  {
    id: featureEnum.NEVER_MISS_MEETINGS,
    title: "Meeting Notifications",
    shortDescription:
      "Get timely alerts for upcoming meetings without breaking focus",
    description:
      "Stay aware of your schedule with intelligent meeting notifications that alert you at the perfect moment.",
    detailedDescription: `Never miss another important meeting, even when you're in deep focus mode. Our intelligent meeting notification system works seamlessly with your calendar to provide timely alerts.

Unlike standard calendar notifications that are easy to miss, our system uses smart timing and attention-grabbing but non-disruptive alerts to ensure you're aware of upcoming commitments without breaking your focus flow.`,
    icon: "Video",
    imageUrl: "/meeting-alerts.mp4",
    benefits: [
      "Never miss important meetings or calls",
      "Get notified with perfect timing before meetings",
      "Maintain awareness without constant calendar checking",
      "Smoothly transition between deep work and collaborative time",
    ],
    keyPoints: [
      "Smart timing based on your workflow",
      "Customizable alert styles",
      "Calendar integration across Apple ecosystem",
      "One-click meeting join options",
    ],
    challenges: [CHALLENGES.HYPERFOCUS, CHALLENGES.ADHD],
    goals: [GOALS.TIME_MANAGEMENT, GOALS.TIME_AWARENESS],
    releaseVersion: "4.5.0",
    categories: [CATEGORIES.NOTIFICATIONS, CATEGORIES.CALENDAR],
    isPro: true,
    get featureSection() {
      return getFeatureSectionData(featureEnum.NEVER_MISS_MEETINGS);
    },
    get landingPage() {
      return getLandingPageData(this.id);
    },
  },
];

/**
 * Get all features
 * @returns {Array} All features
 */
export function getAllFeatures() {
  return features;
}

/**
 * Get feature by ID
 * @param {string} id Feature ID
 * @returns {Object} Feature object
 */
export function getFeatureById(id) {
  return features.find((feature) => feature.id === id);
}

/**
 * Get features by category
 * @param {string} category Category ID
 * @returns {Array} Features in the category
 */
export function getFeaturesByCategory(category) {
  return features.filter(
    (feature) => feature.categories && feature.categories.includes(category)
  );
}

/**
 * Get features by challenge
 * @param {string} challenge Challenge ID
 * @returns {Array} Features that help with this challenge
 */
export function getFeaturesByChallenge(challenge) {
  return features.filter(
    (feature) => feature.challenges && feature.challenges.includes(challenge)
  );
}

/**
 * Get features by goal
 * @param {string} goal Goal ID
 * @returns {Array} Features that help with this goal
 */
export function getFeaturesByGoal(goal) {
  return features.filter(
    (feature) => feature.goals && feature.goals.includes(goal)
  );
}

/**
 * Get features by release version
 * @param {string} version Release version
 * @returns {Array} Features in the release
 */
export function getFeaturesByVersion(version) {
  return features.filter((feature) => feature.releaseVersion === version);
}
