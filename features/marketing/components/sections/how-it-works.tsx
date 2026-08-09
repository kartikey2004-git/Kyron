"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";
import { StepIllustration } from "./step-illustrations";
import { SectionShell } from "../page-frame";
import { steps } from "../data";

const STEP_DURATION_MS = 6000;

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useSafeReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion) return;

    const timer = setTimeout(
      () => setActive((current) => (current + 1) % steps.length),
      STEP_DURATION_MS
    );

    return () => clearTimeout(timer);
  }, [active, paused, reduceMotion]);

  return (
    <SectionShell id="how-it-works" className="bg-background">
      <div className="px-6 py-16 text-center lg:px-8">
        <p className="text-[12px] text-brand-accent">How it works</p>

        <h2 className="mx-auto mt-4 max-w-xl text-[20px] font-medium leading-[1.15] tracking-[-0.7px] text-foreground md:text-hero">
          Integrates easily
        </h2>

        <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.6] text-stone">
          Connect a repository once. Every pull request after that is reviewed
          automatically.
        </p>
      </div>

      <div
        className="grid grid-cols-1 border-t border-hairline lg:grid-cols-2 dark:border-white/10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <ol className="divide-y divide-hairline dark:divide-white/10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === active;

            return (
              <li key={step.title} className="relative">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "w-full px-5 py-6 text-left transition-colors lg:px-8",
                    isActive
                      ? "bg-linear-to-b from-hairline/60 to-transparent dark:from-white/5"
                      : "hover:bg-hairline/30 dark:hover:bg-white/5"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "size-4 transition-colors",
                        isActive ? "text-foreground" : "text-stone"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[14px] font-medium transition-colors",
                        isActive ? "text-foreground" : "text-stone"
                      )}
                    >
                      {step.title}
                    </span>
                  </span>

                  <p
                    className={cn(
                      "mt-2 max-w-md text-[13px] leading-[1.6] transition-colors",
                      isActive ? "text-graphite dark:text-ash" : "text-stone"
                    )}
                  >
                    {step.description}
                  </p>
                </button>

                {isActive && !reduceMotion && (
                  <motion.span
                    key={active}
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-0.5 bg-brand-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: paused ? "0%" : "100%" }}
                    transition={{
                      duration: STEP_DURATION_MS / 1000,
                      ease: "linear",
                    }}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="relative min-h-[340px] overflow-hidden border-t border-hairline lg:border-t-0 lg:border-l dark:border-white/10">
          <DotGrid />

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="relative flex h-full items-center justify-center p-6"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <StepIllustration index={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionShell>
  );
}

function DotGrid() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-60 dark:opacity-25"
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--hairline-soft) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    />
  );
}
