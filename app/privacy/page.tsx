import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Kryon",
  description: "How Kryon collects, uses, and protects your data.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            Last updated: September 2026
          </p>

          <div className="mt-10 space-y-8 text-[14px] leading-[1.7] text-zinc-600 dark:text-zinc-400">
            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                01. What we collect
              </h2>
              <p>
                When you sign in with GitHub, Kryon receives your GitHub username, email address, and a scoped OAuth token. We use the token only to read pull request diffs and post review comments on repositories you explicitly connect.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                02. How we use it
              </h2>
              <p>
                Your OAuth token is used solely to perform code reviews on the repositories you connect. We never read repository code outside of an open pull request, and we never train AI models on your code.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                03. Storage and security
              </h2>
              <p>
                OAuth tokens are encrypted at rest using AES-256-GCM under a key kept separate from the session secret. Your data is stored in a PostgreSQL database hosted on Neon. We do not sell, rent, or share your data with third parties.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                04. Retention
              </h2>
              <p>
                Review data is retained as long as your account is active. Disconnecting a repository removes its webhook immediately. Deleting your account removes all associated data within 30 days.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                05. Contact
              </h2>
              <p>
                Questions about this policy can be sent to{" "}
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
          <Link href="/terms" className="underline underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300">
            Terms of Service
          </Link>
          <Link href="/" className="underline underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
