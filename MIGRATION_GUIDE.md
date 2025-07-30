# LaunchKit Migration Guide

## Overview
This guide explains how to incrementally migrate app-specific files to the LaunchKit for reuse across multiple sites.

## Migration Pattern

### 1. Generic Component in LaunchKit
Create a generic version that accepts configuration:

```jsx
// launchkit/screens/pricing/PricingPage.jsx
export default function PricingPage({ siteConfig, faqItems, localePricing }) {
  // Generic implementation using props
}
```

### 2. Site-Specific Implementation
Import and configure the generic component:

```jsx
// app/pricing/page.js
import { PricingPage } from '@/screens/pricing';
import siteConfig from '../site.config';
import { pricingFAQ } from '../content/faq';

export default function Page() {
  return (
    <PricingPage
      siteConfig={siteConfig}
      faqItems={pricingFAQ}
      localePricing={{
        enabled: true,
        allowedTimezones: ["Asia/Kolkata", "IST"],
        redirectPath: "/in/pricing"
      }}
    />
  );
}
```

## API Routes Migration

### 1. Generic Handler in LaunchKit
```javascript
// launchkit/api/auth/login/handler.js
export function createLoginHandler(config) {
  return async function handler(req, res) {
    // Generic login logic using config
  };
}
```

### 2. Site-Specific Route
```javascript
// app/api/auth/login/route.js
import { createLoginHandler } from '@/api/auth/login/handler';
import siteConfig from '../../../../site.config';

export const POST = createLoginHandler(siteConfig);
```

## Directory Structure

```
launchkit/
├── pages/                    # Reusable page components
│   ├── pricing/
│   ├── blog/
│   ├── features/
│   └── ...
├── api/                      # API route handlers
│   ├── auth/
│   ├── license/
│   ├── payment/
│   └── ...
├── components/              # Already migrated
├── lib/                     # Already migrated
└── site.config.template.js  # Configuration template
```

## Phase-by-Phase Migration

### Phase 1 (Completed)
- [x] Homepage
- [x] Pricing pages
- [x] Blog system (list & post pages)
- [x] Feature pages (list & detail)
- [x] Auth API routes (login, logout, Firebase)
- [x] License API routes (CRUD, activation, validation, recovery)
- [x] Payment API routes (creation, status, email retrieval, discounts)
- [x] Webhook processing (payment events, subscription management)
- [x] Download system (secure tokens, email delivery, verification)
- [x] Contact system (form processing, email integration)
- [x] License dashboard pages (complete user management interface)
  - [x] License dashboard (main management page)
  - [x] License login (authentication with Firebase/Email)
  - [x] Password management (set/reset password)
  - [x] License recovery (email-based key recovery)
  - [x] Payment status (post-purchase verification)

### Phase 2 (Optional)
- [ ] Content pages (challenges, changelog, releases)
- [ ] Additional utility API routes (onboarding, waitlist)

### Phase 3 (Optional)
- [ ] Static pages (privacy, terms)
- [ ] Error pages
- [ ] Utility pages

## Required Setup

### 1. Update tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": "./launchkit",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 2. Update tailwind.config.ts
```javascript
{
  content: [
    // ... existing paths
    "./launchkit/**/*.{js,jsx,ts,tsx}",
  ]
}
```

This ensures Tailwind processes all LaunchKit component classes.

## Configuration Points

Each migrated component should support these configuration points:

1. **Content**: Text, images, FAQs
2. **Features**: Enable/disable functionality
3. **Styling**: Colors, fonts, layouts
4. **Business Logic**: Pricing, payment providers
5. **Localization**: Multi-language, regional pricing

## Testing Strategy

1. Create a test site using the LaunchKit
2. Import components one by one
3. Verify functionality matches original
4. Document any breaking changes

## Best Practices

1. **Keep it Generic**: Avoid hardcoding site-specific values
2. **Use Props**: Pass configuration through props
3. **Document Dependencies**: List required config fields
4. **Maintain Compatibility**: Don't break existing sites
5. **Version Control**: Tag stable releases

## Example: Migrating a Page

1. Copy page to `launchkit/screens/[feature]/`
2. Replace hardcoded values with props
3. Create index.js for exports
4. Update original page to import from LaunchKit
5. Test thoroughly
6. Document configuration options
