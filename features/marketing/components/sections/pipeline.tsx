import { SectionHeading } from "../section-heading";
import { durabilityNotes, pipelineSteps } from "../data";

export function Pipeline() {
  return (
    <section className="border-t border-hairline bg-background py-16 dark:border-white/10">
      <div className="px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pipeline"
          title="How Kryon actually reads your code"
          deck="Most AI reviewers see only the diff. Kryon builds a semantic index of the whole repository first."
          className="mb-12"
        />

        <div className="border-t border-border">
          {pipelineSteps.map((stage) => (
            <div
              key={stage.step}
              className="grid grid-cols-1 gap-4 border-b border-border py-6 md:grid-cols-12 md:gap-6"
            >
              <div className="md:col-span-1">
                <span className="font-mono text-meta text-slate dark:text-ash">
                  {stage.step}
                </span>
              </div>

              <div className="md:col-span-4">
                <h3 className="text-heading-sm text-foreground">
                  {stage.title}
                </h3>
              </div>

              <div className="md:col-span-7">
                <p className="text-body text-muted-foreground">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-md bg-hairline p-6 dark:bg-muted">
          <p className="text-micro-caps uppercase text-slate dark:text-ash">
            Durable by construction
          </p>

          <ul className="mt-4 space-y-2.5">
            {durabilityNotes.map((note) => (
              <li
                key={note}
                className="flex gap-4 text-body text-muted-foreground"
              >
                <span
                  aria-hidden
                  className="mt-2.5 h-px w-4 shrink-0 bg-hairline-soft dark:bg-border"
                />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
