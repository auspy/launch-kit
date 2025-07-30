/**
 * Index file for feature sections
 * Exports all feature section data keyed by feature ID
 */
import { featureEnum } from "@/lib/features/featureEnum.js";
import { featureSectionData as pomodoroTimerSection } from "./pomodoro-timer.js";
import { featureSectionData as floatingTimerSection } from "./floating-timer.js";
import { featureSectionData as workspacesSection } from "./workspaces.js";
import { featureSectionData as quickAccessSection } from "./quick-access.js";
import { featureSectionData as cloudSyncSection } from "./cloud-sync.js";
import { featureSectionData as keyboardShortcutsSection } from "./keyboard-shortcuts.js";
import { featureSectionData as analyticsSection } from "./analytics.js";
import { featureSectionData as compactModeSection } from "./compact-mode.js";
import { featureSectionData as notificationsSection } from "./notifications.js";
import { featureSectionData as dailyRemindersSection } from "./daily-reminders.js";
import { featureSectionData as timeTrackingSection } from "./time-tracking.js";
import { featureSectionData as customizationsSection } from "./customizations.js";
import { featureSectionData as taskResetSection } from "./task-reset.js";
import { featureSectionData as meetingNotificationsSection } from "./meeting-notifications.js";
import { featureSectionData as floatingButtonSection } from "./floating-button.js";

// Map of feature IDs to their section data
export const featureSections = {
  [featureEnum.FLOATING_TIMER]: floatingTimerSection,
  [featureEnum.POMODORO_TIMER]: pomodoroTimerSection,
  [featureEnum.WORKSPACES]: workspacesSection,
  [featureEnum.QUICK_ACCESS]: quickAccessSection,
  [featureEnum.CLOUD_SYNC]: cloudSyncSection,
  [featureEnum.KEYBOARD_SHORTCUTS]: keyboardShortcutsSection,
  [featureEnum.ANALYTICS]: analyticsSection,
  [featureEnum.COMPACT_MODE]: compactModeSection,
  [featureEnum.CUSTOM_NOTIFICATIONS]: notificationsSection,
  [featureEnum.DAILY_REMINDERS]: dailyRemindersSection,
  [featureEnum.TIME_TRACKING]: timeTrackingSection,
  [featureEnum.APPEARANCE_CUSTOMIZATION]: customizationsSection,
  [featureEnum.TASK_RESET]: taskResetSection,
  [featureEnum.NEVER_MISS_MEETINGS]: meetingNotificationsSection,
  [featureEnum.FLOATING_BUTTON]: floatingButtonSection,
};

/**
 * Get feature section data for a specific feature
 * @param {string} featureId - The ID of the feature
 * @returns {Object} Feature section data for the feature
 */
export function getFeatureSectionData(featureId) {
  return featureSections[featureId] || null;
}
