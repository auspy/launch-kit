import fs from "fs";
import path from "path";
import { releasesData } from "./releases-data";

/**
 * Load and parse release markdown files from the /releases directory
 * @returns {Array} Array of release objects sorted by version number (newest first)
 */
export function getReleaseData() {
  // Path to releases directory
  const releasesDir = path.join(process.cwd(), ".", "releases");

  // Get all markdown files from the releases directory
  const releaseFiles = fs
    .readdirSync(releasesDir)
    .filter((file) => file.endsWith(".md"));

  // Parse and sort the release files
  const releases = releaseFiles.map((file) => {
    // Extract version number from filename (e.g., "4.6.0.md" -> "4.6.0")
    const version = file.replace(".md", "");

    // Read the file content
    const filePath = path.join(releasesDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    // Remove the first line (title) as we already display it separately
    const contentWithoutTitle = content.split("\n").slice(1).join("\n").trim();

    // Get additional metadata from our releases data if available
    const metadata = releasesData[version] || {
      date: "Unknown date",
      title: `Focusmo ${version}`,
      seoDescription: `Focusmo version ${version} release notes and updates.`,
      seoTitle: `Focusmo ${version} - Release Notes`,
      slug: version.replace(/\./g, "-"),
    };

    return {
      version,
      content: contentWithoutTitle,
      // Add metadata for SEO
      ...metadata,
      // Parse version for sorting
      versionParts: version.split(".").map((part) => parseInt(part, 10)),
    };
  });

  // Sort releases by version (newest first)
  releases.sort((a, b) => {
    for (let i = 0; i < a.versionParts.length; i++) {
      if (b.versionParts[i] !== a.versionParts[i]) {
        return b.versionParts[i] - a.versionParts[i];
      }
    }
    return 0;
  });

  // Remove the versionParts property from final output
  return releases.map(({ versionParts, ...rest }) => rest);
}

/**
 * Get a specific release by version
 * @param {string} version - The version to retrieve (e.g., "4.6.0")
 * @returns {Object|null} The release object or null if not found
 */
export function getReleaseByVersion(version) {
  const releases = getReleaseData();
  return releases.find((release) => release.version === version) || null;
}

/**
 * Get a specific release by slug
 * @param {string} slug - The slug to retrieve (e.g., "4-6-0-calendar-ui-workspaces")
 * @returns {Object|null} The release object or null if not found
 */
export function getReleaseBySlug(slug) {
  const releases = getReleaseData();
  return releases.find((release) => release.slug === slug) || null;
}

/**
 * Get all release slugs for generating static paths
 * @returns {Array} Array of all release slugs
 */
export function getAllReleaseSlugs() {
  const releases = getReleaseData();
  return releases.map((release) => release.slug);
}
