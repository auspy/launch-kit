import { featureEnum } from "./featureEnum";
import {
  Clock,
  Disc,
  Cloud,
  Keyboard,
  PieChart,
  Search,
  Bell,
  Timer,
  Palette,
  RefreshCcw,
  Layout,
  Minimize2,
  AlarmClock,
  Video,
} from "lucide-react";

export const featureIcons = {
  [featureEnum.POMODORO_TIMER]: {
    emoji: "🍅",
    icon: Timer,
    color: "text-red-500",
  },
  [featureEnum.FLOATING_TIMER]: {
    emoji: "🕒",
    icon: Clock,
    color: "text-blue-500",
  },
  [featureEnum.WORKSPACES]: {
    emoji: "💻",
    icon: Layout,
    color: "text-green-500",
  },
  [featureEnum.QUICK_ACCESS]: {
    emoji: "🔑",
    icon: Search,
    color: "text-yellow-500",
  },
  [featureEnum.CLOUD_SYNC]: {
    emoji: "🌐",
    icon: Cloud,
    color: "text-sky-500",
  },
  [featureEnum.KEYBOARD_SHORTCUTS]: {
    emoji: "⌨️",
    icon: Keyboard,
    color: "text-purple-500",
  },
  [featureEnum.ANALYTICS]: {
    emoji: "📊",
    icon: PieChart,
    color: "text-orange-500",
  },
  [featureEnum.COMPACT_MODE]: {
    emoji: "🔍",
    icon: Minimize2,
    color: "text-teal-500",
  },
  [featureEnum.CUSTOM_NOTIFICATIONS]: {
    emoji: "🔔",
    icon: Bell,
    color: "text-red-400",
  },
  [featureEnum.DAILY_REMINDERS]: {
    emoji: "⏰",
    icon: AlarmClock,
    color: "text-pink-500",
  },
  [featureEnum.TIME_TRACKING]: {
    emoji: "⏰",
    icon: Timer,
    color: "text-indigo-500",
  },
  [featureEnum.APPEARANCE_CUSTOMIZATION]: {
    emoji: "🎨",
    icon: Palette,
    color: "text-pink-500",
  },
  [featureEnum.TASK_RESET]: {
    emoji: "🔄",
    icon: RefreshCcw,
    color: "text-blue-500",
  },
  [featureEnum.NEVER_MISS_MEETINGS]: {
    emoji: "🔔",
    icon: Video,
    color: "text-accent",
  },
  [featureEnum.FLOATING_BUTTON]: {
    emoji: "🚀",
    icon: Disc,
    color: "text-blue-500",
  },
};
