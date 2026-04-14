"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  useModeAnimation,
  ThemeAnimationType,
} from "react-theme-switch-animation";

import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle,
  GitPullRequest,
  Moon,
  Star,
  Sun,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { features, footerLinks, plans, socialLinks, steps } from "./data";

export function MainPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme switch animation hook
  const {
    ref: themeButtonRef,
    toggleSwitchTheme,
    isDarkMode,
  } = useModeAnimation({
    animationType: ThemeAnimationType.CIRCLE,
    duration: 400,
    easing: "ease-in-out",
    globalClassName: "dark",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartReviewing = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleThemeToggle = () => {
    toggleSwitchTheme();
  };

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center border border-border bg-background">
              <span className="text-[10px] font-medium leading-none">AI</span>
            </div>
            <span className="text-sm font-medium">AI Code Review</span>
          </div>

          {mounted && (
            <button
              ref={themeButtonRef}
              onClick={handleThemeToggle}
              className="flex h-6 w-6 items-center justify-center rounded-sm border border-border bg-background hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-3 w-3" />
              ) : (
                <Moon className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      </header>

      <section className="flex min-h-screen items-center justify-center bg-background pt-14">
        <div className="w-full max-w-4xl px-8 text-center">
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-2">
                <span className="text-sm font-medium tracking-wide">
                  AI-Powered Code Review
                </span>
              </div>

              <h1 className="text-4xl leading-tighter tracking-tight sm:text-5xl lg:text-6xl">
                Review pull requests
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {" "}
                  in seconds
                </span>
                <span className="text-muted-foreground"> with AI</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-tight sm:text-xl">
                Catch bugs, get intelligent suggestions, and ship better code
                faster. Our AI reviews every line of code so your team can focus
                on building.
              </p>
            </div>

            <div className="flex flex-col gap-4 justify-center items-center sm:flex-row sm:gap-6">
              <Button
                onClick={handleStartReviewing}
                size="lg"
                className="h-14 px-8 text-base font-medium transition-all hover:scale-105"
              >
                Start reviewing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base font-medium"
              >
                Built by Kartikey
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl leading-tighter tracking-tighter mb-8 sm:text-4xl lg:text-5xl">
              Everything you need for
              <br />
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                smarter code reviews
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto sm:text-xl leading-relaxed">
              Powerful AI features that help your team ship better code, faster.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group border border-border bg-card p-8 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg hover:shadow-foreground/5"
                >
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50">
                        <Icon className="h-6 w-6 text-foreground" />
                      </div>
                      {feature.badge && (
                        <div className="rounded-full border border-border bg-muted/50 px-3 py-1">
                          <span className="text-xs font-medium">
                            {feature.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold leading-tight">
                      {feature.title}
                    </h3>

                    <p className="text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl leading-tighter tracking-tighter mb-4 sm:text-4xl lg:text-5xl">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto sm:text-xl leading-relaxed">
              Get started in minutes. No complex configuration required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative">
                  <div className="space-y-8">
                    <div className="flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center border border-border bg-background shadow-sm">
                        <Icon className="h-8 w-8 text-foreground" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-8 left-full w-12 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border"></div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="max-w-5xl mx-auto mt-16">
            <div className="border border-border bg-card overflow-hidden shadow-lg">
              <div className="border-b border-border bg-muted/50 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background">
                      <GitPullRequest className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        feat: Add user authentication
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Pull Request #142 • opened 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="rounded-sm border border-border bg-muted/50 px-4 py-2">
                      <span className="text-xs font-medium">AI Reviewed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-8">
                  <div className="bg-muted/30 rounded-md p-6 font-mono text-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-muted-foreground font-medium">
                        src/auth/login.ts
                      </span>
                      <div className="rounded-full border border-border bg-muted/50 px-3 py-1">
                        <span className="text-xs font-medium">+45 -12</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex">
                        <span className="w-8 text-muted-foreground text-right pr-4">
                          24
                        </span>
                        <span className="text-muted-foreground">
                          export const Login = () =&gt; {"{"}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-8 text-muted-foreground text-right pr-4">
                          25
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          const [email, setEmail] = useState(&apos;&apos;)
                        </span>
                      </div>
                      <div className="flex bg-green-500/10">
                        <span className="w-8 text-green-600 text-right pr-4">
                          26
                        </span>
                        <span className="text-green-600">
                          + const [password, setPassword] =
                          useState(&apos;&apos;)
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-8 text-muted-foreground text-right pr-4">
                          27
                        </span>
                        <span className="text-muted-foreground"> </span>
                      </div>
                      <div className="flex bg-green-500/10">
                        <span className="w-8 text-green-600 text-right pr-4">
                          28
                        </span>
                        <span className="text-green-600">
                          + const handleSubmit = async (e: React.FormEvent)
                          =&gt; {"{"}
                        </span>
                      </div>
                      <div className="flex bg-green-500/10">
                        <span className="w-8 text-green-600 text-right pr-4">
                          29
                        </span>
                        <span className="text-green-600">
                          + e.preventDefault()
                        </span>
                      </div>
                      <div className="flex bg-red-500/10">
                        <span className="w-8 text-red-600 text-right pr-4">
                          30
                        </span>
                        <span className="text-red-600 line-through">
                          - const response = await fetch(&apos;/api/login&apos;,{" "}
                          {})
                        </span>
                      </div>
                      <div className="flex bg-green-500/10">
                        <span className="w-8 text-green-600 text-right pr-4">
                          31
                        </span>
                        <span className="text-green-600">
                          + const response = await auth.signIn(email, password)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-border">
                    <div className="flex items-center gap-8 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
                          <Bot className="h-4 w-4 text-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            AI analyzed
                          </p>
                          <p className="text-muted-foreground">in 3.2s</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            3 suggestions
                          </p>
                          <p className="text-muted-foreground">provided</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg ">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">1 issue</p>
                          <p className="text-muted-foreground">found</p>
                        </div>
                      </div>
                    </div>
                    <Button size="lg" className="h-12 px-6">
                      View full analysis
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl leading-tighter tracking-tighter mb-4 sm:text-4xl lg:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto sm:text-xl leading-relaxed">
              Choose the perfect plan for your needs. Start free and scale as
              you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative border transition-all duration-300 ${
                  plan.highlighted
                    ? "border-foreground  shadow-xl scale-105"
                    : "border-border bg-muted/5 hover:border-foreground/20 hover:shadow-lg"
                }`}
              >
                <div className="p-10">
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="inline-flex items-center rounded-full border border-border bg-foreground px-4 py-2">
                        <span className="text-sm font-medium text-background">
                          Most Popular
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold">{plan.name}</h3>
                      <p className="text-muted-foreground text-lg">
                        {plan.description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground text-lg">
                          {plan.period}
                        </span>
                      </div>

                      <Button
                        className={`w-full ${
                          plan.highlighted
                            ? "bg-foreground text-background hover:bg-muted-foreground"
                            : "bg-foreground text-background hover:bg-muted/20"
                        }`}
                        size="lg"
                      >
                        Get started
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-4"
                        >
                          <Check className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-base text-muted-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl leading-tighter tracking-tighter sm:text-4xl lg:text-5xl">
                Ship better code faster
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto sm:text-xl leading-tight">
                Join hundreds of developers who are already using AI <br /> to
                review pull requests in seconds, not hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                onClick={handleStartReviewing}
                className="h-14 px-8 text-base font-medium bg-foreground text-background hover:bg-muted-foreground min-w-[220px] transition-all hover:scale-105"
              >
                Start reviewing for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-semibold text-xl mb-6">AI Code Review</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Review pull requests in seconds with AI. Ship better code,
                faster.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-base mb-6">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground text-base hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-base mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground text-base hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-base mb-6">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground text-base hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-muted-foreground text-base">
                © 2026 AI Code Review. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
