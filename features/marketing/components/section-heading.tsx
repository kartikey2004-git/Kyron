import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  deck,
  onScrim = false,
  className,
}: {
  eyebrow: string;
  title: string;
  deck?: string;
  onScrim?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      <p
        className={cn(
          "mb-3 text-eyebrow uppercase",
          onScrim ? "text-on-scrim/70" : "text-slate dark:text-ash"
        )}
      >
        {eyebrow}
      </p>

      <h2
        className={cn(
          "text-heading-md",
          onScrim ? "text-on-scrim" : "text-foreground"
        )}
      >
        {title}
      </h2>

      {deck && (
        <p
          className={cn(
            "mx-auto mt-4 max-w-2xl text-subtitle",
            onScrim ? "text-on-scrim/70" : "text-muted-foreground"
          )}
        >
          {deck}
        </p>
      )}
    </div>
  );
}
