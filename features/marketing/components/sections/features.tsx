import { cn } from "@/lib/utils";
import { FeatureMockupPanel } from "./feature-mockups";
import { SectionShell } from "../page-frame";
import { features } from "../data";

function FeatureCell({
  feature,
  className,
}: {
  feature: (typeof features)[number];
  className?: string;
}) {
  const Icon = feature.icon;

  return (
    <div className={cn("flex flex-col p-5 lg:p-6", className)}>
      <div className="flex items-center gap-2.5">
        <Icon className="size-4 shrink-0 text-brand-accent" />
        <h3 className="text-[14px] font-medium text-foreground">
          {feature.title}
        </h3>
      </div>

      <p className="mt-2.5 max-w-md text-[13px] leading-[1.6] text-stone">
        {feature.description}
      </p>

      {feature.mockup && (
        <div className="mt-6">
          <FeatureMockupPanel mockup={feature.mockup} />
        </div>
      )}
    </div>
  );
}

export function Features() {
  const halfCells = features.filter((feature) => feature.layout === "half");
  const fullCell = features.find((feature) => feature.layout === "full");
  const thirdCells = features.filter((feature) => feature.layout === "third");

  return (
    <SectionShell id="features" className="bg-background">
      <div className="px-6 py-16 text-center lg:px-8">
        <p className="text-[12px] text-brand-accent">Features</p>

        <h2 className="mx-auto mt-4 max-w-xl text-[20px] font-medium leading-[1.15] tracking-[-0.7px] text-foreground md:text-hero">
          Built for grounded review
        </h2>

        <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.6] text-stone">
          Every review is built on your actual repository, not just the diff.
        </p>
      </div>

      <div className="grid grid-cols-1 border-t border-hairline md:grid-cols-2 dark:border-white/10">
        {halfCells.map((feature, index) => (
          <FeatureCell
            key={feature.title}
            feature={feature}
            className={cn(
              "border-hairline dark:border-white/10",
              index === 0 && "border-b md:border-r md:border-b-0"
            )}
          />
        ))}
      </div>

      {fullCell && (
        <div className="border-t border-hairline dark:border-white/10">
          <FeatureCell feature={fullCell} />
        </div>
      )}

      <div className="grid grid-cols-1 border-t border-b border-hairline md:grid-cols-3 dark:border-white/10">
        {thirdCells.map((feature, index) => (
          <FeatureCell
            key={feature.title}
            feature={feature}
            className={cn(
              "border-hairline dark:border-white/10",
              index < thirdCells.length - 1 &&
                "border-b md:border-r md:border-b-0"
            )}
          />
        ))}
      </div>
    </SectionShell>
  );
}
