# Pricing Page Component

A flexible pricing page component that supports multiple pricing tiers, FAQ sections, and locale-specific pricing.

## Usage

```jsx
import { PricingPage } from '@/screens/pricing';

const faqItems = [
  {
    question: "How does billing work?",
    answer: "We offer monthly and annual billing options..."
  }
];

const config = {
  siteConfig: {
    payment: {
      currency: "USD",
      pricing: {
        monthly: 9.99,
        yearly: 99.99,
        lifetime: 299.99
      }
    }
  },
  faqItems: faqItems,
  localePricing: {
    enabled: true,
    allowedTimezones: ["Asia/Kolkata", "IST"],
    redirectPath: "/in/pricing"
  }
};

export default function Page() {
  return <PricingPage {...config} />;
}
```

## Props

### siteConfig (required)
Main site configuration object containing payment settings:

```jsx
{
  payment: {
    provider: 'dodo', // Payment provider
    currency: 'USD',
    pricing: {
      monthly: 9.99,
      yearly: 99.99,
      lifetime: 299.99
    }
  }
}
```

### faqItems (required)
Array of FAQ items to display below pricing cards:

```jsx
[
  {
    question: "Question text",
    answer: "Answer text or JSX content"
  }
]
```

### localePricing (optional)
Configuration for locale-specific pricing (e.g., PPP - Purchasing Power Parity):

```jsx
{
  enabled: true,
  allowedTimezones: ["Asia/Kolkata", "IST", "Asia/Calcutta"],
  redirectPath: "/in/pricing" // Where to redirect for local pricing
}
```

## Features

- **Multiple Pricing Cards**: Uses PricingCards3 component by default
- **FAQ Section**: Customizable FAQ items below pricing
- **Locale Detection**: Automatic timezone detection for regional pricing
- **Cookie Support**: Remembers user's pricing preference
- **Responsive Design**: Mobile-friendly layout

## Customization

The component uses several sub-components that can be customized:

- `Header` - Site header
- `PricingCards3` - The pricing cards component
- `FAQ` - FAQ section component
- `SiteFooter` - Site footer

To use a different pricing card layout, modify the import:

```jsx
import PricingCards from "@/components/pricing/PricingCards";
// or
import PricingCards2 from "@/components/pricing/PricingCards2";
```

## Locale-Specific Pricing

The component supports automatic redirection based on user timezone:

1. Detects user's timezone using `Intl.DateTimeFormat`
2. Checks if timezone matches allowed list
3. Redirects to locale-specific pricing page
4. Uses cookie to remember preference

Users can override the redirect by setting a `preferStandardPricing` cookie.

## Example: India Pricing

```jsx
const localePricing = {
  enabled: true,
  allowedTimezones: [
    "Asia/Kolkata",
    "IST",
    "Asia/Calcutta" // legacy timezone
  ],
  redirectPath: "/in/pricing"
};
```

## Styling

The component uses Tailwind CSS classes:
- Container: `container contain max-w-6xl px-4 py-12 md:py-16`
- Background: `min-h-screen bg-white`
- FAQ spacing: `mt-8`

## Dependencies

- `next/navigation` - For redirect functionality
- `cookies-next` - For cookie management
- `@/components/*` - Various UI components