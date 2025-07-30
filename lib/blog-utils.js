import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Create blog utility functions with custom content directory
 * @param {string} contentDir - Path to blog content directory
 */
export function createBlogUtils(contentDir = "content/blog") {
  const postsDirectory = path.join(process.cwd(), contentDir);

  /**
   * Get all blog posts metadata
   */
  function getAllPosts() {
    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    // Get file names under content directory
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, "");

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // Use gray-matter to parse the post metadata section
        const { data: frontmatter } = matter(fileContents);

        // Combine the data with the slug
        return {
          slug,
          ...frontmatter,
          date: frontmatter.date
            ? new Date(frontmatter.date).toISOString()
            : null,
        };
      });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  /**
   * Get all blog post slugs
   */
  function getAllPostSlugs() {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => ({
        params: {
          id: fileName.replace(/\.md$/, ""),
        },
      }));
  }

  /**
   * Get a single blog post by slug
   */
  function getPostBySlug(slug) {
    if (!fs.existsSync(postsDirectory)) {
      return null;
    }

    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data: frontmatter, content } = matter(fileContents);

    return {
      slug,
      content,
      ...frontmatter,
      date: frontmatter.date
        ? new Date(frontmatter.date).toISOString()
        : null,
    };
  }

  /**
   * Get related posts based on tags or category
   */
  function getRelatedPosts(currentSlug, limit = 3) {
    const currentPost = getPostBySlug(currentSlug);
    if (!currentPost) return [];

    const allPosts = getAllPosts();
    
    // Filter out current post and score others by relevance
    const scoredPosts = allPosts
      .filter(post => post.slug !== currentSlug)
      .map(post => {
        let score = 0;
        
        // Score by matching tags
        if (currentPost.tags && post.tags) {
          const matchingTags = currentPost.tags.filter(tag => 
            post.tags.includes(tag)
          );
          score += matchingTags.length * 2;
        }
        
        // Score by matching category
        if (currentPost.category && post.category === currentPost.category) {
          score += 1;
        }
        
        return { ...post, score };
      })
      .filter(post => post.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scoredPosts;
  }

  /**
   * Get posts by tag
   */
  function getPostsByTag(tag) {
    const allPosts = getAllPosts();
    return allPosts.filter(post => 
      post.tags && post.tags.includes(tag)
    );
  }

  /**
   * Get all unique tags
   */
  function getAllTags() {
    const allPosts = getAllPosts();
    const tags = new Set();
    
    allPosts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    
    return Array.from(tags).sort();
  }

  return {
    getAllPosts,
    getAllPostSlugs,
    getPostBySlug,
    getRelatedPosts,
    getPostsByTag,
    getAllTags
  };
}

// Default export for backward compatibility
const defaultBlogUtils = createBlogUtils();
export const {
  getAllPosts,
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
  getPostsByTag,
  getAllTags
} = defaultBlogUtils;