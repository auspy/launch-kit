# Example: Using LaunchKit for a New Site

## Initial Setup

Before using LaunchKit, ensure your project is configured correctly:

1. **Update tsconfig.json:**
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

2. **Update tailwind.config.ts:**
```javascript
{
  content: [
    // ... your paths
    "./launchkit/**/*.{js,jsx,ts,tsx}",
  ]
}
```

## Step 1: Create Your Site Config

```javascript
// your-new-site/site.config.js
export default {
  siteName: 'FocusPro',
  tagline: 'Stay focused, be productive',
  url: 'https://focuspro.app',

  logo: {
    src: '/logo.svg',
    alt: 'FocusPro Logo'
  },

  colors: {
    primary: '#5B21B6',
    secondary: '#F3F4F6',
    accent: '#8B5CF6'
  },

  features: {
    enableBlog: true,
    enableChangelog: true,
    enableFeatures: true,
    enableChallenges: false
  },

  payment: {
    provider: 'dodo',
    currency: 'USD',
    pricing: {
      monthly: 12.99,
      yearly: 129.99,
      lifetime: 399.99
    }
  }
};
```

## Step 2: Use LaunchKit Pages

```javascript
// your-new-site/app/pricing/page.js
import { PricingPage } from '@/screens/pricing';
import siteConfig from '../../site.config';

const pricingFAQ = [
  {
    question: "How does FocusPro work?",
    answer: "FocusPro helps you stay focused by blocking distracting websites..."
  },
  // Your custom FAQ items
];

export default function Page() {
  return (
    <PricingPage
      siteConfig={siteConfig}
      faqItems={pricingFAQ}
    />
  );
}
```

## Step 3: Use LaunchKit API Routes

### Authentication Routes

```javascript
// your-new-site/app/api/auth/login/route.js
import { createLoginHandler } from '@/api/auth/login';
import siteConfig from '../../../../site.config';

export const POST = createLoginHandler({
  ...siteConfig,
  customValidation: (email) => {
    // Your custom validation logic
    return true;
  }
});
```

### License Management Routes

```javascript
// your-new-site/app/api/license/route.js
import { createLicenseCRUDHandler } from '@/api/license/license-crud';

const handlers = createLicenseCRUDHandler({
  postEnabled: false, // Disable license creation if not needed
  onLicenseRetrieved: async (license, request) => {
    console.log(`License retrieved: ${license.licenseKey}`);
  }
});

export const POST = handlers.POST;
export const GET = handlers.GET;
```

```javascript
// your-new-site/app/api/license/activate/route.js
import { createActivateHandler } from '@/api/license/activate';

export const POST = createActivateHandler({
  logging: true,
  onActivationSuccess: async (response, requestBody) => {
    // Track successful activations
    console.log(`Device activated: ${response.deviceId}`);
  },
  onActivationError: async (error, originalError, requestBody) => {
    // Handle activation failures
    console.error(`Activation failed: ${error.code}`);
  }
});
```

```javascript
// your-new-site/app/api/license/validate/route.js
import { createValidateHandler } from '@/api/license/validate';

export const POST = createValidateHandler({
  supportEmail: 'support@focuspro.app',
  onValidationSuccess: async (response, requestBody) => {
    // Update usage analytics
    console.log(`License validated: ${requestBody.licenseKey}`);
  }
});
```

```javascript
// your-new-site/app/api/license/deactivate/route.js
import { createDeactivateHandler } from '@/api/license/deactivate';

export const DELETE = createDeactivateHandler({
  requireSession: true,
  onDeactivationSuccess: async (response, requestBody) => {
    console.log(`Device deactivated: ${requestBody.deviceId}`);
  }
});
```

```javascript
// your-new-site/app/api/license/info/route.js
import { createInfoHandler } from '@/api/license/info';

export const GET = createInfoHandler({
  requireSession: true,
  projection: {
    licenseKey: 1,
    email: 1,
    status: 1,
    devices: 1,
    createdAt: 1
  }
});
export const dynamic = "force-dynamic";
```

```javascript
// your-new-site/app/api/license/recover/route.js
import { createRecoverHandler } from '@/api/license/recover';

export const POST = createRecoverHandler({
  logging: true,
  licenseStatus: "active",
  onRecoveryRequested: async (email, request) => {
    console.log(`License recovery requested for: ${email}`);
  }
});
```

### Download System Routes

```javascript
// your-new-site/app/api/download/route.js
import { createDownloadHandler, defaultDownloadConfig } from '@/api/download/download-handler';

const handlers = createDownloadHandler({
  ...defaultDownloadConfig,
  requiredUserAgent: 'mac', // Platform requirement
  onDirectDownload: async (downloadUrl, userAgent, ip) => {
    console.log(`Direct download requested from ${userAgent.includes('Mac') ? 'Mac' : 'Unknown'} device`);
    return { downloadUrl };
  },
  onEmailDownload: async (trackableUrl, downloadUrl, userData) => {
    console.log(`Download email sent to ${userData.email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
    return {
      success: true,
      message: "Download link sent to your email",
      trackableUrl,
      downloadUrl,
    };
  }
});

export const GET = handlers.GET;
export const POST = handlers.POST;
```

```javascript
// your-new-site/app/api/download/verify/[token]/route.js
import { createDownloadVerifyHandler, defaultDownloadConfig } from '@/api/download/download-handler';

export const GET = createDownloadVerifyHandler({
  ...defaultDownloadConfig,
  fileName: 'your-app.dmg',
  onTokenVerified: async (tokenData, userAgent, ip) => {
    console.log(`Download token verified for ${tokenData.email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
    return {
      downloadUrl: tokenData.downloadUrl,
      fileName: tokenData.fileName,
      email: tokenData.email,
      emailDomain: tokenData.emailDomain,
      issuedAt: tokenData.issuedAt,
      consentUpdates: tokenData.consentUpdates,
      consentNewsletter: tokenData.consentNewsletter,
    };
  }
});
```

### Contact System Routes

```javascript
// your-new-site/app/api/contact/route.js
import { createContactHandler, defaultContactConfig } from '@/api/contact/contact-handler';

export const POST = createContactHandler({
  ...defaultContactConfig,
  emailSource: "Your Site Contact",
  onContactSubmitted: async (contactData, requestData) => {
    console.log(`Contact form submitted from ${contactData.email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
    return {
      success: true,
      message: "Message sent successfully",
    };
  },
  onEmailProcessing: async (email, messageData) => {
    return {
      ...messageData,
      customVariables: {
        websiteSource: "yoursite.com",
      }
    };
  }
});
```

### Payment System Routes

```javascript
// your-new-site/app/api/create-payment/[type]/route.js
import { createPaymentHandler, defaultPaymentConfig } from '@/api/payment/create-payment';

export const POST = createPaymentHandler({
  ...defaultPaymentConfig,
  onPaymentCreated: async (paymentUrl, requestData) => {
    console.log(`Payment URL created for ${requestData.type} with ${requestData.devices} devices`);
    return paymentUrl;
  }
});
```

```javascript
// your-new-site/app/api/webhooks/dodo/route.js
import { createDodoWebhookHandler } from '@/api/webhooks/dodo-webhook';

export const maxDuration = 30;

export const POST = createDodoWebhookHandler({
  webhookSecret: process.env.DODO_WEBHOOK_SECRET,
  teamProductIds: [process.env.TEAM_PRODUCT_ID].filter(Boolean),
  oneYearProductIds: process.env.ONE_YEAR_UPDATES_PRODUCT_IDS?.split(',') || [],
  logging: true,
  onWebhookReceived: async (event, webhookId) => {
    console.log(`Webhook received: ${event.type} (${webhookId})`);
    return event;
  }
});
```

## Step 4: Use LaunchKit Pages

### Homepage
```javascript
// your-new-site/app/page.js
import { HomePage } from '@/screens/home';
import config from './home.config';

export default function Page() {
  return <HomePage config={config} />;
}
```

### License Dashboard Pages
```javascript
// your-new-site/app/license/dashboard/page.js
import { LicenseDashboardPage } from '@/screens/license';
import Header from '@/components/Header';

export default function Dashboard() {
  const config = {
    headerComponent: Header,
    content: {
      title: "License Information",
      description: "Manage your FocusPro license",
    },
    ui: {
      brandName: "FocusPro",
      showLogoutButton: true,
      showCancelSubscription: true,
    },
    navigation: {
      loginPath: "/license/login",
      pricingPath: "/pricing",
      homePath: "/",
    },
    logging: true,
  };

  return <LicenseDashboardPage config={config} />;
}
```

```javascript
// your-new-site/app/license/login/page.js
import { LicenseLoginPage } from '@/screens/license';
import Logo from '@/components/Logo';

export default function Login() {
  const config = {
    logoComponent: Logo,
    content: {
      title: "Welcome Back",
      subtitle: "Sign in to manage your FocusPro license",
    },
    ui: {
      brandName: "FocusPro",
      showFirebaseAuth: true,
      showEmailLinkAuth: true,
    },
    navigation: {
      dashboardPath: "/license/dashboard",
      contactPath: "/contact",
    },
    logging: true,
  };

  return <LicenseLoginPage config={config} />;
}
```

```javascript
// your-new-site/app/payment-status/page.js
import { PaymentStatusPage } from '@/screens/license';
import Logo from '@/components/Logo';

export default function PaymentStatus() {
  const config = {
    logoComponent: Logo,
    content: {
      successTitle: "Payment Successful!",
      successDescription: "Your FocusPro license has been created",
    },
    ui: {
      brandName: "FocusPro",
      showLicenseKey: true,
      showNextSteps: true,
    },
    nextSteps: [
      {
        title: "Download FocusPro",
        description: "Get started with the Mac app",
        action: { type: "link", href: "/download", text: "Download Now" },
      },
      {
        title: "Set Up Your Account", 
        description: "Create a password to manage your license",
        action: { type: "link", href: "/license/login", text: "Set Up Account" },
      },
    ],
    logging: true,
  };

  return <PaymentStatusPage config={config} />;
}
```

### Download Page
```javascript
// your-new-site/app/download/[token]/page.js
import DownloadPage from '@/screens/download/DownloadPage';
import Logo from '@/components/Logo';

export default function Page() {
  const config = {
    logoComponent: Logo,
    ui: {
      preparingMessage: "Preparing your download...",
      successDescription: "Your download is now starting. Check your Downloads folder.",
    },
    navigation: {
      featuresPath: "/features",
      downloadPath: "/download",
      contactPath: "/contact",
    },
    analytics: {
      // Your analytics integration
    },
    logging: true,
  };

  return <DownloadPage config={config} />;
}
```

### Contact Page
```javascript
// your-new-site/app/contact/page.js
import ContactPage from '@/screens/contact/ContactPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

export default function Page() {
  const config = {
    headerComponent: Header,
    footerComponent: Footer,
    pageHeaderComponent: PageHeader,
    content: {
      title: "Contact Us",
      description: "Have a question or feedback? We'd love to hear from you.",
      marketingConsentLabel: "Send me occasional emails about new features",
    },
    form: {
      defaultMarketingConsent: true,
      showMarketingConsent: true,
    },
    onSubmitSuccess: async (response, formData) => {
      // Custom success handling
      console.log('Contact form submitted successfully');
    },
    logging: true,
  };

  return <ContactPage config={config} />;
}
```

### Changelog Page
```javascript
// your-new-site/app/changelog/page.js
import { ChangelogPage } from '@/screens/changelog';
import { getReleaseData } from '@/lib/changelog';
import siteConfig from '../../site.config';

export default function Page() {
  const releases = getReleaseData();
  
  const config = {
    siteConfig,
    releases,
    pageHeader: {
      badge: "Release Notes",
      title: "What's New in FocusPro?",
      description: "Keep track of the latest features, improvements, and bug fixes"
    },
    showVersionNavigation: true,
    releaseDetailPath: "/releases"
  };

  return <ChangelogPage {...config} />;
}
```

### Roadmap Page
```javascript
// your-new-site/app/roadmap/page.js (or whats-next/page.js)
import { RoadmapPage } from '@/screens/roadmap';
import siteConfig from '../../site.config';

export default function Page() {
  const config = {
    siteConfig,
    pageHeader: {
      badge: "Vision", 
      title: "What's Next for FocusPro",
      description: "Enhancing your focus experience, one feature at a time"
    },
    progressSection: {
      title: "Recent Progress",
      description: "What we've accomplished recently",
      changelogLink: "/changelog",
      items: [
        {
          icon: "sparkles",
          title: "Enhanced Analytics",
          description: "Detailed insights into your productivity patterns with timeline view."
        },
        {
          icon: "shield", 
          title: "Advanced Blocking",
          description: "Smarter app and website blocking with context-aware rules."
        }
      ]
    },
    comingSoonSection: {
      title: "Coming Soon",
      items: [
        {
          priority: "high",
          badge: "Main Focus",
          title: "iOS Companion App",
          description: "Stay focused on mobile with our upcoming iOS app.",
          icon: "shield",
          features: [
            "Real-time sync with desktop app",
            "Mobile-optimized focus sessions",
            "Cross-device analytics"
          ]
        }
      ]
    },
    callToAction: {
      title: "Help Shape FocusPro's Future",
      description: "Your feedback drives our development. Tell us what features matter most to you.",
      buttonText: "Share Your Ideas",
      buttonLink: "/contact"
    }
  };

  return <RoadmapPage {...config} />;
}
```

### Release Detail Page
```javascript
// your-new-site/app/releases/[slug]/page.js
import { ReleaseDetailPage } from '@/screens/release';
import { getReleaseBySlug, getReleaseData } from '@/lib/changelog';
import { notFound } from 'next/navigation';
import siteConfig from '../../../site.config';

export async function generateStaticParams() {
  const releases = getReleaseData();
  return releases.map((release) => ({
    slug: release.slug,
  }));
}

export async function generateMetadata({ params }) {
  const release = getReleaseBySlug(params.slug);
  
  if (!release) {
    return {
      title: "Release Not Found - FocusPro",
      description: "The requested release could not be found."
    };
  }

  return {
    title: `${release.title} - FocusPro Release Notes`,
    description: release.seoDescription,
    openGraph: {
      title: release.title,
      description: release.seoDescription,
      type: "article",
      publishedTime: release.date,
    }
  };
}

export default function Page({ params }) {
  const release = getReleaseBySlug(params.slug);
  const allReleases = getReleaseData();
  
  if (!release) {
    notFound();
  }

  const config = {
    siteConfig,
    release,
    allReleases,
    backToChangelogPath: "/changelog",
    pageTitle: "FocusPro Release Notes",
    pageDescription: "Detailed information about FocusPro releases and updates"
  };

  return <ReleaseDetailPage {...config} />;
}
```

## Step 5: Override Specific Components

```javascript
// your-new-site/components/CustomHero.jsx
import { Hero } from '@/components/homePage';

export default function CustomHero(props) {
  return (
    <Hero {...props}>
      {/* Your custom hero content */}
      <div className="custom-animation">
        {/* Custom elements */}
      </div>
    </Hero>
  );
}
```

## File Structure for New Site

```
your-new-site/
├── app/
│   ├── page.js              # Uses LaunchKit components
│   ├── pricing/
│   │   └── page.js          # Imports from LaunchKit
│   ├── api/
│   │   └── [routes]         # Minimal wrappers around LaunchKit
│   └── layout.js
├── components/
│   └── [custom-components]  # Site-specific components only
├── public/
│   └── [assets]            # Site-specific assets
├── site.config.js          # Your configuration
├── package.json
└── next.config.js
```

## Package.json Example

```json
{
  "name": "focuspro-site",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    // Link to local launchkit or publish as npm package
    // Option 1: Local development
    // "@your-org/launchkit": "file:../launchkit"
    // Option 2: Published package
    // "@your-org/launchkit": "^1.0.0"
  }
}
```

## Benefits

1. **Rapid Setup**: New site up in hours, not weeks
2. **Consistent Updates**: Bug fixes apply to all sites
3. **Customizable**: Override any component
4. **Maintainable**: Single source of truth
5. **Scalable**: Add new sites easily
