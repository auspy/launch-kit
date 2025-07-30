# License Management Screens

Complete license management system for LaunchKit applications, providing secure authentication, license dashboard, password management, and payment verification screens.

## Overview

The license system provides a comprehensive solution for SaaS applications to manage user licenses, including authentication, device management, subscription handling, and payment verification. All screens are fully configurable and preserve original functionality while adding extensive customization capabilities.

## Available Screens

### LicenseDashboardPage
Main license management dashboard where users can view and manage their licenses.

**Features:**
- License information display (key, email, type, device limits)
- License status badges (active, cancelled, expired)
- Device management (view and remove activated devices)
- Subscription management (cancel subscriptions, view billing dates)
- License key copying functionality
- Logout functionality

**Usage:**
```javascript
import { LicenseDashboardPage } from '@/screens/license';
import Header from '@/components/Header';

export default function Dashboard() {
  const config = {
    headerComponent: Header,
    ui: { brandName: "Your App" },
    navigation: {
      loginPath: "/license/login",
      pricingPath: "/pricing",
    },
    features: {
      copyLicenseKey: true,
      deviceRemoval: true,
      subscriptionCancellation: true,
    },
    logging: true,
  };

  return <LicenseDashboardPage config={config} />;
}
```

### LicenseLoginPage
Authentication page for license holders with multiple sign-in options.

**Features:**
- Firebase Authentication integration
- Email Magic Link authentication
- Device attribution for analytics
- Sign-up/Sign-in mode toggle
- Comprehensive error handling

**Usage:**
```javascript
import { LicenseLoginPage } from '@/screens/license';
import Logo from '@/components/Logo';

export default function Login() {
  const config = {
    logoComponent: Logo,
    ui: {
      brandName: "Your App",
      showFirebaseAuth: true,
      showEmailLinkAuth: true,
    },
    navigation: {
      dashboardPath: "/license/dashboard",
      contactPath: "/contact",
    },
    features: {
      deviceAttribution: true,
      postHogTracking: true,
    },
  };

  return <LicenseLoginPage config={config} />;
}
```

### LicenseSetPasswordPage
Initial password setup for new license holders.

**Features:**
- License key and email verification
- Password strength validation (configurable)
- Password confirmation matching
- Success state with redirect to login

**Usage:**
```javascript
import { LicenseSetPasswordPage } from '@/screens/license';
import Logo from '@/components/Logo';

export default function SetPassword() {
  const config = {
    logoComponent: Logo,
    validation: {
      passwordMinLength: 8,
      passwordMinLengthMessage: "Password must be at least 8 characters",
    },
    navigation: {
      loginPath: "/license/login",
      contactPath: "/contact",
    },
  };

  return <LicenseSetPasswordPage config={config} />;
}
```

### LicenseResetPasswordPage
Password reset functionality for existing license holders.

**Features:**
- License key and email verification
- New password validation
- Auto-redirect to login on success
- Comprehensive error handling

**Usage:**
```javascript
import { LicenseResetPasswordPage } from '@/screens/license';
import Logo from '@/components/Logo';

export default function ResetPassword() {
  const config = {
    logoComponent: Logo,
    api: {
      endpoint: "/api/license/password/reset",
    },
    navigation: {
      loginPath: "/license/login",
    },
  };

  return <LicenseResetPasswordPage config={config} />;
}
```

### LicenseRecoveryPage
License key recovery via email for existing customers.

**Features:**
- Email-based license key lookup
- Success state with instructions
- Email delivery confirmation
- Clear error messaging

**Usage:**
```javascript
import { LicenseRecoveryPage } from '@/screens/license';
import Logo from '@/components/Logo';

export default function RecoverLicense() {
  const config = {
    logoComponent: Logo,
    content: {
      title: "Recover License Key",
      successTitle: "License Key Sent!",
      successDescription: "Check your email for your license key",
    },
    ui: {
      showSuccessIcon: true,
    },
  };

  return <LicenseRecoveryPage config={config} />;
}
```

### PaymentStatusPage
Post-purchase payment verification and license delivery.

**Features:**
- Payment status verification with auto-refresh
- License key display for successful payments
- Configurable next steps with actions
- Failed payment handling with retry options
- Comprehensive error states

**Usage:**
```javascript
import { PaymentStatusPage } from '@/screens/license';
import Logo from '@/components/Logo';

export default function PaymentStatus() {
  const config = {
    logoComponent: Logo,
    ui: {
      brandName: "Your App",
      showLicenseKey: true,
      showNextSteps: true,
      autoRefreshOnFailed: true,
    },
    nextSteps: [
      {
        title: "Download the App",
        description: "Get started by downloading the application",
        action: { type: "link", href: "/download", text: "Download Now" },
      },
      {
        title: "Set Up Your Account",
        description: "Create a password to manage your license",
        action: { type: "link", href: "/license/login", text: "Set Up Account" },
      },
    ],
  };

  return <PaymentStatusPage config={config} />;
}
```

## Configuration Options

### Common Configuration Properties

All license screens support these common configuration properties:

```javascript
{
  // Logo component
  logoComponent: Logo,
  
  // Content customization
  content: {
    title: "Custom Title",
    subtitle: "Custom subtitle",
    // ... screen-specific content options
  },
  
  // Navigation paths
  navigation: {
    loginPath: "/license/login",
    dashboardPath: "/license/dashboard",
    contactPath: "/contact",
    // ... screen-specific navigation options
  },
  
  // UI customization
  ui: {
    brandName: "Your App",
    // ... screen-specific UI options
  },
  
  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    // ... screen-specific API options
  },
  
  // Feature toggles
  features: {
    // ... screen-specific feature toggles
  },
  
  // Customization hooks
  onSuccess: async (data) => { /* custom logic */ },
  onError: async (error) => { /* custom error handling */ },
  
  // Additional components
  additionalContent: <CustomComponent />,
  
  // Styling
  className: "custom-classes",
  
  // Logging
  logging: true,
}
```

### Screen-Specific Configuration

Each screen has specific configuration options. See the individual screen documentation above for detailed configuration examples.

## Integration Requirements

### Required Dependencies
- `@/components/ui/*` - Shadcn/ui components
- `@/hooks/use-toast` - Toast notifications
- `@/contexts/auth.context` - Authentication context
- `@/constants` - Application constants
- Various UI libraries (lucide-react, etc.)

### Required API Endpoints
- `/api/license/info` - License information retrieval
- `/api/license/deactivate` - Device deactivation
- `/api/license/cancel` - Subscription cancellation
- `/api/license/password/set` - Password setup
- `/api/license/password/reset` - Password reset
- `/api/license/recover` - License key recovery
- `/api/payment-status` - Payment verification

### Authentication Context
All screens expect an authentication context with:
```javascript
{
  login: (email, password, licenseKey, deviceId) => Promise,
  logout: () => Promise,
  user: Object,
  error: String,
  clearError: () => void,
}
```

## Best Practices

1. **Branding Consistency**: Use consistent `brandName` across all screens
2. **Navigation Flow**: Ensure navigation paths are correctly configured for your app structure
3. **Error Handling**: Implement custom error handlers for better user experience
4. **Logging**: Enable logging in development for debugging
5. **Customization**: Use customization hooks to add app-specific functionality
6. **Security**: Ensure all API endpoints are properly secured
7. **Testing**: Test the complete license management flow end-to-end

## Security Considerations

- All screens handle sensitive license information securely
- Password validation follows security best practices
- License keys are partially masked in logs
- Device management includes proper authorization checks
- Email-based recovery includes rate limiting protection

## Migration from Existing Implementation

When migrating from an existing license management system:

1. **Preserve API Contracts**: The screens work with existing API endpoints
2. **Maintain Authentication Flow**: Integration with existing auth context
3. **Customize Gradually**: Start with basic configuration, add customizations incrementally  
4. **Test Thoroughly**: Verify all license management flows work correctly
5. **Update Navigation**: Ensure all navigation paths point to correct routes

See the main MIGRATION_GUIDE.md for detailed migration instructions.