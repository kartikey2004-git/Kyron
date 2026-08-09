"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";
import { FiGithub } from "react-icons/fi";
import {
  SiGo,
  SiJavascript,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import { StartButton } from "./start-button";
import { SectionShell } from "./page-frame";

const MARKS = [
  { Icon: FiGithub, label: "GitHub" },
  { Icon: SiTypescript, label: "TypeScript" },
  { Icon: SiReact, label: "TSX and JSX" },
  { Icon: SiJavascript, label: "JavaScript" },
  { Icon: SiPython, label: "Python" },
  { Icon: SiGo, label: "Go" },
];

const ORBIT_SECONDS = 22;

const RADIUS_X = 44;
const RADIUS_Y = 62;
const CENTER_Y = 74;

function OrbitingMark({
  progress,
  offset,
  Icon,
  label,
}: {
  progress: MotionValue<number>;
  offset: number;
  Icon: (typeof MARKS)[number]["Icon"];
  label: string;
}) {
  const t = useTransform(progress, (p) => (p + offset) % 1);

  const left = useTransform(
    t,
    (v) => `${50 + Math.cos(Math.PI + v * Math.PI) * RADIUS_X}%`
  );

  const top = useTransform(
    t,
    (v) => `${CENTER_Y + Math.sin(Math.PI + v * Math.PI) * RADIUS_Y}%`
  );

  const opacity = useTransform(t, [0, 0.14, 0.86, 1], [0, 1, 1, 0]);

  const scale = useTransform(t, (v) => 0.82 + Math.sin(v * Math.PI) * 0.22);

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left, top, opacity, scale }}
    >
      <div
        title={label}
        className="flex size-10 items-center justify-center rounded-xl border border-hairline bg-hairline/40 dark:border-white/10 dark:bg-white/5"
      >
        <Icon className="size-4 text-slate dark:text-on-scrim/70" />
      </div>
    </motion.div>
  );
}

export function CtaBand({
  title = "Connect your repository and start reviewing",
  deck,
}: {
  title?: string;
  deck?: string;
}) {
  const reduceMotion = useSafeReducedMotion();
  const progress = useMotionValue(0);

  useEffect(() => {
    if (reduceMotion) return;

    const controls = animate(progress, 1, {
      duration: ORBIT_SECONDS,
      ease: "linear",
      repeat: Infinity,
    });

    return () => controls.stop();
  }, [progress, reduceMotion]);

  const offsets = MARKS.map((_, index) =>
    reduceMotion
      ? 0.14 + (index / (MARKS.length - 1)) * 0.72
      : index / MARKS.length
  );

  return (
    <SectionShell className="relative overflow-hidden" innerClassName="py-16">
      <div className="relative px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="relative mx-auto h-28 w-full max-w-lg sm:h-32"
        >
          {MARKS.map((mark, index) => (
            <OrbitingMark
              key={mark.label}
              progress={progress}
              offset={offsets[index]}
              Icon={mark.Icon}
              label={mark.label}
            />
          ))}
        </div>

        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-[20px] font-medium leading-[1.15] tracking-[-0.7px] text-foreground md:text-hero">
            {title}
          </h2>

          {deck && (
            <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.6] text-muted-foreground">
              {deck}
            </p>
          )}

          <div className="mt-6 flex justify-center">
            <StartButton className="h-9 rounded-[10px] bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/85">
              Start reviewing for free
            </StartButton>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
