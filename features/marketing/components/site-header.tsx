"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { StartButton } from "./start-button";
import { GutterRails } from "./gutter-rails";
import { navLinks } from "./data";

function KryonMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="size-5 shrink-0 fill-current"
    >
      <rect x="7.5" y="2" width="10.5" height="10.5" rx="3" />
      <rect x="2" y="9.5" width="8.5" height="8.5" rx="2.5" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 bg-background">
      <GutterRails />

      <div className="relative mx-auto grid h-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center border-hairline px-6 sm:border-x lg:px-8 dark:border-white/10">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 text-base font-medium tracking-tight"
        >
          <KryonMark />
          Kryon
        </Link>

        <nav className="hidden items-center gap-8 justify-self-center md:flex">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-sm font-normal text-ink-soft transition-colors hover:text-foreground dark:text-ash"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-link-sm font-normal text-ink-soft transition-colors hover:text-foreground dark:text-ash"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <ThemeToggle variant="ghost" />

          <StartButton className="rounded-xl px-5" size={"sm"}>
            Get Started
          </StartButton>
        </div>
      </div>
    </header>
  );
}
