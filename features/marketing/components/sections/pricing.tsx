import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StartButton } from "../start-button";
import { SectionShell } from "../page-frame";
import { plans, siteLinks } from "../data";

export function Pricing() {
  return (
    <SectionShell id="pricing" className="bg-background">
      <div className="px-6 py-16 text-center lg:px-8">
        <p className="text-[12px] text-brand-accent">Pricing</p>

        <h2 className="mx-auto mt-4 max-w-xl text-[20px] font-medium leading-[1.15] tracking-[-0.7px] text-foreground md:text-hero">
          Start free, connect more as you grow
        </h2>

        <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.6] text-stone">
          Every plan runs the same review pipeline. They differ only in how many
          repositories you can connect.
        </p>
      </div>

      <div className="grid grid-cols-1 border-t border-hairline md:grid-cols-3 dark:border-white/10">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col border-hairline dark:border-white/10",
              index < plans.length - 1 && "border-b md:border-r md:border-b-0"
            )}
          >
            <div className="border-b border-hairline p-6 dark:border-white/10">
              <h3 className="text-[15px] font-medium text-foreground">
                {plan.name}
              </h3>

              <p className="mt-1 text-[13px] text-stone">{plan.audience}</p>

              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="text-[28px] leading-none font-medium tracking-[-0.7px] text-foreground">
                  {plan.repositories}
                </span>
                <span className="text-[13px] text-stone">{plan.unit}</span>
              </p>

              <div className="mt-5">
                {plan.cta === "Contact" ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-9 w-full rounded-[10px] border-hairline text-sm font-medium dark:border-border"
                  >
                    <a
                      href={siteLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {plan.cta}
                    </a>
                  </Button>
                ) : (
                  <StartButton
                    variant={plan.recommended ? "default" : "outline"}
                    className={cn(
                      "h-9 w-full rounded-[10px] text-sm font-medium",
                      plan.recommended
                        ? "bg-brand-accent text-white hover:bg-brand-accent/90"
                        : "border-hairline dark:border-border"
                    )}
                  >
                    {plan.cta}
                  </StartButton>
                )}
              </div>
            </div>

            <ul className="space-y-3 p-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-px size-3.5 shrink-0 text-brand-accent" />
                  <span className="text-[13px] leading-[1.5] text-stone">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="px-6 py-6 text-center text-[12px] text-stone lg:px-8">
        Kryon is open source — self-hosting has no repository limit.
      </p>
    </SectionShell>
  );
}
