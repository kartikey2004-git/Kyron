"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const VIEW_W = 320;
const VIEW_H = 160;

const GROW_FROM_LEFT = {
  transformBox: "fill-box",
  transformOrigin: "left",
} as const;

const CENTERED = {
  transformBox: "fill-box",
  transformOrigin: "center",
} as const;

function useSvgPointer() {
  const px = useMotionValue(-9999);
  const py = useMotionValue(-9999);

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - bounds.left) / bounds.width) * VIEW_W);
    py.set(((event.clientY - bounds.top) / bounds.height) * VIEW_H);
  };

  const onPointerLeave = () => {
    px.set(-9999);
    py.set(-9999);
  };

  return { px, py, onPointerMove, onPointerLeave };
}

function useProximity(
  px: MotionValue<number>,
  py: MotionValue<number>,
  x: number,
  y: number,
  radius: number
) {
  return useTransform(() => {
    const distance = Math.hypot(px.get() - x, py.get() - y);
    return distance > radius ? 0 : 1 - distance / radius;
  });
}

const COLS = 10;
const ROWS = 3;
const CELL = 12;
const GAP = 6;
const GRID_W = COLS * CELL + (COLS - 1) * GAP;
const GRID_X = (VIEW_W - GRID_W) / 2;
const GRID_Y = 96;

function ChunkCell({
  px,
  py,
  x,
  y,
  order,
  reduceMotion,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  x: number;
  y: number;
  order: number;
  reduceMotion: boolean | null;
}) {
  const glow = useProximity(px, py, x + CELL / 2, y + CELL / 2, 52);
  const glowScale = useTransform(glow, [0, 1], [1, 1.25]);

  return (
    <>
      <rect
        x={x}
        y={y}
        width={CELL}
        height={CELL}
        rx="3"
        className="fill-hairline dark:fill-white/10"
      />

      <motion.rect
        x={x}
        y={y}
        width={CELL}
        height={CELL}
        rx="3"
        className="fill-brand-accent/35"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
          delay: 1.15 + order * 0.045,
        }}
      />

      <motion.rect
        x={x}
        y={y}
        width={CELL}
        height={CELL}
        rx="3"
        className="fill-brand-accent"
        style={{ opacity: glow, scale: glowScale, ...CENTERED }}
      />
    </>
  );
}

function ConnectIllustration() {
  const reduceMotion = useSafeReducedMotion();
  const { px, py, onPointerMove, onPointerLeave } = useSvgPointer();

  const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({
    x: GRID_X + (i % COLS) * (CELL + GAP),
    y: GRID_Y + Math.floor(i / COLS) * (CELL + GAP),
    order: (i % COLS) + Math.floor(i / COLS),
  }));

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      role="img"
      aria-label="A connected repository being parsed into indexed code chunks"
      className="w-full max-w-sm touch-none"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <rect
        x="24"
        y="20"
        width="44"
        height="44"
        rx="12"
        className="stroke-hairline-soft dark:stroke-white/20"
        strokeWidth="1.5"
      />
      {[0, 1, 2].map((row) => (
        <rect
          key={row}
          x="34"
          y={31 + row * 8}
          width={row === 2 ? 14 : 24}
          height="4"
          rx="2"
          className="fill-hairline-soft dark:fill-white/20"
        />
      ))}

      {!reduceMotion && (
        <motion.rect
          x="24"
          y="20"
          width="44"
          height="44"
          rx="12"
          className="stroke-brand-accent"
          strokeWidth="1.5"
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 1.35 }}
          style={CENTERED}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
        />
      )}

      <motion.path
        d="M68 42 H252"
        className="stroke-hairline-soft dark:stroke-white/20"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
      />

      <motion.g
        initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        style={CENTERED}
        transition={{ duration: 0.4, ease: EASE, delay: 0.65 }}
      >
        <rect
          x="252"
          y="20"
          width="44"
          height="44"
          rx="12"
          className="stroke-hairline-soft dark:stroke-white/20"
          strokeWidth="1.5"
        />
        <rect
          x="272"
          y="30"
          width="14"
          height="14"
          rx="4"
          className="fill-foreground"
        />
        <rect
          x="263"
          y="40"
          width="11"
          height="11"
          rx="3.5"
          className="fill-foreground"
        />
      </motion.g>

      <motion.path
        d="M274 64 V84"
        className="stroke-hairline-soft dark:stroke-white/20"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: EASE, delay: 1 }}
      />

      {cells.map((cell) => (
        <ChunkCell
          key={`${cell.x}-${cell.y}`}
          px={px}
          py={py}
          x={cell.x}
          y={cell.y}
          order={cell.order}
          reduceMotion={reduceMotion}
        />
      ))}
    </svg>
  );
}

function Commit({
  px,
  py,
  cx,
  index,
  reduceMotion,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  cx: number;
  index: number;
  reduceMotion: boolean | null;
}) {
  const near = useProximity(px, py, cx, 24, 46);
  const nearScale = useTransform(near, [0, 1], [1, 1.7]);

  return (
    <motion.circle
      cx={cx}
      cy="24"
      r="4.5"
      className="stroke-brand-accent"
      strokeWidth="1.5"
      initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: EASE, delay: 0.45 + index * 0.12 }}
      style={{
        scale: nearScale,
        ...CENTERED,
      }}
    />
  );
}

function DiffRow({
  px,
  py,
  y,
  width,
  added,
  index,
  reduceMotion,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  y: number;
  width: number;
  added: boolean;
  index: number;
  reduceMotion: boolean | null;
}) {
  const near = useTransform(() => {
    const dy = Math.abs(py.get() - (y + 3));
    const dx = Math.abs(px.get() - 130);
    if (dy > 14 || dx > 160) return 0;
    return 1 - dy / 14;
  });

  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 1.15 + index * 0.13 }}
    >
      <rect
        x="24"
        y={y - 1}
        width="4"
        height="8"
        rx="2"
        className={
          added ? "fill-brand-accent" : "fill-hairline-soft dark:fill-white/20"
        }
      />

      <motion.rect
        x="36"
        y={y}
        width={width}
        height="6"
        rx="3"
        className={
          added ? "fill-brand-accent/30" : "fill-hairline dark:fill-white/10"
        }
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        style={GROW_FROM_LEFT}
        transition={{ duration: 0.45, ease: EASE, delay: 1.15 + index * 0.13 }}
      />

      <motion.rect
        x="36"
        y={y}
        width={width}
        height="6"
        rx="3"
        className={
          added ? "fill-brand-accent" : "fill-hairline-soft dark:fill-white/25"
        }
        style={{ opacity: near }}
      />
    </motion.g>
  );
}

function PullRequestIllustration() {
  const reduceMotion = useSafeReducedMotion();
  const { px, py, onPointerMove, onPointerLeave } = useSvgPointer();

  const commits = [150, 178, 206];
  const rows = [
    { width: 224, added: false },
    { width: 186, added: true },
    { width: 152, added: true },
    { width: 202, added: false },
  ];

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      role="img"
      aria-label="A branch of commits merging back into the trunk, with its diff written out below"
      className="w-full max-w-sm touch-none"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <path
        d="M20 52 H300"
        className="stroke-hairline dark:stroke-white/10"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <motion.path
        d="M96 52 C118 52 118 24 140 24 H216 C238 24 238 52 260 52"
        className="stroke-brand-accent"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      />

      {commits.map((cx, index) => (
        <Commit
          key={cx}
          px={px}
          py={py}
          cx={cx}
          index={index}
          reduceMotion={reduceMotion}
        />
      ))}

      <motion.circle
        cx="260"
        cy="52"
        r="6"
        className="fill-brand-accent"
        initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        style={CENTERED}
        transition={{ duration: 0.35, ease: EASE, delay: 1 }}
      />

      {rows.map((row, index) => (
        <DiffRow
          key={index}
          px={px}
          py={py}
          y={87 + index * 18}
          width={row.width}
          added={row.added}
          index={index}
          reduceMotion={reduceMotion}
        />
      ))}
    </svg>
  );
}

function ReviewSection({
  px,
  py,
  y,
  base,
  bodyWidth,
  reduceMotion,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  y: number;
  base: number;
  bodyWidth: number;
  reduceMotion: boolean | null;
}) {
  const near = useTransform(() => {
    const dy = Math.abs(py.get() - y);
    const dx = Math.abs(px.get() - 160);
    if (dy > 18 || dx > 150) return 0;
    return 1 - dy / 18;
  });
  const discOpacity = useTransform(near, [0, 1], [0, 0.18]);
  const bodyScale = useTransform(near, [0, 1], [0.9, 1]);

  return (
    <g>
      <motion.circle
        cx="49"
        cy={y}
        r="6.5"
        className="stroke-brand-accent"
        strokeWidth="1.5"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE, delay: base }}
      />

      <motion.circle
        cx="49"
        cy={y}
        r="6.5"
        className="fill-brand-accent"
        style={{ opacity: discOpacity }}
      />

      <motion.path
        d={`M46 ${y} l2.2 2.2 l4.4 -4.4`}
        className="stroke-brand-accent"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: EASE, delay: base + 0.22 }}
      />

      <motion.rect
        x="66"
        y={y - 8}
        width="74"
        height="6"
        rx="3"
        className="fill-hairline-soft dark:fill-white/20"
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        style={GROW_FROM_LEFT}
        transition={{ duration: 0.35, ease: EASE, delay: base }}
      />

      <motion.rect
        x="66"
        y={y + 3}
        width={bodyWidth}
        height="5"
        rx="2.5"
        className="fill-hairline dark:fill-white/10"
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        style={GROW_FROM_LEFT}
        transition={{ duration: 0.4, ease: EASE, delay: base + 0.12 }}
      />

      <motion.rect
        x="66"
        y={y + 3}
        width={bodyWidth}
        height="5"
        rx="2.5"
        className="fill-brand-accent/45"
        style={{
          opacity: near,
          scaleX: bodyScale,
          ...GROW_FROM_LEFT,
        }}
      />
    </g>
  );
}

function ReviewIllustration() {
  const reduceMotion = useSafeReducedMotion();
  const { px, py, onPointerMove, onPointerLeave } = useSvgPointer();

  const sections = [0, 1, 2].map((index) => ({
    index,
    y: 58 + index * 32,
    base: 0.5 + index * 0.45,
    bodyWidth: index === 1 ? 152 : 196,
  }));

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      role="img"
      aria-label="A structured review being written section by section"
      className="w-full max-w-sm touch-none"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <circle
        cx="48"
        cy="34"
        r="9"
        className="stroke-brand-accent/50"
        strokeWidth="1.5"
      />
      <circle cx="48" cy="34" r="3.5" className="fill-brand-accent" />

      <motion.rect
        x="66"
        y="30"
        width="96"
        height="7"
        rx="3.5"
        className="fill-hairline-soft dark:fill-white/20"
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        style={GROW_FROM_LEFT}
        transition={{ duration: 0.4, ease: EASE, delay: 0.25 }}
      />

      {sections.map((section) => (
        <ReviewSection
          key={section.index}
          px={px}
          py={py}
          y={section.y}
          base={section.base}
          bodyWidth={section.bodyWidth}
          reduceMotion={reduceMotion}
        />
      ))}
    </svg>
  );
}

export function StepIllustration({ index }: { index: number }) {
  if (index === 0) return <ConnectIllustration />;
  if (index === 1) return <PullRequestIllustration />;
  return <ReviewIllustration />;
}
