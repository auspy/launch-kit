// Focus Challenges from the app
export const CHALLENGES = {
  HYPERFOCUS: "hyperfocus",
  PROCRASTINATION: "procrastination",
  // NOISY_ENVIRONMENT: "noisy-environment",
  RACING_THOUGHTS: "racing-thoughts",
  SOCIAL_MEDIA: "social-media",
  NOTIFICATIONS: "notifications",
  ADHD: "adhd",
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
