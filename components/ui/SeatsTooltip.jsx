import React from "react";

const SeatsTooltip = ({
  deviceCount,
  position = "center", // 'center' | 'left'
  className = "",
}) => {
  const getArrowPositionClass = () => {
    switch (position) {
      case "left":
        return "left-6";
      case "center":
      default:
        return "left-1/2 transform -translate-x-1/2";
    }
  };

  const getTooltipPositionClass = () => {
    switch (position) {
      case "left":
        return "left-0";
      case "center":
      default:
        return "left-1/2 transform -translate-x-1/2";
    }
  };

  return (
    <div
      className={`absolute top-full mt-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 ease-out z-50 group-hover:translate-y-0 translate-y-2 ${getTooltipPositionClass()} ${className}`}
    >
      <div className="bg-white border border-blue-200 text-gray-800 text-sm rounded-2xl p-5 w-[340px] shadow-xl backdrop-blur-sm">
        {/* Arrow pointing up */}
        <div
          className={`absolute -top-2 w-4 h-4 bg-white border-l border-t border-blue-200 rotate-45 ${getArrowPositionClass()}`}
        ></div>

        <div className="space-y-3">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <p className="font-semibold text-blue-900 text-base mb-1">
              {deviceCount} seats = {deviceCount} Mac or iOS devices
            </p>
            <p className="text-xs text-blue-700 font-medium">
              (iOS app coming in July)
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <p className="text-gray-700 font-medium text-sm leading-relaxed">
              {deviceCount} devices can be active at one time. License can be
              transferred between devices whenever needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatsTooltip;
