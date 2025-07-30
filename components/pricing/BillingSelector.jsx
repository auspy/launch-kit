import { Button } from "@/components/ui/button";

export default function BillingSelector({
  selected,
  onSelect,
  size = "small",
  className = "",
}) {
  const sizeClasses = {
    small: "min-w-[60px] px-2 py-1 text-xs",
    large: "min-w-[72px] px-3 py-2 text-sm",
  };

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-blue-100 p-0.5 bg-blue-50/30 w-fit ${className}`}
    >
      <Button
        variant="ghost"
        size="xs"
        onClick={() => onSelect("annually")}
        className={`relative ${sizeClasses[size]} transition-all ${
          selected === "annually"
            ? "bg-blue-500 text-white hover:bg-primary hover:text-blue-100"
            : "text-gray-600 hover:bg-blue-500/10"
        }`}
      >
        Yearly
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[9px] px-1 py-0.5 rounded-full">
          -58%
        </span>
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => onSelect("monthly")}
        className={`relative ${sizeClasses[size]} transition-all ${
          selected === "monthly"
            ? "bg-blue-500 text-white hover:bg-primary hover:text-blue-100"
            : "text-gray-600 hover:bg-blue-500/10"
        }`}
      >
        Monthly
      </Button>
    </div>
  );
}
