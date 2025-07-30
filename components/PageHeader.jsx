import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function PageHeader({
  badge,
  title,
  description,
  icon: Icon,
  className = "",
  headingSize = "text-5xl",
  descriptionClassName = "",
  containerClassName = "",
}) {
  return (
    <div className={cn("bg-white border-b py-16 px-4", containerClassName)}>
      <div className="max-w-4xl mx-auto ">
        <div className={`text-center space-y-4 ${className}`}>
          {(badge || Icon) && (
            <div className="flex items-center justify-center gap-2 mb-3">
              {Icon && <Icon className="h-6 w-6 text-primary" />}
              {badge && (
                <Badge
                  variant="outline"
                  className="text-primary/90 border-primary/20 bg-primary/5 font-medium tracking-wide"
                >
                  {badge}
                </Badge>
              )}
            </div>
          )}
          <h1 className={`${headingSize} font-bold tracking-tight`}>{title}</h1>
          {description && (
            <p
              className={cn(
                "text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed",
                descriptionClassName
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
