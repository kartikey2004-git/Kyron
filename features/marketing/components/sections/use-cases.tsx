import { SectionShell } from "../page-frame";
import { useCases } from "../data";

export function UseCases() {
  return (
    <SectionShell className="bg-background">
      <div className="px-6 py-16 text-center lg:px-8 border-b border-hairline dark:border-white/10 mb-2">
        <p className="text-[12px] text-brand-accent">Use cases</p>

        <h2 className="mx-auto mt-4 max-w-xl text-[20px] font-medium leading-[1.15] tracking-[-0.7px] text-foreground md:text-hero">
          Where Kryon earns its keep
        </h2>

        <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.6] text-stone">
          The same pipeline, whether you&apos;re reviewing your own work or
          somebody else&apos;s.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {useCases.map((useCase) => {
          const Icon = useCase.icon;

          return (
            <div key={useCase.title} className="p-5">
              <Icon className="size-4 text-brand-accent" />

              <h3 className="mt-3 text-[14px] font-medium text-foreground">
                {useCase.title}
              </h3>

              <p className="mt-2 text-[13px] leading-[1.6] text-stone">
                {useCase.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
