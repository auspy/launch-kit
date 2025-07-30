# HomePage Component

A flexible, configurable homepage component for LaunchKit-based sites.

## Usage

```jsx
import { HomePage } from '@/screens/home';

const config = {
  hero: {
    title: "Your Product Name",
    description: "Your product description"
  },
  sections: {
    // Configure which sections to show
  }
};

export default function Page() {
  return <HomePage config={config} />;
}
```

## Configuration

### Hero Section (Required)

```jsx
hero: {
  title: "Main headline",
  subtitle: "Optional subtitle",
  description: "Product description or JSX content",
  lessonHeader: false,
  headingClassNames: "custom-classes",
  downloadButtonType: "hero",
  showLogo: true,
  keyPoints: ["Point 1", "Point 2"],
  props: {} // Additional props for Hero component
}
```

### Sections (Optional)

Each section can be enabled/disabled and configured:

```jsx
sections: {
  sectionName: {
    enabled: true,  // Show/hide section
    props: {}       // Props passed to section component
  }
}
```

Available sections:
- `focusLossProblem` - Problem statement section
- `featureBanner` - Feature highlights banner
- `featureList` - Detailed feature list
- `productivityLoss` - Productivity statistics
- `impactSection` - Impact/benefits section
- `trustedBy` - Logo cloud of customers
- `testimonials` - Customer testimonials
- `testimonialSingle` - Featured testimonial
- `pricing` - Pricing cards
- `faq` - Frequently asked questions
- `cta` - Call-to-action section

### Spacing

Customize spacing between sections:

```jsx
spacing: {
  afterHero: "mb-24 md:mb-48 lg:mb-64",
  afterFeatureBanner: "mb-24 md:mb-48 lg:mb-64",
  afterFeatureList: "mb-12 md:mb-24 lg:mb-32",
  afterImpact: "mb-12 md:mb-24 lg:mb-32",
  afterTestimonials: "mb-24 md:mb-48 lg:mb-64",
  betweenSections: "mb-16 md:mb-24 lg:mb-32"
}
```

## Examples

### Minimal Homepage

```jsx
const config = {
  hero: {
    title: "Simple Product",
    description: "A simple description"
  }
  // All sections use defaults
};
```

### Custom Homepage

```jsx
const config = {
  hero: {
    title: "Advanced Product",
    subtitle: "For professionals",
    description: <CustomDescription />,
    showLogo: true
  },
  sections: {
    featureBanner: { enabled: true },
    featureList: { enabled: true },
    pricing: {
      enabled: true,
      props: { showComparison: true }
    },
    faq: {
      enabled: true,
      props: {
        faqs: customFAQs
      }
    }
  }
};
```

## Section Order

The sections appear in this fixed order:
1. Header
2. Hero
3. Focus Loss Problem (if enabled)
4. Feature Banner
5. Feature List
6. Productivity Loss (if enabled)
7. Impact Section
8. Trusted By (if enabled)
9. Testimonials
10. Pricing (if enabled)
11. FAQ (if enabled)
12. CTA
13. Footer

## Customization

To override a specific section's component, pass custom components through props:

```jsx
sections: {
  testimonials: {
    enabled: true,
    props: {
      testimonials: customTestimonialData,
      layout: "grid" // Component-specific props
    }
  }
}
```
