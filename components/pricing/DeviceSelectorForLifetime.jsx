import { Button } from "@/components/ui/button";
import { PRICING } from "./PricingCards2"; // Import pricing data

const calculateDiscount = (deviceCount) => {
  // compare price with 1 device
  const price = PRICING.LIFETIME_PRO.DEVICES[1].PRICE;
  const discount = PRICING.LIFETIME_PRO.DEVICES[deviceCount]?.PRICE;
  return price * deviceCount - discount;
};

export default function DeviceSelectorForLifetime({
  selected,
  onSelect,
  size = "small",
  className = "",
  devices = [2, 4, 10],
}) {
  const sizeClasses = {
    small: "min-w-[40px] px-2 py-1 text-xs",
    large: "min-w-[48px] px-3 py-2 text-sm",
  };

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-[#F7B955]/30 p-0.5 bg-[#FFF7EB]/50 w-fit ${className}`}
    >
      {devices.map((deviceCount) => {
        // Get discount percentage from pricing configuration
        const discount = deviceCount === 1 ? 0 : calculateDiscount(deviceCount);

        return (
          <Button
            key={deviceCount}
            variant="ghost"
            size="xs"
            onClick={() => onSelect(deviceCount)}
            className={`relative ${sizeClasses[size]} transition-all ${
              selected === deviceCount
                ? "bg-[#F7B955] text-white hover:bg-[#D68A0C] hover:text-white"
                : "text-gray-600 hover:bg-[#F7B955]/10"
            }`}
          >
            {deviceCount}
            {/* {discount > 0 && (
              <span className="absolute -top-2 -right-2 z-10 bg-green-500 text-white text-[12px] px-2 py-0.25 rounded-full border border-green-400 font-medium shadow-sm">
                ${discount}
              </span>
            )} */}
          </Button>
        );
      })}
    </div>
  );
}
