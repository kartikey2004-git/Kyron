import { SectionHeading } from "../section-heading";
import { securityPoints } from "../data";

export function Security() {
  return (
    <section className="border-t border-hairline bg-scrim py-16 dark:border-white/10">
      <div className="px-6 lg:px-8">
        <SectionHeading
          eyebrow="Security"
          title="Your tokens and your code, handled carefully"
          onScrim
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
          {securityPoints.map((point) => {
            const Icon = point.icon;

            return (
              <div key={point.title} className="flex gap-4">
                <Icon className="mt-0.5 size-4 shrink-0 text-on-scrim" />

                <div className="space-y-2">
                  <h3 className="text-body-strong text-on-scrim">
                    {point.title}
                  </h3>
                  <p className="text-body text-on-scrim/70">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-body text-on-scrim/70">
          Kryon needs GitHub&apos;s <span className="font-mono">repo</span>{" "}
          scope to review private pull requests. Disconnect any repository from
          settings and its webhook goes with it.
        </p>
      </div>
    </section>
  );
}
