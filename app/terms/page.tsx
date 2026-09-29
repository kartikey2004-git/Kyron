import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Kryon",
  description: "Terms governing your use of Kryon.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d4 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Back to Kryon
        </Link>

        <div className="mt-10 border border-zinc-200 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="inline-flex items-center bg-[#dcfce7] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#047857]">
            Legal
          </span>

          <h1 className="mt-5 text-[32px] font-medium leading-[0.96] tracking-[-0.05em] text-black dark:text-white">
            Terms of Service
          </h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            Last updated: September 2026
          </p>

          <div className="mt-10 space-y-8 text-[14px] leading-[1.7] text-zinc-600 dark:text-zinc-400">
            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                01. Acceptance
              </h2>
              <p>
                By signing in and using Kryon, you agree to these terms. If you do not agree, do not use the service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                02. What Kryon does
              </h2>
              <p>
                Kryon is an AI-powered code review tool. It reads pull request diffs on repositories you connect via GitHub OAuth and posts review comments. Kryon does not modify your code, merge pull requests, or take any write action beyond posting comments.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                03. Your responsibilities
              </h2>
              <p>
                You are responsible for the repositories you connect and the pull requests Kryon reviews. Do not connect repositories you do not have permission to access. You are responsible for reviewing and acting on Kryon&apos;s output, AI reviews may contain errors.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                04. No warranty
              </h2>
              <p>
                Kryon is provided as-is. We make no guarantees about the accuracy, completeness, or fitness of AI-generated reviews. Use your own judgement before acting on any review output.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                05. Termination
              </h2>
              <p>
                You can disconnect your account at any time from your settings page. We reserve the right to suspend or terminate access for misuse or abuse of the service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                06. Contact
              </h2>
              <p>
                Questions about these terms can be sent to{" "}
                <a
                  href="mailto:kartikeybhatnagar247@gmail.com"
                  className="text-zinc-800 underline underline-offset-4 hover:text-black dark:text-zinc-200 dark:hover:text-white"
                >
                  kartikeybhatnagar247@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>

        <div className="mt-6 flex gap-6 text-[12px] text-zinc-400">
          <Link href="/privacy" className="underline underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300">
            Privacy Policy
          </Link>
          <Link href="/" className="underline underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
