"use client";

/**
 * Title detail panel: metadata, synopsis, cast/crew, and the primary
 * Play/Resume CTA. Reads resume progress from Redux to switch the CTA between
 * "Play" and "Resume" (mounted-gated to avoid a hydration mismatch).
 */
import { useRouter } from "next/navigation";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { RatingPill } from "@/components/molecules/RatingPill";
import { ProgressBar } from "@/components/molecules/ProgressBar";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useHydrated } from "@/hooks/useHydrated";
import { formatRuntime, toPercent } from "@/lib/utils/format";
import type { Title } from "@/types/content";

const CTA_PRIMARY =
  "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-8 text-sm font-bold text-canvas shadow-lg shadow-black/40 transition hover:bg-white/90";
const CTA_SECONDARY =
  "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-bold text-ink backdrop-blur transition hover:bg-white/20";

export interface DetailPanelProps {
  title: Title;
}

export function DetailPanel({ title }: DetailPanelProps) {
  const router = useRouter();
  const { items } = useContinueWatching();
  const hydrated = useHydrated();

  const progress = items.find((item) => item.slug === title.slug);
  const percent = progress ? toPercent(progress.positionSeconds, progress.durationSeconds) : 0;
  const resuming = hydrated && percent > 0;

  return (
    <div className="max-w-2xl">
      <Text variant="display" className="drop-shadow-lg">
        {title.name}
      </Text>
      <p className="mt-2 text-lg text-ink-muted">{title.tagline}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
        <RatingPill rating={title.rating} />
        <span>{title.year}</span>
        <Badge tone="outline">{title.maturity}</Badge>
        <span>{formatRuntime(title.runtimeMinutes)}</span>
        <Badge tone="neutral">{title.kind === "series" ? "Series" : "Film"}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {title.genres.map((genre) => (
          <Badge key={genre} tone="neutral">
            {genre}
          </Badge>
        ))}
      </div>

      {resuming && (
        <div className="mt-5 max-w-sm">
          <ProgressBar value={percent} label={`${title.name} watch progress`} />
          <p className="mt-1.5 text-xs text-ink-subtle">{Math.round(percent)}% watched</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={CTA_PRIMARY}
          onClick={() => router.push(`/watch/${title.slug}`)}
        >
          <Icon name={resuming ? "replay" : "play"} size={20} />
          {resuming ? "Resume" : "Play"}
        </button>
        {resuming && (
          <button
            type="button"
            className={CTA_SECONDARY}
            onClick={() => router.push(`/watch/${title.slug}?restart=1`)}
          >
            <Icon name="play" size={18} />
            Play from start
          </button>
        )}
      </div>

      <p className="mt-7 max-w-xl text-base leading-relaxed text-ink/90">{title.synopsis}</p>

      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-ink-subtle">Director</dt>
          <dd className="text-ink-muted">{title.director}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-ink-subtle">Cast</dt>
          <dd className="text-ink-muted">{title.cast.join(", ")}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-ink-subtle">Genres</dt>
          <dd className="text-ink-muted">{title.genres.join(", ")}</dd>
        </div>
      </dl>
    </div>
  );
}
