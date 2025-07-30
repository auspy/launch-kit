# Blog Pages Components

Flexible blog system components for LaunchKit-based sites.

## Components

### BlogListPage

Displays a list of blog posts with configurable layout and styling.

```jsx
import { BlogListPage } from '@/screens/blog';
import { getAllPosts } from '@/lib/blog';

const posts = getAllPosts();
const config = {
  title: "Our Blog",
  description: "Latest updates and insights",
  cardStyle: "default" // or "minimal"
};

<BlogListPage posts={posts} config={config} />
```

### BlogPostPage

Displays a single blog post with Markdown rendering and related posts.

```jsx
import { BlogPostPage } from '@/screens/blog';
import { getPostBySlug } from '@/lib/blog';

const post = getPostBySlug(slug);
const config = {
  showAuthor: true,
  showRelatedPosts: true
};

<BlogPostPage post={post} config={config} />
```

## Configuration Options

### BlogListPage Config

```jsx
{
  title: "Blog Title",
  description: "Blog description",
  showHeader: true,
  showFooter: true,
  layout: {
    grid: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    gap: "gap-10",
    container: "container contain max-w-6xl"
  },
  cardStyle: "default", // "default" | "minimal"
  dateFormat: {
    month: "long",
    day: "numeric",
    year: "numeric"
  }
}
```

### BlogPostPage Config

```jsx
{
  showHeader: true,
  showFooter: true,
  showBackLink: true,
  showAuthor: false,
  showCoverImage: true,
  showTags: true,
  showRelatedPosts: true,
  dateFormat: {
    month: "long",
    day: "numeric",
    year: "numeric"
  },
  layout: {
    container: "container max-w-4xl",
    prose: "prose prose-lg dark:prose-invert prose-blue"
  },
  customComponents: {
    beforeContent: null,
    afterContent: null,
    markdown: {} // Custom ReactMarkdown components
  }
}
```

## Blog Utilities

### createBlogUtils

Create blog utilities with custom content directory:

```jsx
import { createBlogUtils } from '@/lib/blog-utils';

// Custom content directory
const { getAllPosts, getPostBySlug } = createBlogUtils('content/articles');

// Default exports for backward compatibility
import { getAllPosts, getPostBySlug } from '@/lib/blog-utils';
```

### Available Functions

- `getAllPosts()` - Get all posts sorted by date
- `getAllPostSlugs()` - Get slugs for static generation
- `getPostBySlug(slug)` - Get single post by slug
- `getRelatedPosts(slug, limit)` - Get related posts by tags/category
- `getPostsByTag(tag)` - Filter posts by tag
- `getAllTags()` - Get all unique tags

## Markdown Front Matter

Expected front matter in your markdown files:

```yaml
---
title: "Post Title"
date: "2024-01-01"
excerpt: "Brief description of the post"
coverImage: "/images/blog/cover.jpg"
author: "Author Name"
authorImage: "/images/authors/author.jpg"
tags: ["productivity", "focus"]
category: "tips"
---
```

## Card Styles

### Default Card
- Image preview
- Date and tags
- Title and excerpt
- Hover effects

### Minimal Card
- Text only
- Simplified layout
- Good for documentation

## Customization Examples

### Custom Newsletter Component

```jsx
const config = {
  customComponents: {
    afterContent: <NewsletterSignup />
  }
};
```

### Custom Markdown Components

```jsx
const config = {
  customComponents: {
    markdown: {
      img: CustomImage,
      code: CustomCodeBlock,
      a: CustomLink
    }
  }
};
```

### Different Grid Layout

```jsx
const config = {
  layout: {
    grid: "grid-cols-1 md:grid-cols-2", // 2 columns max
    gap: "gap-6", // Smaller gap
    container: "container max-w-4xl" // Narrower container
  }
};
```

## SEO Considerations

Both components support:
- Dynamic metadata generation
- Open Graph tags
- Structured data
- Sitemap integration

## Performance

- Static generation support
- Image optimization with Next.js Image
- Code syntax highlighting
- Lazy loading for images
