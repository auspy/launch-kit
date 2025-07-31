# Roadmap Page Component

A flexible roadmap/what's next page component that displays product progress, upcoming features, and long-term vision with customizable sections and call-to-action.

## Usage

```jsx
import { RoadmapPage } from '@/launchkit/screens/roadmap';

const progressItems = [
  {
    icon: "sparkles",
    title: "Enhanced Analytics",
    description: "Detailed insights into user behavior and performance metrics."
  }
];

const comingSoonItems = [
  {
    priority: "high",
    badge: "Main Focus",
    title: "iOS Companion App",
    description: "A powerful iOS companion app that seamlessly syncs with your desktop app.",
    icon: "shield",
    features: [
      "Real-time sync across all devices",
      "Push notifications for important updates",
      "Offline support with sync when online"
    ]
  }
];

const config = {
  siteConfig: {
    // Your site configuration
  },
  progressSection: {
    title: "Our Progress",
    description: "Recent improvements and accomplishments",
    changelogLink: "/changelog",
    items: progressItems
  },
  comingSoonSection: {
    title: "Coming Soon",
    items: comingSoonItems
  }
};

export default function Page() {
  return <RoadmapPage {...config} />;
}
```

## Props

### siteConfig (required)
Main site configuration object passed to Header and SiteFooter components.

### pageHeader (optional)
Configuration for the page header section:

```jsx
{
  badge: "Vision", // Badge text
  title: "What's Next", // Main heading
  description: "Enhancing your experience, one feature at a time." // Subtitle
}
```

### progressSection (optional)
Configuration for the progress/achievements section:

```jsx
{
  title: "Our Progress", // Section title
  description: "Recent improvements and accomplishments", // Section description
  changelogLink: "/changelog", // Link to changelog (optional)
  items: [
    {
      icon: "sparkles", // Icon name (sparkles, zap, target, shield, users)
      title: "Feature Title", // Feature name
      description: "Feature description" // What was accomplished
    }
  ]
}
```

### comingSoonSection (optional)
Configuration for upcoming features:

```jsx
{
  title: "Coming Soon", // Section title
  items: [
    {
      priority: "high", // "high" for primary styling, anything else for outline
      badge: "Main Focus", // Badge text
      title: "Feature Title", // Feature name
      description: "Feature description", // What this feature will do
      icon: "shield", // Icon for feature bullets
      features: [ // Optional array of feature details
        "Feature detail 1",
        "Feature detail 2"
      ]
    }
  ]
}
```

### longTermSection (optional)
Configuration for long-term vision items:

```jsx
{
  title: "On Our Radar", // Section title
  items: [
    {
      icon: "target", // Icon name
      title: "Vision Item", // Vision title
      description: "Description of long-term goal or vision item"
    }
  ]
}
```

### callToAction (optional)
Configuration for the bottom call-to-action section:

```jsx
{
  title: "Help Shape the Future", // CTA title
  description: "Your feedback drives our development...", // CTA description
  buttonText: "Share Your Thoughts", // Button text
  buttonLink: "/contact" // Button destination
}
```

### className (optional)
CSS classes for the main container. Default: `"min-h-screen bg-gradient-to-b from-primary/5 to-background"`

## Features

- **Progress Section**: Showcase recent accomplishments with icons and descriptions
- **Coming Soon Cards**: Grid layout for upcoming features with priority badges
- **Long-term Vision**: Single card with multiple vision items
- **Flexible Icons**: Built-in icon mapping (sparkles, zap, target, shield, users)
- **Priority Styling**: Different visual treatment for high-priority items
- **Call-to-Action**: Customizable bottom section to drive engagement
- **Responsive Design**: Mobile-friendly grid layouts

## Icon System

The component includes a built-in icon mapping system. Available icons:

- `sparkles` - For new features or improvements
- `zap` - For performance or speed-related items  
- `target` - For goals or objectives
- `shield` - For security or protection features
- `users` - For community or collaboration features

Icons default to `Sparkles` if not found in the mapping.

## Customization

The component uses several sub-components that can be customized:

- `Header` - Site header from LaunchKit
- `PageHeader` - Page title section from LaunchKit
- `SiteFooter` - Site footer from LaunchKit
- `Card`, `CardContent`, `CardHeader` - UI card components
- `Badge` - Priority and status badges
- `Button` - Interactive buttons

## Styling

The component uses Tailwind CSS classes:
- Container: `max-w-4xl mx-auto py-12 px-4`
- Grid: `grid gap-6 md:grid-cols-2` for coming soon items
- Cards: Different styling for progress, coming soon, and long-term sections
- CTA: Special background and border styling

## Section Control

Each section can be hidden by:
- Not providing items array (empty or undefined)
- Setting items to empty array `[]`

The component gracefully handles missing sections and adjusts spacing accordingly.

## Integration

This component integrates with:
- LaunchKit Header and Footer components
- UI components from your component library
- Site routing system for links
- Changelog integration via `changelogLink`

## Dependencies

- `next/link` - For navigation
- `lucide-react` - For icons (ArrowRight, Sparkles, Zap, Target, Shield, Users)
- `@/components/ui/*` - UI components (Card, Badge, Button)
- `@/launchkit/components/*` - LaunchKit components