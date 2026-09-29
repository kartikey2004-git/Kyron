"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { StackIllustration } from "./stack-illustration";

export function Hero() {
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
    <section className="relative w-full overflow-hidden">
      <div className="relative z-10 mx-auto grid w-full max-w-[1300px] gap-16 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10">
        <div className="text-left">
          <div className="mb-7">
            <span className="inline-flex items-center bg-[#dcfce7] px-5 py-2 text-[12px] font-medium uppercase tracking-[0.22em] text-[#047857]">
              AI-POWERED CODE REVIEW
            </span>
          </div>

          <h1 className="max-w-[640px] text-[28px] font-medium leading-[0.96] tracking-[-0.06em] text-black dark:text-white sm:text-[36px] md:text-[42px] lg:text-[54px]">
            Ship Better Code.
            <br />
            Catch Bugs Before They{" "}
            <span className="text-[#047857]">Reach</span>
            <br />
            Production
          </h1>

          <p className="mt-5 max-w-[540px] text-[15px] leading-[1.5] text-[#666666] sm:text-[16px] md:mt-7 md:text-[18px] lg:text-[20px]">
            Kryon reviews every pull request in seconds:
            summaries, inline suggestions, security scans, and quality scores
            posted directly on your PR before your first human reviewer arrives.
          </p>

          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={handleStartReviewing}
              className="h-13 rounded-none bg-black px-8 text-[15px] font-medium text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Start Reviewing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 rounded-none border-neutral-300 bg-white px-8 text-[15px] font-medium hover:bg-neutral-50"
            >
              <a
                href="https://kyrondevdocs.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <span>Reviews in Seconds |</span>
            <span>Catches Security Issues |</span>
            <span>Multi-Language |</span>
            <span>Works on Every PR</span>
          </div>
        </div>

        <div className="hidden justify-center py-10 lg:flex">
          <StackIllustration />
        </div>
      </div>
    </section>
  );
}
