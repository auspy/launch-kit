# LaunchKit

A reusable component library and framework for quickly launching SaaS websites with Next.js.

## Overview

LaunchKit provides a comprehensive set of components, utilities, and page templates that can be configured and customized for different SaaS products. It includes everything needed to launch a professional website: landing pages, pricing, blog, features showcase, authentication, licensing, and payment processing.

## Quick Start

1. **Set up your project's configuration files:**

```javascript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./launchkit",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

2. **Update Tailwind configuration:**

```javascript
// tailwind.config.ts
{
  content: [
    // ... your existing paths
    "./launchkit/**/*.{js,jsx,ts,tsx}",
  ]
}
```

3. **Create your site configuration:**

```javascript
// site.config.js
export default {
  siteName: 'Your Product',
  tagline: 'Your tagline',
  // ... see site.config.template.js
}
```

4. **Use LaunchKit screens in your pages:**

```javascript
// app/page.js
import { HomePage } from '@/screens/home';
import config from './home.config';

export default function Page() {
  return <HomePage config={config} />;
}
```

5. **Use LaunchKit API handlers:**

```javascript
// app/api/auth/login/route.js
import { createLoginHandler } from '@/api/auth/login';

export const POST = createLoginHandler({
  supportEmail: 'support@yoursite.com'
});
```

```javascript
// app/api/license/activate/route.js
import { createActivateHandler } from '@/api/license/activate';

export const POST = createActivateHandler({
  logging: true,
  onActivationSuccess: async (response, requestBody) => {
    // Custom success logic
  }
});
```

6. **Use LaunchKit download system:**

```javascript
// app/api/download/route.js
import { createDownloadHandler, defaultDownloadConfig } from '@/api/download/download-handler';

const handlers = createDownloadHandler({
  ...defaultDownloadConfig,
  onEmailDownload: async (trackableUrl, downloadUrl, userData) => {
    // Custom download processing
    return { success: true, message: "Download link sent", trackableUrl, downloadUrl };
  }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
```

7. **Use LaunchKit contact system:**

```javascript
// app/api/contact/route.js
import { createContactHandler, defaultContactConfig } from '@/api/contact/contact-handler';

export const POST = createContactHandler({
  ...defaultContactConfig,
  onContactSubmitted: async (contactData, requestData) => {
    // Custom contact processing
    return { success: true, message: "Message sent successfully" };
  }
});
```

8. **Use LaunchKit license dashboard:**

```javascript
// app/license/dashboard/page.js
import { LicenseDashboardPage } from '@/screens/license';
import Header from "@/components/Header";

export default function Dashboard() {
  const config = {
    headerComponent: Header,
    ui: { brandName: "Your App" },
    navigation: {
      loginPath: "/license/login",
      pricingPath: "/pricing",
    },
    logging: true,
  };

  return <LicenseDashboardPage config={config} />;
}
```

```javascript
// app/license/login/page.js
import { LicenseLoginPage } from '@/screens/license';
import Logo from "@/components/Logo";

export default function Login() {
  const config = {
    logoComponent: Logo,
    ui: { brandName: "Your App" },
    navigation: { dashboardPath: "/license/dashboard" },
  };

  return <LicenseLoginPage config={config} />;
}
```

## Directory Structure

```
launchkit/
├── screens/          # Full page components (home, pricing, blog, license, etc.)
├── components/       # Reusable UI components
├── lib/             # Utilities and business logic
├── adapters/        # Database adapters
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
└── api/             # API route handlers
    ├── auth/         # Authentication handlers
    ├── license/      # License management handlers
    ├── payment/      # Payment and webhook handlers
    ├── download/     # Download system handlers
    ├── contact/      # Contact form handlers
    └── webhooks/     # Webhook processing handlers
```

### Key Directories

- **`screens/`** - Complete page components that can be imported and configured
  - `home/` - Configurable homepage with sections
  - `pricing/` - Pricing page with multiple card layouts
  - `blog/` - Blog listing and post pages
  - `features/` - Feature showcase pages
  - `download/` - Secure download pages with token verification
  - `contact/` - Contact form pages with validation
  - `license/` - License management dashboard and authentication pages
  - `changelog/` - Release history pages with version navigation
  - `roadmap/` - Product roadmap and what's next pages
  - `release/` - Individual release detail pages

- **`components/`** - Smaller reusable components organized by type
  - `buttons/` - CTA buttons with A/B testing support
  - `pricing/` - Pricing cards and selectors
  - `features/` - Feature cards and grids
  - `testimonials/` - Customer testimonials
  - `ui/` - Base UI components (buttons, cards, dialogs)

- **`lib/`** - Core functionality
  - `features/` - Feature data and landing pages
  - `license/` - License management
  - `dodo/` - Payment processing
  - `blog-utils.js` - Blog utilities

- **`api/`** - Configurable API route handlers
  - `auth/` - Authentication (login, logout, Firebase)
  - `license/` - License management (CRUD, activation, validation, recovery)
  - `payment/` - Payment processing (creation, status, discounts)
  - `download/` - Secure download system (tokens, verification, file serving)
  - `contact/` - Contact form processing (validation, email integration)
  - `webhooks/` - Webhook processing (payment events, license updates)

## Configuration

LaunchKit uses a configuration-driven approach. Each screen accepts a config object:

```javascript
const homepageConfig = {
  hero: {
    title: "Your Title",
    description: "Your description"
  },
  sections: {
    features: { enabled: true },
    testimonials: { enabled: true },
    pricing: { enabled: false }
  }
};
```

## Import Conventions

With `baseUrl` set to `./launchkit`, imports use the `@/` prefix:

```javascript
// From within launchkit or your app
import { HomePage } from '@/screens/home';
import { Button } from '@/components/ui/button';
import { getAllPosts } from '@/lib/blog';
```

## Customization

1. **Override Components**: Pass custom components through config
2. **Styling**: Use Tailwind classes or custom CSS
3. **Content**: All text and images are configurable
4. **Features**: Enable/disable sections as needed

## Common Issues

1. **CSS not working**: Ensure `./launchkit/**/*.{js,jsx,ts,tsx}` is in your Tailwind config
2. **Import errors**: Check that `baseUrl` is set to `./launchkit` in tsconfig.json
3. **Server component errors**: Use `ButtonMainCTAClient` in client components

## Examples

See `EXAMPLE_IMPLEMENTATION.md` for complete examples of using LaunchKit in a new project.

## Migration

If migrating an existing site, see `MIGRATION_GUIDE.md` for step-by-step instructions.