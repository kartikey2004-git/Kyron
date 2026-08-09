import { cn } from "@/lib/utils";

export function GutterRails({
  variant = "default",
  className,
}: {
  variant?: "default" | "scrim";
  className?: string;
}) {
  const hatch = variant === "scrim" ? "gutter-rail-scrim" : "gutter-rail";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 hidden justify-center sm:flex",
        className
      )}
    >
      <div className={cn("flex-1", hatch)} />
      <div className="w-full max-w-4xl" />
      <div className={cn("flex-1", hatch)} />
    </div>
  );
}
