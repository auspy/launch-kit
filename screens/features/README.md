# Feature Pages Components

Components for displaying features in list and detail views.

## Components

### FeaturesListPage

Displays a grid of all features with optional CTA section.

```jsx
import { FeaturesListPage } from '@/screens/features';
import { getAllFeatures } from '@/lib/features/features';

const features = getAllFeatures();
const config = {
  showCTA: true,
  metadata: {
    title: "Our Features",
    description: "Explore all features"
  }
};

<FeaturesListPage features={features} config={config} />
```

### FeatureDetailPage

Displays detailed information about a single feature, with support for enhanced landing pages.

```jsx
import { FeatureDetailPage } from '@/screens/features';
import { getFeatureById } from '@/lib/features/features';

const feature = getFeatureById(featureId);
const config = {
  productName: "YourProduct",
  showRelatedFeatures: true
};

<FeatureDetailPage feature={feature} config={config} />
```

## Configuration Options

### FeaturesListPage Config

```jsx
{
  showHeader: true,
  showFooter: true,
  showCTA: true,
  layout: {
    container: "pb-12 w-full flex flex-col items-center",
    background: "min-h-screen bg-white"
  },
  metadata: {
    title: "Features",
    description: "Feature description"
  },
  ctaProps: {
    // Props passed to CTASection component
  },
  customComponents: {
    beforeMain: null,
    afterMain: null
  }
}
```

### FeatureDetailPage Config

```jsx
{
  showHeader: true,
  showFooter: true,
  showBackButton: true,
  backButtonText: "Back to Features",
  backButtonHref: "/features",
  showRelatedFeatures: true,
  productName: "Your Product",
  layout: {
    container: "wrapper py-10",
    background: "bg-gradient-to-b from-primary/5 to-background"
  },
  heroOverrides: {
    // Override hero section props
  },
  customComponents: {
    beforeContent: null,
    afterContent: null,
    beforeDetail: null,
    afterDetail: null
  }
}
```

## Feature Data Structure

Features should follow this structure:

```jsx
{
  id: "feature-id",
  title: "Feature Title",
  description: "Feature description",
  icon: "🎯",
  category: "tracking",
  categories: ["tracking", "productivity"],

  // Optional: Enhanced landing page data
  landingPage: {
    heroData: {
      title: "Hero Title",
      description: "Hero description",
      // ... other hero props
    },
    contentSections: [...],
    integrationSection: {...},
    testimonials: [...],
    faqQuestions: [...],
    comparisonData: {
      features: [...],
      competitors: [...]
    }
  }
}
```

## Landing Page vs Standard Detail

The component automatically detects and renders:

1. **Enhanced Landing Page**: If `feature.landingPage` exists
   - Custom hero section
   - Content sections
   - Integrations
   - Comparisons
   - Testimonials
   - FAQ

2. **Standard Detail Page**: If no landing page data
   - Simple feature detail
   - Related features
   - Back navigation

## Customization Examples

### Custom CTA for Features List

```jsx
const config = {
  ctaProps: {
    title: "Ready to boost productivity?",
    description: "Start your free trial today",
    buttonText: "Get Started",
    buttonHref: "/signup"
  }
};
```

### Add Newsletter to Feature Detail

```jsx
const config = {
  customComponents: {
    afterDetail: <NewsletterSignup />
  }
};
```

### Custom Product Comparison

```jsx
const config = {
  productName: "FocusPro",
  heroOverrides: {
    primaryButton: {
      text: "Try FocusPro Free",
      href: "/trial"
    }
  }
};
```

## Feature Categories

Common categories used for organizing features:

- `tracking` - Time and activity tracking
- `blocking` - Distraction blocking
- `break_management` - Break reminders and management
- `time_awareness` - Time visibility features
- `cloud_sync` - Synchronization features
- `calendar` - Calendar integration
- `customization` - Personalization options
- `notifications` - Alert and notification features
- `utility` - Helper features

## Related Features

The detail page automatically shows related features based on:
- Same category
- Similar tags
- Feature relationships

## SEO Optimization

Both components support:
- Dynamic metadata generation
- Structured data for features
- Breadcrumb navigation
- Open Graph tags
