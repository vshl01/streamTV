"use client";

/**
 * Featured-title showcase at the top of the home page.
 *
 * Auto-rotates through featured titles (pausing on hover/focus) with a true
 * cross-fade between backdrops, a slow Ken Burns zoom on the active slide,
 * staggered fade/rise of the copy, and a fill-style progress indicator that
 * tracks the rotation timer. Play / More Info CTAs stay mounted (stable
 * spatial-navigation focus) while the copy re-animates per slide.
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

const ROTATE_MS = 6000;

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
      {/* Stacked backdrops — cross-fade between slides, Ken Burns on the active one */}
      {titles.map((title, i) => (
        <div
          key={title.slug}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out-cine)]",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={title.backdropUrl}
            alt={`${title.name} backdrop`}
            priority={i === 0}
            sizes="100vw"
            className="hero-kenburns absolute inset-0 h-full w-full"
          />
        </div>
      ))}

      {/* Legibility gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-canvas/40" />

      {/* Content */}
      <div className="relative flex h-full max-w-2xl flex-col justify-end gap-4 px-4 pb-24 sm:px-8 sm:pb-28 lg:px-12 lg:pb-36">
        {/* Copy re-animates on each slide (keyed); contains no focusable nodes */}
        <div key={active.slug} className="flex flex-col gap-4">
          <Badge tone="brand" className="hero-rise w-fit">
            {active.kind === "series" ? "Series" : "Film"} · Featured
          </Badge>

          <h1
            className="hero-rise text-4xl font-extrabold tracking-tight text-ink drop-shadow-lg sm:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            {active.name}
          </h1>

          <div
            className="hero-rise flex flex-wrap items-center gap-3 text-sm text-ink-muted"
            style={{ animationDelay: "160ms" }}
          >
            <RatingPill rating={active.rating} />
            <span>{active.year}</span>
            <Badge tone="outline">{active.maturity}</Badge>
            <span>{formatRuntime(active.runtimeMinutes)}</span>
            <span className="hidden sm:inline">{active.genres.join(" · ")}</span>
          </div>

          <p
            className="hero-rise max-w-xl text-base text-ink-muted line-clamp-3 sm:text-lg"
            style={{ animationDelay: "240ms" }}
          >
            {active.synopsis}
          </p>
        </div>

        {/* CTAs stay mounted so spatial-nav focus is stable across slides */}
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

      {/* Rotation indicators — active segment fills over the rotation timer */}
      {count > 1 && (
        <div className="absolute bottom-6 right-4 hidden items-center gap-2 sm:right-8 sm:flex lg:right-12">
          {titles.map((title, i) => (
            <button
              key={title.slug}
              type="button"
              aria-label={`Show ${title.name}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "focus-ring relative h-1.5 overflow-hidden rounded-full bg-white/30 transition-all",
                i === index ? "w-8" : "w-3 hover:bg-white/60",
              )}
            >
              {i === index && (
                <span
                  key={index}
                  className={cn("hero-progress absolute inset-0 rounded-full bg-ink")}
                  style={{
                    animationDuration: `${ROTATE_MS}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
