import { MessageSquare } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { SectionShell } from "../page-frame";
import { benefits } from "../data";

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("fill-current", className)}
    >
      <rect x="7.5" y="2" width="10.5" height="10.5" rx="3" />
      <rect x="2" y="9.5" width="8.5" height="8.5" rx="2.5" />
    </svg>
  );
}

function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center">
      {children}
    </div>
  );
}

function FlowPanel() {
  const stats = ["Code Reviews", "Repositories", "Pull Requests"];
  const widths = ["w-4/5", "w-1/3", "w-3/5"];

  return (
    <div className="flex h-full flex-col justify-between gap-8 p-5">
      <div className="flex items-center justify-center gap-3 pt-4">
        <Tile>
          <FiGithub className="size-4 text-foreground" />
        </Tile>

        <span
          aria-hidden="true"
          className="h-px w-6 bg-hairline-soft dark:bg-white/20"
        />

        <Tile>
          <Mark className="size-4 text-foreground" />
        </Tile>

        <span
          aria-hidden="true"
          className="h-px w-6 bg-hairline-soft dark:bg-white/20"
        />

        <Tile>
          <MessageSquare className="size-4 text-foreground" />
        </Tile>
      </div>

      <div className="flex justify-center">
        <span className="rounded-full bg-brand-accent/12 px-2.5 py-1 text-[11px] text-brand-accent">
          Connected
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1.5">
          {["", "", ""].map((tone, index) => (
            <span
              key={index}
              className={cn("size-2 rounded-full dark:bg-white/20", tone)}
            />
          ))}
        </div>

        <p className="mt-3 text-[13px] font-medium text-foreground">
          Dashboard
        </p>

        <div className="mt-3 space-y-2.5">
          {stats.map((label, index) => (
            <div key={label}>
              <p className="text-[11px] text-stone">{label}</p>
              <div className="mt-1 h-1">
                <div className={cn("h-full rounded-full", widths[index])} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BenefitCard({ benefit }: { benefit: (typeof benefits)[number] }) {
  const Icon = benefit.icon;

  return (
    <div className="p-5">
      <Icon className="size-4 text-brand-accent" />

      <h3 className="mt-3 text-[14px] font-medium text-foreground">
        {benefit.title}
      </h3>

      <p className="mt-2 text-[13px] leading-[1.6] text-stone">
        {benefit.description}
      </p>
    </div>
  );
}

export function Benefits() {
  const left = benefits.slice(0, 3);
  const right = benefits.slice(3);

  return (
    <SectionShell className="bg-background">
      <div className="px-6 py-16 text-center lg:px-8 border-b border-hairline dark:border-white/10 mb-2">
        <p className="text-[12px] text-brand-accent">Benefits</p>

        <h2 className="mx-auto mt-4 max-w-xl text-[20px] font-medium leading-[1.15] tracking-[-0.7px] text-foreground md:text-hero">
          Fewer things to run, fewer ways to fail
        </h2>

        <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.6] text-stone">
          Every one of these falls out of how the pipeline is built, rather than
          being a number we aim at.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 px-6 pb-16 lg:grid-cols-3 lg:px-8">
        <div className="flex flex-col gap-3">
          {left.map((benefit) => (
            <BenefitCard key={benefit.title} benefit={benefit} />
          ))}
        </div>

        <div className="order-last lg:order-none">
          <FlowPanel />
        </div>

        <div className="flex flex-col gap-3">
          {right.map((benefit) => (
            <BenefitCard key={benefit.title} benefit={benefit} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
