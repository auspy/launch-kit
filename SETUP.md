# LaunchKit Setup Guide

This guide covers the essential setup steps for using LaunchKit in your Next.js project.

## Required Configuration

### 1. TypeScript Configuration (tsconfig.json)

Update your `tsconfig.json` to set the base URL and path mappings:

```json
{
  "compilerOptions": {
    "baseUrl": "./launchkit",
    "paths": {
      "@/*": ["./*"],
      "scn/*": ["./components/scn/*"]
    }
  }
}
```

This allows you to import LaunchKit modules using the `@/` prefix:
```javascript
import { HomePage } from '@/screens/home';
import { Button } from '@/components/ui/button';
```

### 2. Tailwind Configuration (tailwind.config.ts)

Add the LaunchKit directory to your Tailwind content paths:

```javascript
const config = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./launchkit/**/*.{js,jsx,ts,tsx}", // Add this line
  ],
  // ... rest of config
}
```

This ensures Tailwind processes all CSS classes used in LaunchKit components.

### 3. CSS Import

Ensure your main layout or app file imports the global CSS:

```javascript
// app/layout.js or _app.js
import "./globals.css";
```

Your `globals.css` should include Tailwind directives:
```css
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

## Project Structure

```
your-project/
├── app/                    # Your Next.js app directory
│   ├── layout.js          # Import globals.css here
│   ├── page.js            # Uses LaunchKit screens
│   └── globals.css        # Tailwind imports
├── launchkit/             # LaunchKit directory
│   ├── screens/           # Page components
│   ├── components/        # UI components
│   └── lib/              # Utilities
├── tsconfig.json          # TypeScript config
└── tailwind.config.ts     # Tailwind config
```

## Common Issues and Solutions

### Issue: CSS/Tailwind classes not working

**Solution**: Ensure `./launchkit/**/*.{js,jsx,ts,tsx}` is in your Tailwind config's content array.

### Issue: Import errors with @/ prefix

**Solution**: Check that `baseUrl` is set to `"./launchkit"` in tsconfig.json.

### Issue: Server component errors in client components

**Solution**: When using ButtonMainCTA in client components, import the client version:
```javascript
// Wrong
import ButtonMainCTA from "@/components/buttons/ButtonMainCTA";

// Correct for client components
import { ButtonMainCTAClient as ButtonMainCTA } from "@/components/buttons/ButtonMainCTA";
```

### Issue: Module not found errors

**Solution**: Ensure the launchkit directory exists and contains the expected structure. Check file paths are correct.

## Environment Variables

Some LaunchKit features require environment variables. Create a `.env.local` file:

```bash
# Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Payment Processing (Dodo)
DODO_API_KEY=your_api_key
DODO_WEBHOOK_SECRET=your_webhook_secret

# Authentication
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Database
MONGODB_URI=your_mongodb_uri
```

## Quick Start Checklist

- [ ] Update tsconfig.json with baseUrl and paths
- [ ] Add launchkit to Tailwind content paths
- [ ] Import globals.css in your layout
- [ ] Set up required environment variables
- [ ] Create site.config.js with your settings
- [ ] Import and use LaunchKit screens

## Next Steps

1. Copy `site.config.template.js` to create your site configuration
2. Start using LaunchKit screens in your pages
3. Customize components through configuration
4. Override styles with Tailwind classes as needed

For migration from an existing site, see `MIGRATION_GUIDE.md`.
For usage examples, see `EXAMPLE_IMPLEMENTATION.md`.