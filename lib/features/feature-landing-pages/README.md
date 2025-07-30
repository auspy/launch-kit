# Feature Landing Pages

This directory contains separated landing page data for each feature. This approach helps keep the main `features.js` file smaller and more manageable.

## Migration Guide

To migrate a feature's landing page data from `features.js` to its own file:

1. Create a new file in this directory named after the feature (e.g., `feature-name.js`)
2. Copy the landing page data from `features.js` to the new file
3. Export the data as a named constant: `export const landingPageData = { ... }`
4. Import and add the landing page data to the `index.js` file
5. Replace the landing page object in `features.js` with a getter function:

```js
get landingPage() {
  return getLandingPageData(this.id);
}
```

## Example

Example feature file (`pomodoro-timer.js`):

```js
/**
 * Landing page data for Pomodoro Timer feature
 */
import React from 'react';

export const landingPageData = {
  heroData: {
    title: "Balance focus and rest",
    // ...more hero data
  },
  contentSections: [
    // ...content sections
  ],
  // ...other landing page data
};
```

Update to `index.js`:

```js
import { landingPageData as myFeatureLandingPage } from './my-feature';

// Map of feature IDs to their landing page data
export const featureLandingPages = {
  // ...existing mappings
  [featureEnum.MY_FEATURE]: myFeatureLandingPage,
};
```

## File Naming Convention

Use kebab-case for file names, matching the feature ID structure in `featureEnum`.

Example:
- `pomodoro-timer.js` for `featureEnum.POMODORO_TIMER`
- `floating-timer.js` for `featureEnum.FLOATING_TIMER` 