"use client";

import Link from "next/link";
import { footerNav, socialLinks } from "./data";

function KryonMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="size-4 shrink-0 fill-current"
    >
      <rect x="7.5" y="2" width="10.5" height="10.5" rx="3" />
      <rect x="2" y="9.5" width="8.5" height="8.5" rx="2.5" />
    </svg>
  );
}

function scrollToSection(href: string) {
  const hash = href.startsWith("/#") ? href.slice(2) : null;
  if (!hash) return false;
  const el = document.getElementById(hash);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth" });
  return true;
}

export function SiteFooter() {
  return (
    <footer className="relative bg-zinc-950 text-zinc-100">
      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex w-fit items-center gap-2 text-[15px] font-medium tracking-tight"
            >
              <KryonMark />
              Kryon
            </Link>

            <p className="mt-3 max-w-xs text-[13px] leading-[1.6] text-zinc-400">
              AI pull request reviews grounded in your own codebase, not just
              the diff.
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="text-[11px] tracking-[0.2px] uppercase text-zinc-500">
                {group.title}
              </p>

              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-zinc-400 transition-colors hover:text-zinc-100"
                      >
                        {link.name}
                      </a>
                    ) : link.href.startsWith("/#") ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(link.href);
                        }}
                        className="text-[13px] text-zinc-400 transition-colors hover:text-zinc-100"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[13px] text-zinc-400 transition-colors hover:text-zinc-100"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col-reverse items-center gap-5 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-between">
          <p className="text-[12px] text-zinc-600">
            © 2026 Kryon · Built by Kartikey
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-zinc-500 transition-colors hover:text-zinc-100"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
