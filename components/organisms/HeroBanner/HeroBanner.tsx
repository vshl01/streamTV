"use client";

/**
 * Featured-title showcase at the top of the home page.
 *
 * Auto-rotates through featured titles (pausing on hover/focus), with a
 * cinematic backdrop, synopsis, and spatially-focusable Play / More Info CTAs.
 */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { FocusableDiv } from "@/components/atoms/FocusableDiv";
import { Image } from "@/components/atoms/Image";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { RatingPill } from "@/components/molecules/RatingPill";
import { formatRuntime } from "@/lib/utils/format";
import { FOCUS_KEYS } from "@/lib/spatial/navigationConfig";
import type { Title } from "@/types/content";

export interface HeroBannerProps {
  titles: Title[];
}

const ROTATE_MS = 9000;

const CTA_PRIMARY =
  "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm font-bold text-canvas shadow-lg shadow-black/40 transition hover:bg-white/90";
const CTA_SECONDARY =
  "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-bold text-ink backdrop-blur transition hover:bg-white/20";

export function HeroBanner({ titles }: HeroBannerProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = titles.length;

  const advance = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(advance, ROTATE_MS);
    return () => clearInterval(timer);
  }, [advance, paused, count]);

  if (count === 0) return null;
  const active = titles[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured titles"
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Backdrop (fades on rotation via the Image atom) */}
      <Image
        key={active.slug}
        src={active.backdropUrl}
        alt={`${active.name} backdrop`}
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full"
      />

      {/* Legibility gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-canvas/40" />

      {/* Content */}
      <div className="relative flex h-full max-w-2xl flex-col justify-end gap-4 px-4 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <Badge tone="brand" className="w-fit">
          {active.kind === "series" ? "Series" : "Film"} · Featured
        </Badge>

        <h1 className="text-4xl font-extrabold tracking-tight text-ink drop-shadow-lg sm:text-6xl">
          {active.name}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          <RatingPill rating={active.rating} />
          <span>{active.year}</span>
          <Badge tone="outline">{active.maturity}</Badge>
          <span>{formatRuntime(active.runtimeMinutes)}</span>
          <span className="hidden sm:inline">{active.genres.join(" · ")}</span>
        </div>

        <p className="max-w-xl text-base text-ink-muted line-clamp-3 sm:text-lg">
          {active.synopsis}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <FocusableDiv
            focusKey={FOCUS_KEYS.HERO_PLAY}
            ariaLabel={`Play ${active.name}`}
            onSelect={() => router.push(`/watch/${active.slug}`)}
            className={CTA_PRIMARY}
          >
            <Icon name="play" size={20} />
            Play
          </FocusableDiv>

          <FocusableDiv
            focusKey="hero-info"
            ariaLabel={`More information about ${active.name}`}
            onSelect={() => router.push(`/title/${active.slug}`)}
            className={CTA_SECONDARY}
          >
            <Icon name="info" size={18} />
            More Info
          </FocusableDiv>
        </div>
      </div>

      {/* Rotation indicators */}
      {count > 1 && (
        <div className="absolute bottom-6 right-4 flex items-center gap-2 sm:right-8 lg:right-12">
          {titles.map((title, i) => (
            <button
              key={title.slug}
              type="button"
              aria-label={`Show ${title.name}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "focus-ring h-1.5 rounded-full transition-all",
                i === index ? "w-7 bg-ink" : "w-3 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
