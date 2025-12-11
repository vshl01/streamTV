/**
 * Watch page layout: a back affordance, the video player, and the title's
 * metadata beneath it. No data fetching.
 */
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { Badge } from "@/components/atoms/Badge";
import { RatingPill } from "@/components/molecules/RatingPill";
import { VideoPlayer } from "@/components/organisms/VideoPlayer";
import { formatRuntime } from "@/lib/utils/format";
import type { Title } from "@/types/content";

export interface PlayerTemplateProps {
  title: Title;
}

export function PlayerTemplate({ title }: PlayerTemplateProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-height)+1rem)] sm:px-8">
      <Link
        href={`/title/${title.slug}`}
        className="focus-ring mb-4 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
      >
        <Icon name="back" size={18} />
        Back to details
      </Link>

      <VideoPlayer title={title} />

      <div className="mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          <RatingPill rating={title.rating} />
          <span>{title.year}</span>
          <Badge tone="outline">{title.maturity}</Badge>
          <span>{formatRuntime(title.runtimeMinutes)}</span>
          <span className="hidden sm:inline">{title.genres.join(" · ")}</span>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/90">{title.synopsis}</p>
      </div>
    </div>
  );
}
