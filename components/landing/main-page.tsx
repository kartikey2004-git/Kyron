"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle,
  Github,
  GitPullRequest,
  Star,
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

  const handleStartReviewing = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="mx-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                AI-Powered Code Review
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground">
                Review pull requests
                <br />
                <span className="text-primary">in seconds</span> with AI
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Catch bugs, get intelligent suggestions, and ship better code
                faster. Our AI reviews every line of code so your team can focus
                on building.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[200px]"
                onClick={handleStartReviewing}
              >
                Start reviewing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Built by Kartikey
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span>GitHub integration</span>
              </div>
              <span>•</span>
              <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              Everything you need for
              <br />
              <span className="text-primary">smarter code reviews</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful AI features that help your team ship better code, faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group bg-card border border-border hover:border-primary/20 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {feature.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes. No complex configuration required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full bg-card border border-border hover:border-primary/20 transition-all duration-200">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-full w-8">
                      <div className="flex items-center justify-center">
                        <div className="h-0.5 w-full bg-border"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              See it in action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch how AI transforms your pull request reviews from hours to
              minutes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border border-border shadow-lg">
              <CardHeader className="border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GitPullRequest className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">
                        feat: Add user authentication
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Pull Request #142 • opened 2 hours ago
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    AI Reviewed
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Code Diff */}
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-muted-foreground">
                        src/auth/login.ts
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        +45 -12
                      </Badge>
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
                          {"{"}
                        </span>
                      </div>
                      <div className="flex bg-green-500/10">
                        <span className="w-8 text-green-600 text-right pr-4">
                          30
                        </span>
                        <span className="text-green-600">
                          + const response = await auth.signIn(email, password)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Comment */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            AI Assistant
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            Security
                          </Badge>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-900 leading-relaxed">
                            <strong>Security Improvement:</strong> Good catch on
                            using the auth service instead of direct API calls!
                            This ensures proper token handling and CSRF
                            protection. However, I noticed you are storing the
                            password in state - consider clearing it after
                            submission for better security.
                          </p>
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                            >
                              Apply suggestion
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7"
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            AI Assistant
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            Bug
                          </Badge>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <p className="text-sm text-orange-900 leading-relaxed">
                            <strong>Potential Issue:</strong> The form
                            doesn&apos;t validate email format before
                            submission. Consider adding email validation to
                            prevent invalid submissions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            AI Assistant
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-700"
                          >
                            Best Practice
                          </Badge>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-900 leading-relaxed">
                            <strong>Excellent:</strong> Great use of TypeScript
                            types and async/await pattern. The code is clean and
                            follows React best practices.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          AI analyzed in 3.2s
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">
                          3 suggestions
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-muted-foreground">
                          1 potential issue
                        </span>
                      </div>
                    </div>
                    <Button size="sm">View full analysis</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your needs. Start free and scale as
              you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-card border transition-all duration-200 hover:shadow-lg hover:translate-y-[-4px] ${
                  plan.highlighted
                    ? "border-primary shadow-lg ring-2 ring-primary/20"
                    : "border-border hover:border-primary/20"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                      size="lg"
                    >
                      {plan.price === "$0" ? "Get Started" : "Start Free Trial"}
                    </Button>

                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm">
              All plans include core features. No hidden fees. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                Ship better code faster
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join thousands of developers who are already using AI to review
                pull requests in seconds, not hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[200px]"
              >
                Start reviewing for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Schedule demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span>✓ No credit card required</span>
              <span>•</span>
              <span>✓ Setup in 2 minutes</span>
              <span>•</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-semibold text-lg mb-4">AI Code Review</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Review pull requests in seconds with AI. Ship better code,
                faster.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © 2024 AI Code Review. All rights reserved.
              </p>

              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
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
