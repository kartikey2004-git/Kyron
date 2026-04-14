"use client";

import { signIn } from "@/lib/auth-client";
import { Moon, Sun } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import React, { useState } from "react";
import { useTheme } from "next-themes";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 md:grid-cols-2 relative">
      {/* Theme Toggle Button */}
      <button
        onClick={handleThemeToggle}
        className="absolute top-6 right-6 p-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-foreground" />
        )}
      </button>

      <div className="hidden md:flex flex-col justify-between p-12 border-r border-border">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">
            AI Code Review
          </h1>
          <p className="text-sm text-muted-foreground">
            Review pull requests in seconds with AI
          </p>
        </div>

        <div className="max-w-md space-y-6">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Cut code review time and bugs in half
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed">
            Supercharge your team to ship faster with AI-powered code reviews,
            automated insights, and smarter debugging workflows.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Built for developers who care about quality.
        </p>
      </div>

      <div className="flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden text-center space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">
              CodeSense AI
            </h1>
            <p className="text-sm text-muted-foreground">
              Review pull requests in seconds with AI
            </p>
          </div>

          <div className="border border-border bg-card rounded-md p-8 space-y-8 shadow-lg">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Sign in</h2>
              <p className="text-sm text-muted-foreground">
                Continue with your GitHub account
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 border border-red-600/20 bg-red-600/10 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleGithubLogin}
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full flex items-center justify-center gap-3 text-base font-medium rounded-lg 
              bg-foreground text-background 
              hover:bg-muted-foreground 
              active:scale-[0.98] 
              transition-all duration-200 
              disabled:opacity-50 
              h-12 px-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </span>
              ) : (
                <>
                  <FaGithub size={18} />
                  <span>Continue with GitHub</span>
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-8">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-foreground hover:underline underline-offset-4"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-foreground hover:underline underline-offset-4"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
