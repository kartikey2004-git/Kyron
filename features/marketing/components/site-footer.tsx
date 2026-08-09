import Link from "next/link";
import { GutterRails } from "./gutter-rails";
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

export function SiteFooter() {
  return (
    <footer className="relative bg-footer-surface text-on-footer">
      <GutterRails />

      <div className="relative mx-auto max-w-4xl border-t border-hairline px-6 py-14 sm:border-x lg:px-8 dark:border-white/10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex w-fit items-center gap-2 text-[15px] font-medium tracking-tight"
            >
              <KryonMark />
              Kryon
            </Link>

            <p className="mt-3 max-w-xs text-[13px] leading-[1.6] text-on-footer/50">
              AI pull request reviews grounded in your own codebase, not just
              the diff.
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="text-[11px] tracking-[0.2px] uppercase text-on-footer/40">
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
                        className="text-[13px] text-on-footer/70 transition-colors hover:text-on-footer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[13px] text-on-footer/70 transition-colors hover:text-on-footer"
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

        <div className="mt-12 flex flex-col-reverse items-center gap-5 border-t border-hairline pt-6 sm:flex-row sm:justify-between dark:border-white/10">
          <p className="text-[12px] text-on-footer/40">
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
                  className="text-on-footer/50 transition-colors hover:text-on-footer"
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
