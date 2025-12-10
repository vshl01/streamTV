"use client";

/**
 * Global top navigation: brand wordmark, primary nav, search, TV-mode toggle,
 * and the (mocked) profile chip. Reads profile + TV mode from Redux. Goes from
 * transparent over the hero to a blurred surface once the page is scrolled.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/atoms/Icon";
import { NavItem } from "@/components/molecules/NavItem";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectProfile } from "@/store/slices/userSlice";
import { selectTvMode, setTvMode } from "@/store/slices/uiSlice";

const NAV_LINKS = [
  { id: "home", href: "/", label: "Home" },
  { id: "trending", href: "/browse/trending", label: "Trending" },
  { id: "new", href: "/browse/new-releases", label: "New Releases" },
  { id: "action", href: "/browse/action", label: "Action" },
  { id: "documentary", href: "/browse/documentary", label: "Documentaries" },
] as const;

export function Header() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const tvMode = useAppSelector(selectTvMode);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/5 bg-canvas/85 backdrop-blur-xl"
          : "bg-gradient-to-b from-canvas/80 to-transparent",
      )}
    >
      <div className="flex h-[var(--header-height)] items-center gap-4 px-4 sm:px-8 lg:px-12">
        {/* Brand */}
        <Link href="/" className="focus-ring flex items-center gap-2 rounded-lg" aria-label="StreamTV home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent font-black text-white">
            S
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-ink sm:inline">
            Stream<span className="text-brand-soft">TV</span>
          </span>
        </Link>

        {/* Primary nav */}
        <nav aria-label="Primary" className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.id} id={link.id} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="focus-ring grid h-10 w-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-white/10 hover:text-ink"
          >
            <Icon name="search" size={20} />
          </Link>

          <button
            type="button"
            aria-pressed={tvMode}
            aria-label={tvMode ? "Disable TV mode" : "Enable TV mode"}
            title="Toggle Smart-TV (D-pad) mode"
            onClick={() => dispatch(setTvMode(!tvMode))}
            className={cn(
              "focus-ring grid h-10 w-10 place-items-center rounded-full transition-colors",
              tvMode ? "bg-brand text-white" : "text-ink-muted hover:bg-white/10 hover:text-ink",
            )}
          >
            <Icon name="tv" size={20} />
          </button>

          <button
            type="button"
            aria-label={`${profile.name}'s profile`}
            className="focus-ring grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: profile.avatarColor }}
          >
            {profile.initials}
          </button>
        </div>
      </div>
    </header>
  );
}
