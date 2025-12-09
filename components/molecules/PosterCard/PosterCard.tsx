"use client";

/**
 * Portrait content card: poster + maturity badge + hover/focus detail overlay,
 * with an optional Continue-Watching progress bar. Spatially focusable (Enter
 * or click opens the title) and accessible as a button.
 */
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { FocusableDiv } from "@/components/atoms/FocusableDiv";
import { Image } from "@/components/atoms/Image";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { RatingPill } from "@/components/molecules/RatingPill";
import { ProgressBar } from "@/components/molecules/ProgressBar";
import { formatRuntime } from "@/lib/utils/format";
import { FOCUS_KEYS } from "@/lib/spatial/navigationConfig";
import type { Title } from "@/types/content";

export interface PosterCardProps {
  title: Title;
  /** Owning row slug — namespaces the focus key. */
  rowSlug: string;
  /** Resume progress 0–100 (Continue Watching). */
  progress?: number;
  /** Prioritize image load (first row, above the fold). */
  priority?: boolean;
  /** Fill the parent width (grid cells) instead of a fixed carousel width. */
  fullWidth?: boolean;
}

export function PosterCard({
  title,
  rowSlug,
  progress,
  priority = false,
  fullWidth = false,
}: PosterCardProps) {
  const router = useRouter();
  const isNew = title.categories.includes("new-releases");

  return (
    <FocusableDiv
      focusKey={FOCUS_KEYS.CARD(rowSlug, title.slug)}
      ariaLabel={`${title.name}, ${title.year}, rated ${title.maturity}. Open details.`}
      onSelect={() => router.push(`/title/${title.slug}`)}
      scrollIntoViewOnFocus
      className={cn(
        "group relative",
        fullWidth ? "w-full" : "w-36 shrink-0 sm:w-44 lg:w-48",
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-card bg-surface ring-1 ring-white/5 transition duration-300 ease-[var(--ease-out-cine)] group-hover:ring-white/20">
        <Image
          src={title.posterUrl}
          alt={`${title.name} poster`}
          priority={priority}
          sizes="(max-width: 640px) 9rem, (max-width: 1024px) 11rem, 12rem"
          className="h-full w-full"
        />

        {/* Top badges */}
        <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between">
          <Badge tone="outline">{title.maturity}</Badge>
          {isNew && <Badge tone="brand">New</Badge>}
        </div>

        {/* Detail overlay on hover / focus */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-[focused=true]:opacity-100">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <RatingPill rating={title.rating} size="sm" />
            <span aria-hidden="true">·</span>
            <span>{title.year}</span>
            <span aria-hidden="true">·</span>
            <span>{formatRuntime(title.runtimeMinutes)}</span>
          </div>
          <p className="mt-1 line-clamp-1 text-sm font-semibold text-ink">{title.name}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-soft">
            <Icon name="play" size={12} /> Play now
          </span>
        </div>

        {/* Continue-watching progress */}
        {typeof progress === "number" && (
          <div className="absolute inset-x-2 bottom-2">
            <ProgressBar value={progress} label={`${title.name} watch progress`} />
          </div>
        )}
      </div>

      {/* Always-visible caption (below the poster) */}
      <p
        className={cn(
          "mt-2 line-clamp-1 text-sm font-medium text-ink-muted transition-colors",
          "group-hover:text-ink group-data-[focused=true]:text-ink",
        )}
      >
        {title.name}
      </p>
    </FocusableDiv>
  );
}
