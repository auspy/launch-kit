// Template for site configuration
// Import this in your site and customize as needed
// Example usage:
//   import { HomePage } from '@/screens/home';
//   import siteConfig from './site.config';

export default {
  // Basic Info
  siteName: 'Your Product Name',
  tagline: 'Your Product Tagline',
  url: 'https://yoursite.com',
  
  // Branding
  logo: {
    src: '/logo.svg',
    alt: 'Product Logo'
  },
  colors: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#0066cc'
  },
  
  // Features & Content
  features: {
    enableBlog: true,
    enableChangelog: true,
    enableFeatures: true,
    enableChallenges: false
  },
  
  // Payment & Licensing
  payment: {
    provider: 'dodo', // or 'stripe', 'lemonsqueezy'
    currency: 'USD',
    pricing: {
      monthly: 9.99,
      yearly: 99.99,
      lifetime: 299.99
    }
  },
  
  // Analytics & Tracking
  analytics: {
    posthog: {
      apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST
    }
  },
  
  // SEO & Meta
  seo: {
    title: 'Your Product - Default Title',
    description: 'Your product description',
    keywords: ['keyword1', 'keyword2']
  },
  
  // Contact & Support
  contact: {
    email: 'support@yoursite.com',
    social: {
      twitter: '@yourhandle',
      github: 'yourgithub'
    }
  }
};