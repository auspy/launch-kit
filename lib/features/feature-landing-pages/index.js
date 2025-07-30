/**
 * Index file for feature landing pages
 * Exports all landing page data keyed by feature ID
 */
import { featureEnum } from "@/lib/features/featureEnum.js";
import { landingPageData as analyticsLandingPage } from "./analytics.js";
import { landingPageData as appearancecustomizationLandingPage } from "./customizations.js";
import { landingPageData as calendarintegrationLandingPage } from "./calendar-integration.js";
import { landingPageData as cloudsyncLandingPage } from "./cloud-sync.js";
import { landingPageData as compactmodeLandingPage } from "./compact-mode.js";
import { landingPageData as customnotificationsLandingPage } from "./notifications.js";
import { landingPageData as dailyremindersLandingPage } from "./daily-reminders.js";
import { landingPageData as floatingtimerLandingPage } from "./floating-timer.js";
import { landingPageData as keyboardshortcutsLandingPage } from "./keyboard-shortcuts.js";
import { landingPageData as pomodorotimerLandingPage } from "./pomodoro-timer.js";
import { landingPageData as quickaccessLandingPage } from "./quick-access.js";
import { landingPageData as taskresetLandingPage } from "./task-reset.js";
import { landingPageData as timetrackingLandingPage } from "./time-tracking.js";
import { landingPageData as workspacesLandingPage } from "./workspaces.js";
import { landingPageData as nevermissmeetingsLandingPage } from "./never-miss-meetings.js";

// Map of feature IDs to their landing page data
export const featureLandingPages = {
  [featureEnum.POMODORO_TIMER]: pomodorotimerLandingPage,
  [featureEnum.FLOATING_TIMER]: floatingtimerLandingPage,
  [featureEnum.CALENDAR_INTEGRATION]: calendarintegrationLandingPage,
  [featureEnum.WORKSPACES]: workspacesLandingPage,
  [featureEnum.QUICK_ACCESS]: quickaccessLandingPage,
  [featureEnum.CLOUD_SYNC]: cloudsyncLandingPage,
  [featureEnum.ANALYTICS]: analyticsLandingPage,
  [featureEnum.APPEARANCE_CUSTOMIZATION]: appearancecustomizationLandingPage,
  [featureEnum.CALENDAR_INTEGRATION]: calendarintegrationLandingPage,
  [featureEnum.CLOUD_SYNC]: cloudsyncLandingPage,
  [featureEnum.COMPACT_MODE]: compactmodeLandingPage,
  [featureEnum.CUSTOM_NOTIFICATIONS]: customnotificationsLandingPage,
  [featureEnum.DAILY_REMINDERS]: dailyremindersLandingPage,
  [featureEnum.FLOATING_TIMER]: floatingtimerLandingPage,
  [featureEnum.KEYBOARD_SHORTCUTS]: keyboardshortcutsLandingPage,
  [featureEnum.POMODORO_TIMER]: pomodorotimerLandingPage,
  [featureEnum.QUICK_ACCESS]: quickaccessLandingPage,
  [featureEnum.TASK_RESET]: taskresetLandingPage,
  [featureEnum.TIME_TRACKING]: timetrackingLandingPage,
  [featureEnum.WORKSPACES]: workspacesLandingPage,
  [featureEnum.NEVER_MISS_MEETINGS]: nevermissmeetingsLandingPage,
  // Add more features as they are migrated
};

/**
 * Get landing page data for a specific feature
 * @param {string} featureId - The ID of the feature
 * @returns {Object} Landing page data for the feature
 */
export function getLandingPageData(featureId) {
  return featureLandingPages[featureId] || null;
}
