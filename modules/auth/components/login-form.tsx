"use client";

import { signIn } from "@/lib/auth-client";
import { FaGithub } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn.social({ provider: "github", callbackURL: "/dashboard" });
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#fafafa] dark:bg-zinc-950">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d4 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Left panel */}
      <div className="relative hidden md:flex flex-col justify-between border-r border-zinc-200 bg-white p-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <span className="inline-flex items-center bg-[#dcfce7] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#047857]">
            AI-POWERED CODE REVIEW
          </span>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            Kryon
          </p>
        </div>

        <div className="max-w-md space-y-5">
          <h2 className="text-[38px] font-medium leading-[0.96] tracking-[-0.05em] text-black dark:text-white">
            Cut review time.<br />Ship better code.
          </h2>
          <p className="text-[15px] leading-[1.5] text-zinc-500">
            Kryon posts a full AI review on every PR before your first human
            reviewer arrives. Summaries, inline suggestions, security scans,
            quality scores.
          </p>

          <div className="border-l-2 border-emerald-600 pl-4">
            <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              &ldquo;Kryon catches the issues that slip through rushed reviews.
              It has become part of every PR we merge.&rdquo;
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Kartikey, Builder of Kryon
            </p>
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          Built for developers who care about quality.
        </p>
      </div>

      {/* Right panel */}
      <div className="relative flex items-center justify-center px-8">
        <div className="w-full max-w-sm">

          {/* Mobile brand */}
          <div className="mb-8 text-center md:hidden">
            <span className="inline-flex items-center bg-[#dcfce7] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#047857]">
              AI-POWERED CODE REVIEW
            </span>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              Kryon
            </p>
          </div>

          {/* Card */}
          <div className="border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
              Sign in
            </p>
            <h2 className="mt-3 text-[22px] font-medium tracking-[-0.04em] text-black dark:text-white">
              Continue with GitHub
            </h2>
            <p className="mt-1 text-[13px] text-zinc-500">
              Your GitHub account is all you need.
            </p>

            {error && (
              <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleGithubLogin}
              disabled={isLoading}
              aria-busy={isLoading}
              className="mt-7 flex h-11 w-full items-center justify-center gap-3 bg-black text-[14px] font-medium text-white transition-colors hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <FaGithub size={16} />
                  <span>Continue with GitHub</span>
                </>
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-[12px] text-zinc-400">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-zinc-700 underline underline-offset-4 hover:text-black dark:text-zinc-300 dark:hover:text-white">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-zinc-700 underline underline-offset-4 hover:text-black dark:text-zinc-300 dark:hover:text-white">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
