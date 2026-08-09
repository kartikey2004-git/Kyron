import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StartButton } from "../start-button";
import { SectionShell } from "../page-frame";
import { siteLinks } from "../data";

export function Hero() {
  return (
    <SectionShell className="bg-background" innerClassName="px-6 pt-16 lg:px-8">
      <div className="mx-auto w-full pt-16 text-center">
        <p className="text-[12px] font-normal text-brand-accent">
          Kryon | AI-powered code review
        </p>

        <h1 className="mx-auto mt-4 max-w-xl text-[20px] font-medium leading-[1.15] tracking-[-0.7px] text-foreground md:text-hero">
          Review pull requests <br /> in seconds{" "}
          <span className="text-brand-accent">with AI</span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.6] text-stone">
          Kryon reads every pull request against the rest of your codebase, then
          posts a structured review walkthrough, risks, and concrete suggestions
          before a human opens the diff.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <StartButton className="h-9 rounded-sm px-5 text-sm font-medium">
            Start reviewing
          </StartButton>

          <Button
            asChild
            variant="outline"
            className="h-9 rounded-sm border-hairline px-5 text-sm font-medium dark:border-border"
          >
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>

        <Link
          href={siteLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-[12px] font-normal text-stone transition-colors hover:text-foreground"
        >
          Built by Kartikey
        </Link>

        <div className="mt-12 aspect-1192/852 overflow-hidden">
          <Image
            src="/light.png"
            alt="The Kryon dashboard, showing review activity and connected repositories"
            width={1192}
            height={852}
            sizes="(min-width: 896px) 896px, 100vw"
            priority
            className="h-full w-full object-cover object-top dark:hidden"
          />

          <Image
            src="/dark.png"
            alt=""
            aria-hidden="true"
            width={1195}
            height={857}
            sizes="(min-width: 896px) 896px, 100vw"
            priority
            className="hidden h-full w-full object-cover object-top dark:block"
          />
        </div>
      </div>
    </SectionShell>
  );
}
