# Release Detail Page Component

A detailed release page component that displays comprehensive information about a specific software release, including content, navigation, and download options.

## Usage

```jsx
import { ReleaseDetailPage } from '@/launchkit/screens/release';

const release = {
  version: "1.2.0",
  title: "Enhanced Analytics Dashboard",
  slug: "v1-2-0-enhanced-analytics",
  date: "2024-01-15",
  content: `## What's New\n\nThis release includes major improvements to the analytics dashboard...`
};

const allReleases = [
  release,
  // ... other releases for navigation
];

const config = {
  siteConfig: {
    // Your site configuration
  },
  release: release,
  allReleases: allReleases
};

export default function Page({ params }) {
  return <ReleaseDetailPage {...config} />;
}
```

## Props

### siteConfig (required)
Main site configuration object passed to Header and SiteFooter components.

### release (required)
The release object to display:

```jsx
{
  version: "1.2.0", // Version number
  title: "Release Title", // Display title  
  slug: "release-slug", // URL slug
  date: "2024-01-15", // Release date
  content: "## Markdown content..." // Full release notes in markdown
}
```

### allReleases (optional)
Array of all releases for navigation (previous/next). Default: `[]`

```jsx
[
  {
    version: "1.2.0",
    title: "Release Title",
    slug: "release-slug",
    // ... other release properties
  }
]
```

### backToChangelogPath (optional)
Path to return to changelog page. Default: `"/changelog"`

### className (optional)
CSS classes for the main container. Default: `"min-h-screen bg-gray-50"`

### pageTitle (optional)
Title for the page header section. Default: `"Release Notes"`

### pageDescription (optional)
Description for the page header section. Default: `"Detailed information about app releases and updates"`

## Features

- **Release Header**: Version badge, date, and title display
- **Markdown Content**: Full release notes rendered from markdown
- **Download Section**: Download buttons for the release
- **Navigation**: Previous/next release navigation
- **Back to Changelog**: Easy navigation back to full changelog
- **Error Handling**: Graceful handling of missing releases
- **Responsive Design**: Mobile-friendly layout

## Release Object Structure

The release object should contain:

```jsx
{
  version: "1.2.0", // Required: Version number for display and navigation
  title: "Release Title", // Required: Human-readable title
  slug: "release-slug", // Required: URL-safe slug for routing
  date: "2024-01-15", // Required: Release date (formatted string)
  content: "## Markdown content...", // Required: Full release notes in markdown format
}
```

## Navigation Logic

The component automatically determines previous/next releases from the `allReleases` array:
- **Previous Release**: The release that comes after current in the array (older)
- **Next Release**: The release that comes before current in the array (newer)
- Navigation buttons only appear when previous/next releases exist

## Error States

When `release` is null or undefined:
- Shows "Release Not Found" page
- Maintains header/footer layout
- Provides user-friendly error message

## Integration with ReleaseDetail Component

This page component wraps the existing `ReleaseDetail` LaunchKit component and adds:
- Proper page structure with header/footer
- Page title section
- Error handling
- Consistent styling

## Customization

The component uses several sub-components:

- `Header` - Site header from LaunchKit
- `SiteFooter` - Site footer from LaunchKit  
- `ReleaseDetail` - Main content component from LaunchKit

To customize the content display, modify the `ReleaseDetail` component.

## Styling

The component uses Tailwind CSS classes:
- Container: Standard LaunchKit page structure
- Header section: `bg-white border-b` with centered content
- Error state: Centered layout with clear messaging

## SEO Considerations

For Next.js applications, you'll typically want to generate metadata:

```jsx
export async function generateMetadata({ params }) {
  const release = getReleaseBySlug(params.slug);
  
  if (!release) {
    return {
      title: "Release Not Found",
      description: "The requested release could not be found."
    };
  }

  return {
    title: `${release.title} - Release Notes`,
    description: release.seoDescription || `Release notes for version ${release.version}`,
    openGraph: {
      title: release.title,
      description: release.seoDescription,
      type: "article",
      publishedTime: release.date,
    }
  };
}
```

## Static Generation

For static sites, implement static params generation:

```jsx
export async function generateStaticParams() {
  const slugs = getAllReleaseSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}
```

## Dependencies

- `@/launchkit/components/Header` - LaunchKit header component
- `@/launchkit/components/SiteFooter` - LaunchKit footer component  
- `@/launchkit/components/ReleaseDetail` - Main release detail component

## Integration

This component is designed to work with:
- Dynamic routing systems (Next.js app router, etc.)
- Changelog data management systems
- Download/release management systems
- SEO and metadata generation