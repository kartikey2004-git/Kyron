import { SectionHeading } from "../section-heading";
import { engineeringPoints } from "../data";

export function Engineering() {
  return (
    <section className="border-t border-hairline bg-background py-16 dark:border-white/10">
      <div className="px-6 lg:px-8">
        <SectionHeading
          eyebrow="Engineering"
          title="Built like production software"
          deck="Kryon is instrumented, rate-limited, and load-tested — because the people evaluating it will ask."
          className="mb-12"
        />

        <div className="grid grid-cols-1 border-t border-l border-border sm:grid-cols-2">
          {engineeringPoints.map((point) => {
            const Icon = point.icon;

            return (
              <div
                key={point.label}
                className="space-y-3 border-r border-b border-border p-6"
              >
                <Icon className="size-4 text-foreground" />

                <p className="text-micro-caps uppercase text-slate dark:text-ash">
                  {point.label}
                </p>

                <p className="text-body text-muted-foreground">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
