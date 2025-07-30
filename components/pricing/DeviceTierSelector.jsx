import { Button } from "@/components/ui/button";

const DEVICE_OPTIONS = [
  { count: 2, description: "For personal use" },
  { count: 4, description: "For all your devices" },
  { count: 10, description: "For teams & workgroups" },
];

export default function DeviceTierSelector({
  selected,
  onSelect,
  className = "",
}) {
  return (
    <div
      className={`inline-flex items-center rounded-lg border border-blue-100 p-0.5 bg-blue-50/30 w-fit ${className}`}
    >
      {DEVICE_OPTIONS.map((option) => (
        <Button
          key={option.count}
          variant="ghost"
          size="xs"
          onClick={() => onSelect(option.count)}
          className={`relative group w-[160px] px-3 py-2 text-xs transition-all ${
            selected === option.count
              ? "bg-blue-500 text-white hover:bg-primary hover:text-blue-100"
              : "text-gray-600 hover:bg-blue-500/10"
          }`}
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-medium text-sm">{option.count}</span>
            <span
              className={`text-[12px] ${
                selected === option.count
                  ? "text-blue-100"
                  : "text-gray-500 group-hover:text-gray-700 "
              }`}
            >
              {option.description}
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
}
