"use client";

/**
 * "Continue Watching" row — driven entirely by the persisted Redux slice.
 *
 * Resolves persisted slugs against the catalog lookup passed from the page,
 * and renders progress on each card. Mounts client-only (the data lives in
 * localStorage) to avoid a hydration mismatch with the server-rendered shell.
 */
import { ContentRow } from "@/components/organisms/ContentRow";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useHydrated } from "@/hooks/useHydrated";
import { toPercent } from "@/lib/utils/format";
import type { Title } from "@/types/content";

export interface ContinueWatchingRowProps {
  /** Catalog lookup so persisted slugs resolve to full titles. */
  bySlug: Record<string, Title>;
}

export function ContinueWatchingRow({ bySlug }: ContinueWatchingRowProps) {
  const { items } = useContinueWatching();
  const hydrated = useHydrated();

  if (!hydrated || items.length === 0) return null;

  const resolved = items
    .map((item) => ({ item, title: bySlug[item.slug] }))
    .filter((entry): entry is { item: (typeof items)[number]; title: Title } =>
      Boolean(entry.title),
    );

  if (resolved.length === 0) return null;

  const progressBySlug = new Map(
    resolved.map(({ item }) => [
      item.slug,
      toPercent(item.positionSeconds, item.durationSeconds),
    ]),
  );

  return (
    <ContentRow
      label="Continue Watching"
      slug="continue-watching"
      titles={resolved.map((entry) => entry.title)}
      getProgress={(slug) => progressBySlug.get(slug)}
    />
  );
}
