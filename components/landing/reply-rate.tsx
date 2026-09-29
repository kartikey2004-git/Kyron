"use client";

import { motion } from "framer-motion";
import { GitPullRequest, Bot, CheckCircle } from "lucide-react";

const STAGES = [
  { label: "Connect GitHub", icon: GitPullRequest },
  { label: "Open a Pull Request", icon: Bot },
  { label: "Get AI Review", icon: CheckCircle },
];

export default function ReplyRateSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#fafafa] py-16">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle,#d4d4d4 1px,transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative w-full border border-zinc-200 bg-[#f8f8f8] p-5 sm:p-8 md:p-14">
        <div className="max-w-5xl">
          <div className="inline-flex items-center bg-emerald-50 px-3 py-2 text-xs uppercase tracking-[0.2em] text-emerald-700">
            • REVIEWED BY AI, CONFIRMED BY YOU
          </div>

          <h2 className="mt-6 text-2xl font-medium tracking-tight text-black sm:text-3xl md:text-5xl">
            Every PR Gets A Thorough Review. Every Time.
          </h2>

          <p className="mt-6 max-w-5xl text-zinc-600">
            Human reviewers miss things, not because they&apos;re careless, but
            because reviewing is hard and time is short. Kryon reads every line
            of every diff with the same attention, every single time, and tells
            you exactly what it found.
          </p>

          <p className="mt-5 text-zinc-700">
            That&apos;s what makes it a reviewer worth trusting, not just
            another linter.
          </p>
        </div>

        <ReviewBento />
      </div>
    </section>
  );
}

function ReviewBento() {
  return (
    <div className="mt-14">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
        How a review happens
      </div>

      <div className="grid gap-3 lg:grid-cols-3 lg:grid-rows-[180px_180px]">
        {/* Main process card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden border border-zinc-300 bg-white p-6 lg:col-span-2 lg:row-span-2"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                The process
              </p>

              <h3 className="mt-2 max-w-md text-xl font-medium tracking-tight text-black">
                From a new PR to a complete AI review in seconds.
              </h3>
            </div>

            <div className="flex h-8 w-8 items-center justify-center border border-zinc-200 bg-zinc-50">
              <CheckCircle
                className="h-4 w-4 text-emerald-700"
                strokeWidth={1.7}
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-2">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon;

              return (
                <div key={stage.label} className="relative">
                  <div className="border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex h-7 w-7 items-center justify-center border border-zinc-200 bg-white">
                      <Icon
                        className="h-3.5 w-3.5 text-emerald-700"
                        strokeWidth={1.75}
                      />
                    </div>

                    <p className="mt-8 text-xs font-medium leading-snug text-zinc-900">
                      {stage.label}
                    </p>

                    <span className="mt-2 block font-mono text-[9px] text-zinc-400">
                      0{index + 1}
                    </span>
                  </div>

                  {index < STAGES.length - 1 && (
                    <div className="absolute right-[-8px] top-1/2 z-10 hidden h-px w-4 bg-zinc-300 sm:block" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-0 h-px w-1/3 bg-emerald-600" />
        </motion.div>

        {/* Languages card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-zinc-300 bg-zinc-900 p-6 text-white"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Language support
          </p>

          <div className="mt-5 flex items-end justify-between">
            <span className="text-4xl font-medium tracking-tight">4+</span>
            <span className="max-w-[120px] text-right text-xs leading-relaxed text-zinc-400">
              languages: TypeScript, JavaScript, Python, Go and growing
            </span>
          </div>
        </motion.div>

        {/* Speed card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border border-zinc-300 bg-white p-6"
        >
          <div className="flex items-center gap-2">
            <Bot
              className="h-4 w-4 text-emerald-700"
              strokeWidth={1.75}
            />

            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
              The speed
            </p>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-zinc-700">
            A full review (summary, suggestions, security scan, quality score)
            posted on your PR in seconds, not hours.
          </p>
        </motion.div>

        {/* Why it matters */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border border-zinc-300 bg-zinc-50 p-6 lg:col-span-2"
        >
          <div className="flex items-start gap-4">
            <GitPullRequest
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
              strokeWidth={1.75}
            />

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                The difference
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-700">
                Kryon doesn&apos;t replace your team. It makes sure no PR
                arrives at a human reviewer empty-handed. Issues are already
                flagged, context is already written, and your team can focus on
                the decisions only humans should make.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
