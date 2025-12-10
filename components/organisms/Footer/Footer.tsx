import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";

const FOOTER_LINKS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Browse",
    links: [
      { label: "Trending", href: "/browse/trending" },
      { label: "New Releases", href: "/browse/new-releases" },
      { label: "Action", href: "/browse/action" },
      { label: "Documentaries", href: "/browse/documentary" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
      { label: "Contact", href: "/" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "/" },
      { label: "Devices", href: "/" },
      { label: "Accessibility", href: "/" },
      { label: "Terms & Privacy", href: "/" },
    ],
  },
];

/** Global site footer. Purely presentational (server component). */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5 bg-night/60 px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent font-black text-white">
              S
            </span>
            <span className="text-lg font-extrabold tracking-tight text-ink">
              Stream<span className="text-brand-soft">TV</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-subtle">
            A portfolio-grade OTT streaming experience — built with Next.js, Redux Toolkit, and
            Smart-TV navigation.
          </p>
        </div>

        {FOOTER_LINKS.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">
              {column.heading}
            </h3>
            <ul className="mt-4 space-y-2">
              {column.links.map((link, i) => (
                <li key={`${link.label}-${i}`}>
                  <Link
                    href={link.href}
                    className="focus-ring rounded text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-ink-subtle sm:flex-row">
        <p>© {new Date().getFullYear()} StreamTV. Demo project — not a real service.</p>
        <p className="inline-flex items-center gap-1">
          Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-ink">?tv=1</kbd> for
          D-pad mode
          <Icon name="tv" size={14} />
        </p>
      </div>
    </footer>
  );
}
