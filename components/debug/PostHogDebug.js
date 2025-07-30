"use client";

import { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";

export default function PostHogDebug() {
  const posthog = usePostHog();
  const [debugInfo, setDebugInfo] = useState({
    distinctId: null,
    deviceId: null,
    isIdentified: false,
    sessionId: null,
    userProperties: {},
    isPostHogLoaded: false,
    featureFlags: {},
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!posthog) {
      setDebugInfo((prev) => ({ ...prev, isPostHogLoaded: false }));
      return;
    }

    const updateDebugInfo = () => {
      const distinctId = posthog.get_distinct_id();
      const deviceId = localStorage.getItem("fm_device");
      const sessionId = posthog.get_session_id?.() || "N/A";

      // Get user properties if available
      const userProperties = {};
      try {
        // Try to get some common properties
        const props = posthog.get_property
          ? {
              $user_id: posthog.get_property("$user_id"),
              device_id: posthog.get_property("device_id"),
              user_type: posthog.get_property("user_type"),
              attributed_from_app: posthog.get_property("attributed_from_app"),
              identification_source: posthog.get_property(
                "identification_source"
              ),
              $anon_distinct_id: posthog.get_property("$anon_distinct_id"),
            }
          : {};

        // Filter out undefined values
        Object.keys(props).forEach((key) => {
          if (props[key] !== undefined && props[key] !== null) {
            userProperties[key] = props[key];
          }
        });
      } catch (error) {
        console.warn("Error getting PostHog properties:", error);
      }

      // Get feature flags if available
      const featureFlags = {};
      try {
        if (posthog.get_all_flags) {
          Object.assign(featureFlags, posthog.get_all_flags());
        }
      } catch (error) {
        console.warn("Error getting PostHog feature flags:", error);
      }

      setDebugInfo({
        distinctId,
        deviceId,
        isIdentified: distinctId && !distinctId.startsWith("01"),
        sessionId,
        userProperties,
        isPostHogLoaded: true,
        featureFlags,
      });
    };

    // Update immediately
    updateDebugInfo();

    // Update periodically to catch changes
    const interval = setInterval(updateDebugInfo, 1000);

    return () => clearInterval(interval);
  }, [posthog]);

  // Only show in development mode
  if (process.env.NODE_ENV === "production") return null;
  if (!isVisible) return null;

  const getDistinctIdType = () => {
    const { distinctId, deviceId } = debugInfo;
    if (!distinctId) return "None";
    if (distinctId.includes("@")) return "Email";
    if (deviceId && distinctId === deviceId) return "Device ID";
    if (distinctId.startsWith("01")) return "Anonymous";
    return "Unknown";
  };

  const getStatusColor = () => {
    if (!debugInfo.isPostHogLoaded) return "bg-red-500";
    const type = getDistinctIdType();
    switch (type) {
      case "Email":
        return "bg-green-500";
      case "Device ID":
        return "bg-blue-500";
      case "Anonymous":
        return "bg-yellow-500";
      case "None":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const truncateValue = (value, maxLength = 30) => {
    const str = String(value);
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs">
      {/* Compact View */}
      {!isExpanded && (
        <div
          className={`${getStatusColor()} text-white px-3 py-2 rounded-lg shadow-lg cursor-pointer hover:opacity-80 transition-opacity`}
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold">
              PostHog:{" "}
              {debugInfo.isPostHogLoaded
                ? truncateValue(debugInfo.distinctId, 15)
                : "Loading..."}
            </span>
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-2xl border border-gray-700 min-w-[400px] max-w-[500px] max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <span className="font-bold text-sm">PostHog Debug</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white text-lg leading-none"
              >
                −
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* PostHog Status */}
          <div className="mb-4 p-2 bg-gray-800 rounded">
            <div className="text-gray-400 text-xs mb-1">PostHog Status:</div>
            <div
              className={`font-semibold ${
                debugInfo.isPostHogLoaded ? "text-green-400" : "text-red-400"
              }`}
            >
              {debugInfo.isPostHogLoaded
                ? "✅ Loaded & Ready"
                : "❌ Not Loaded"}
            </div>
          </div>

          {debugInfo.isPostHogLoaded && (
            <>
              {/* Core Identity */}
              <div className="space-y-3">
                <div>
                  <div className="text-gray-400 font-semibold">🆔 Identity</div>
                  <div className="ml-2 space-y-1">
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <span
                        className={`ml-2 font-semibold ${
                          getDistinctIdType() === "Email"
                            ? "text-green-400"
                            : getDistinctIdType() === "Device ID"
                            ? "text-blue-400"
                            : getDistinctIdType() === "Anonymous"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {getDistinctIdType()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Distinct ID:</span>
                      <div className="break-all text-white bg-gray-800 p-1 rounded text-xs mt-1">
                        {debugInfo.distinctId || "None"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Session ID:</span>
                      <div className="break-all text-gray-300 bg-gray-800 p-1 rounded text-xs mt-1">
                        {debugInfo.sessionId}
                      </div>
                    </div>
                    {debugInfo.deviceId && (
                      <div>
                        <span className="text-gray-400">
                          Device ID (localStorage):
                        </span>
                        <div className="break-all text-blue-300 bg-gray-800 p-1 rounded text-xs mt-1">
                          {debugInfo.deviceId}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Properties */}
                <div>
                  <div className="text-gray-400 font-semibold">
                    🏷️ User Properties
                  </div>
                  <div className="ml-2">
                    {Object.keys(debugInfo.userProperties).length > 0 ? (
                      <div className="space-y-1">
                        {Object.entries(debugInfo.userProperties).map(
                          ([key, value]) => (
                            <div key={key} className="flex">
                              <span className="text-gray-400 min-w-[120px]">
                                {key}:
                              </span>
                              <span className="text-white break-all">
                                {typeof value === "string"
                                  ? `"${value}"`
                                  : JSON.stringify(value)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">
                        No properties set
                      </div>
                    )}
                  </div>
                </div>

                {/* Feature Flags */}
                {Object.keys(debugInfo.featureFlags).length > 0 && (
                  <div>
                    <div className="text-gray-400 font-semibold">
                      🚩 Feature Flags
                    </div>
                    <div className="ml-2 space-y-1">
                      {Object.entries(debugInfo.featureFlags).map(
                        ([key, value]) => (
                          <div key={key} className="flex">
                            <span className="text-gray-400 min-w-[120px]">
                              {key}:
                            </span>
                            <span
                              className={`font-semibold ${
                                value ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Attribution Info */}
                <div>
                  <div className="text-gray-400 font-semibold">
                    🔗 Attribution
                  </div>
                  <div className="ml-2 space-y-1">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span
                        className={`ml-2 font-semibold ${
                          debugInfo.isIdentified
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {debugInfo.isIdentified
                          ? "✅ Identified"
                          : "⚠️ Anonymous"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">From App:</span>
                      <span
                        className={`ml-2 ${
                          debugInfo.deviceId ? "text-blue-400" : "text-gray-500"
                        }`}
                      >
                        {debugInfo.deviceId ? "✅ Yes" : "❌ No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Device Match:</span>
                      <span
                        className={`ml-2 ${
                          debugInfo.deviceId === debugInfo.distinctId
                            ? "text-green-400"
                            : "text-gray-500"
                        }`}
                      >
                        {debugInfo.deviceId === debugInfo.distinctId
                          ? "✅ Yes"
                          : "❌ No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-gray-700 space-y-2">
                <button
                  onClick={() => {
                    console.log("🔍 PostHog Full Debug Info:", {
                      debugInfo,
                      posthogInstance: posthog,
                      allProperties: posthog.get_property
                        ? "Available"
                        : "Not Available",
                      localStorage: {
                        fm_device: localStorage.getItem("fm_device"),
                        all_keys: Object.keys(localStorage),
                      },
                    });

                    // Try to get all available PostHog data
                    if (posthog.get_property) {
                      console.log("🔍 All PostHog Properties:");
                      const commonProps = [
                        "$user_id",
                        "device_id",
                        "user_type",
                        "attributed_from_app",
                        "identification_source",
                        "$anon_distinct_id",
                        "email_domain",
                        "attribution_landing_page",
                        "previous_anonymous_id",
                      ];
                      commonProps.forEach((prop) => {
                        const value = posthog.get_property(prop);
                        if (value !== undefined) {
                          console.log(`  ${prop}:`, value);
                        }
                      });
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs transition-colors"
                >
                  📋 Log Full Debug Info
                </button>

                <button
                  onClick={() => {
                    if (posthog) {
                      posthog.reset();
                      localStorage.removeItem("fm_device");
                      console.log(
                        "🔄 PostHog Reset - New Anonymous Session + Cleared Device ID"
                      );
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs transition-colors"
                >
                  🔄 Reset Session + Clear Device
                </button>

                <button
                  onClick={() => {
                    const deviceId = "debug-device-" + Date.now();
                    localStorage.setItem("fm_device", deviceId);
                    if (posthog) {
                      posthog.identify(deviceId, {
                        device_id: deviceId,
                        user_type: "debug",
                        identification_source: "debug_panel",
                      });
                    }
                    console.log("🧪 Debug Device ID Set:", deviceId);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-xs transition-colors"
                >
                  🧪 Set Debug Device ID
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Restore Button (when hidden) */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 left-4 bg-gray-600 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors text-xs"
          title="Show PostHog Debug"
        >
          🐛
        </button>
      )}
    </div>
  );
}
