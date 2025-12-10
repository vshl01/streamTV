"use client";

/**
 * Horizontally-scrollable row of PosterCards.
 *
 * Acts as a spatial-navigation focus context (left/right arrows move between
 * cards, up/down between rows). Mouse users get hover scroll affordances and a
 * "see all" link to the category browse page.
 */
import { useRef } from "react";
import Link from "next/link";
import { FocusableDiv } from "@/components/atoms/FocusableDiv";
import { Icon } from "@/components/atoms/Icon";
import { PosterCard } from "@/components/molecules/PosterCard";
import { FOCUS_KEYS } from "@/lib/spatial/navigationConfig";
import type { CategorySlug, Title } from "@/types/content";

export interface ContentRowProps {
  label: string;
  /** Row identity — namespaces focus keys and links to /browse/[slug]. */
  slug: string;
  titles: Title[];
  /** Link the heading to a browse page (categories only). */
  browseSlug?: CategorySlug;
  /** Prioritize images in this row (first/above-the-fold row). */
  priority?: boolean;
  /** Optional resume-progress lookup for Continue Watching reuse. */
  getProgress?: (slug: string) => number | undefined;
}

/** How far the chevron buttons nudge the scroller. */
const SCROLL_STEP = 480;

export function ContentRow({
  label,
  slug,
  titles,
  browseSlug,
  priority = false,
  getProgress,
}: ContentRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const nudge = (direction: 1 | -1) =>
    scrollerRef.current?.scrollBy({ left: direction * SCROLL_STEP, behavior: "smooth" });

  if (titles.length === 0) return null;

  return (
    <section aria-labelledby={`row-${slug}`} className="group/row relative">
      <div className="mb-3 flex items-baseline justify-between px-4 sm:px-8 lg:px-12">
        <h2 id={`row-${slug}`} className="text-lg font-bold tracking-tight text-ink sm:text-xl">
          {label}
        </h2>
        {browseSlug && (
          <Link
            href={`/browse/${browseSlug}`}
            className="focus-ring inline-flex items-center gap-1 rounded-full text-xs font-semibold text-ink-subtle transition-colors hover:text-brand-soft"
          >
            Explore all
            <Icon name="chevron-right" size={14} />
          </Link>
        )}
      </div>

      <FocusableDiv
        focusKey={FOCUS_KEYS.ROW(slug)}
        provideContext
        saveLastFocusedChild
        className="relative"
      >
        {/* Mouse scroll affordances */}
        <button
          type="button"
          aria-label={`Scroll ${label} left`}
          onClick={() => nudge(-1)}
          className="absolute left-1 top-0 z-10 hidden h-[calc(100%-2rem)] w-10 place-items-center rounded-r-xl bg-gradient-to-r from-canvas/90 to-transparent text-ink opacity-0 transition-opacity group-hover/row:opacity-100 sm:grid"
        >
          <Icon name="chevron-left" size={28} />
        </button>

        <div
          ref={scrollerRef}
          className="no-scrollbar edge-fade-x flex snap-x items-start gap-3 overflow-x-auto scroll-px-8 px-4 py-4 sm:gap-4 sm:px-8 lg:px-12"
        >
          {titles.map((title, index) => (
            <div key={title.id} className="snap-start">
              <PosterCard
                title={title}
                rowSlug={slug}
                priority={priority && index < 6}
                progress={getProgress?.(title.slug)}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label={`Scroll ${label} right`}
          onClick={() => nudge(1)}
          className="absolute right-1 top-0 z-10 hidden h-[calc(100%-2rem)] w-10 place-items-center rounded-l-xl bg-gradient-to-l from-canvas/90 to-transparent text-ink opacity-0 transition-opacity group-hover/row:opacity-100 sm:grid"
        >
          <Icon name="chevron-right" size={28} />
        </button>
      </FocusableDiv>
    </section>
  );
}
