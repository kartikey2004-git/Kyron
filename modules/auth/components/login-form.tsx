"use client";

import { signIn } from "@/lib/auth-client";
import { GithubIcon } from "lucide-react";
import React, { useState } from "react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn.social({ provider: "github" });
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white text-black">
      <div className="hidden md:flex flex-col justify-between p-12 border-r border-black/10">
        <h1 className="text-base font-medium tracking-tight">CodeSense AI</h1>

        <div className="max-w-md space-y-5">
          <h2 className="text-4xl font-semibold tracking-tight leading-[1.1]">
            Cut code review time and bugs in half
          </h2>

          <p className="text-sm text-black/60 leading-relaxed">
            Supercharge your team to ship faster with AI-powered code reviews,
            automated insights, and smarter debugging workflows.
          </p>
        </div>

        <p className="text-xs text-black/50">
          Built for developers who care about quality.
        </p>
      </div>

      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden text-center space-y-2">
            <h1 className="text-lg font-medium tracking-tight">CodeSense AI</h1>
            <p className="text-sm text-black/60">
              Cut code review time and bugs in half
            </p>
          </div>

          <div className="border border-black/10 rounded-md bg-white p-6 space-y-5 shadow-sm">
            <div>
              <h2 className="text-sm font-medium">Sign in</h2>
              <p className="text-xs text-black/60 mt-1">
                Continue with your GitHub account
              </p>
            </div>

            {error && (
              <div className="text-xs text-red-500 border border-red-500/20 bg-red-500/10 px-3 py-2 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleGithubLogin}
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium rounded-md 
              bg-black text-white py-2.5 
              hover:bg-black/90 
              active:scale-[0.98] 
              transition
              disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <GithubIcon size={16} />
                  Continue with GitHub
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-black/50 text-center mt-6">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
