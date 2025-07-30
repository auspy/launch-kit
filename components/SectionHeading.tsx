import { cn } from "@/lib/utils";

export default function SectionHeading({
  title,
  badge = null,
  description = null,
  headingSize = null,
  containerClassName = null,
}: {
  title: string;
  badge?: string | null;
  description?: string | null;
  headingSize?: "h2" | "h3";
  containerClassName?: string | null;
}) {
  return (
    <div
      className={cn(
        "max-w-4xl mx-auto text-center mb-6  md:mb-10 space-y-3",
        containerClassName
      )}
    >
      {badge && (
        <p className="text-sm font-medium px-3 py-1 bg-primary/10 border border-primary/30 w-fit text-primary mx-auto mb-3 rounded-full">
          {badge}
        </p>
      )}
      {headingSize === "h2" ? (
        <h2 className={`max-w-2xl mx-auto`}>{title}</h2>
      ) : (
        <h3 className={`max-w-2xl mx-auto`}>{title}</h3>
      )}
      <p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400 leading-tight">
        {description}
      </p>
    </div>
  );
}
