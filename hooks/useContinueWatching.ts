"use client";

/**
 * Ergonomic facade over the Continue Watching slice.
 *
 * Exposes the resumable list plus helpers to record progress, look up a resume
 * position, and remove an item — so components don't dispatch raw actions.
 */
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeItem,
  selectContinueWatching,
  upsertProgress,
} from "@/store/slices/continueWatchingSlice";
import type { ContinueWatchingItem } from "@/types/user";

export interface UseContinueWatching {
  items: ContinueWatchingItem[];
  record: (slug: string, positionSeconds: number, durationSeconds: number) => void;
  resume: (slug: string) => number;
  remove: (slug: string) => void;
}

export function useContinueWatching(): UseContinueWatching {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectContinueWatching);

  const record = useCallback(
    (slug: string, positionSeconds: number, durationSeconds: number) => {
      dispatch(upsertProgress({ slug, positionSeconds, durationSeconds }));
    },
    [dispatch],
  );

  const remove = useCallback((slug: string) => dispatch(removeItem(slug)), [dispatch]);

  const resume = useCallback(
    (slug: string) => items.find((item) => item.slug === slug)?.positionSeconds ?? 0,
    [items],
  );

  return { items, record, resume, remove };
}
