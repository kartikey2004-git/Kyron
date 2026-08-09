import { cn } from "@/lib/utils";
import { GutterRails } from "./gutter-rails";

export function SectionShell({
  id,
  className,
  innerClassName,
  children,
}: {
  id?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative border-t border-hairline dark:border-white/10",
        className
      )}
    >
      <GutterRails />

      <div
        className={cn(
          "relative mx-auto max-w-4xl border-hairline sm:border-x dark:border-white/10",
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
