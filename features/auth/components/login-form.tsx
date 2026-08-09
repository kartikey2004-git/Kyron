"use client";

/*

  - Sign-in using GitHub OAuth, GitHub is the only auth provider, deliberately used because reviewing PRs requires a GitHub token regardless, so there's no product reason to also support email/password.

  - This just triggers Better Auth's social sign-in flow reached either directly or via `requireAuth` function redirecting unauthenticated users here.

*/

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { GitPullRequest, KeyRound, Unplug } from "lucide-react";
import { signIn } from "@/server/auth/auth-client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { steps } from "@/features/marketing";
import type { IconComponent } from "@/types/navigation";

function KryonMark() {
  return (
    <span className="relative block size-5 shrink-0">
      <Image
        src="/svg/kryon-mark-light.svg"
        alt=""
        aria-hidden="true"
        fill
        className="dark:hidden"
      />
      <Image
        src="/svg/kryon-mark-dark.svg"
        alt=""
        aria-hidden="true"
        fill
        className="hidden dark:block"
      />
    </span>
  );
}

// What the OAuth consent screen actually grants

const grants: { icon: IconComponent; title: string; detail: string }[] = [
  {
    icon: GitPullRequest,
    title: "Repo scope",
    detail: "To read private pull requests and post review comments.",
  },
  {
    icon: KeyRound,
    title: "Tokens encrypted at rest",
    detail: "AES-256-GCM, under a key kept separate from the session secret.",
  },
  {
    icon: Unplug,
    title: "Reversible",
    detail: "Disconnecting a repository removes its webhook.",
  },
];

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    setError(null);

    // On success, signIn.social redirects the whole page to GitHub's OAuth screen, so this component unmounts when isLoading only needs resetting on the failure path.

    try {
      await signIn.social({ provider: "github" });
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="relative z-10 border-b border-hairline dark:border-white/10">
        <div className="flex h-16 items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 text-base font-medium tracking-tight text-foreground"
          >
            <KryonMark />
            Kryon
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-link-sm font-normal text-ink-soft transition-colors hover:text-foreground dark:text-ash"
            >
              Back to Home
            </Link>

            <ThemeToggle variant="ghost" />
          </div>
        </div>
      </header>

      <main className="grid flex-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="relative hidden flex-col justify-between border-r border-hairline p-10 lg:flex xl:p-14 dark:border-white/10">
          <div
            aria-hidden="true"
            className="gutter-rail pointer-events-none absolute inset-0"
          />

          <div className="relative">
            <p className="text-[12px] text-brand-accent">After you sign in</p>

            <h2 className="mt-4 max-w-sm text-heading-md text-foreground">
              Three steps to a reviewed pull request
            </h2>
          </div>

          <ol className="relative my-12 divide-y divide-hairline border-y border-hairline dark:divide-white/10 dark:border-white/10">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li key={step.title} className="flex gap-5 py-6">
                  <span className="pt-0.5 font-mono text-[12px] tabular-nums text-stone">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-4 shrink-0 text-foreground" />

                      <h3 className="text-body-strong text-foreground">
                        {step.title}
                      </h3>
                    </div>

                    <p className="mt-2 max-w-md text-body text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="relative max-w-sm text-meta text-stone">
            No CLI, no config file, and nothing added to CI. Reviews are driven
            by a webhook on the repositories you connect.
          </p>
        </section>

        <section className="relative flex items-center justify-center px-6 py-14 lg:px-8">
          <div
            aria-hidden="true"
            className="gutter-rail pointer-events-none absolute inset-0"
          />

          <div className="relative w-full max-w-sm">
            <div className="space-y-8 rounded-md border border-hairline bg-card p-8 dark:border-white/10">
              <div className="space-y-3">
                <h1 className="text-heading-sm text-foreground">
                  Sign in to Kryon
                </h1>

                <p className="text-meta text-muted-foreground">
                  GitHub is the only sign-in method — reviewing pull requests
                  needs a GitHub token either way.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-meta text-destructive"
                >
                  {error}
                </div>
              )}

              <Button
                onClick={handleGithubLogin}
                disabled={isLoading}
                aria-busy={isLoading}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <>
                    <FaGithub size={18} />
                    <span>Continue with GitHub</span>
                  </>
                )}
              </Button>

              <div className="space-y-4 border-t border-hairline pt-6 dark:border-white/10">
                <p className="text-[11px] tracking-[0.2px] text-slate uppercase dark:text-ash">
                  What you&apos;re granting
                </p>

                <ul className="space-y-3.5">
                  {grants.map((grant) => {
                    const Icon = grant.icon;

                    return (
                      <li key={grant.title} className="flex gap-3">
                        <Icon className="mt-0.5 size-3.5 shrink-0 text-stone" />

                        <p className="text-meta text-muted-foreground">
                          <span className="text-foreground">
                            {grant.title}.
                          </span>{" "}
                          {grant.detail}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <ol className="mt-8 space-y-3 lg:hidden">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="font-mono text-[12px] tabular-nums text-stone">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="text-meta text-muted-foreground">
                    {step.title}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-center text-meta text-muted-foreground">
              The free plan connects one repository, no card required. See{" "}
              <Link
                href="/pricing"
                className="text-foreground underline-offset-4 hover:underline"
              >
                pricing
              </Link>
              .
            </p>

            <p className="mt-3 text-center text-meta text-muted-foreground">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-foreground underline-offset-4 hover:underline"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-foreground underline-offset-4 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
