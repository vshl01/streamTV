/** Continue Watching slice — persisted to localStorage by middleware. */
import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import type { ContinueWatchingItem } from "@/types/user";
import { toPercent } from "@/lib/utils/format";

export interface ContinueWatchingState {
  items: ContinueWatchingItem[];
}

/** Max entries kept in the row. */
export const MAX_ITEMS = 12;
/** Below this %, an item is "barely started" and not yet worth resuming. */
const MIN_PROGRESS_PERCENT = 2;
/** At/above this %, an item is treated as finished and dropped. */
const COMPLETE_PERCENT = 95;

const initialState: ContinueWatchingState = { items: [] };

const continueWatchingSlice = createSlice({
  name: "continueWatching",
  initialState,
  reducers: {
    /** Insert or update progress for a title (most-recent first). */
    upsertProgress(
      state,
      action: PayloadAction<{
        slug: string;
        positionSeconds: number;
        durationSeconds: number;
        updatedAt?: number;
      }>,
    ) {
      const { slug, positionSeconds, durationSeconds } = action.payload;
      const updatedAt = action.payload.updatedAt ?? Date.now();
      const percent = toPercent(positionSeconds, durationSeconds);

      // Drop finished titles entirely.
      state.items = state.items.filter((item) => item.slug !== slug);
      if (percent < COMPLETE_PERCENT) {
        state.items.unshift({ slug, positionSeconds, durationSeconds, updatedAt });
      }
      if (state.items.length > MAX_ITEMS) state.items.length = MAX_ITEMS;
    },
    /** Remove a single title from the row. */
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.slug !== action.payload);
    },
    clearContinueWatching(state) {
      state.items = [];
    },
  },
});

export const { upsertProgress, removeItem, clearContinueWatching } =
  continueWatchingSlice.actions;
export default continueWatchingSlice.reducer;

/* Selectors */
import type { RootState } from "@/store";

const selectItems = (state: RootState): ContinueWatchingItem[] =>
  state.continueWatching.items;

/** Resumable items, newest first, excluding barely-started ones. */
export const selectContinueWatching = createSelector([selectItems], (items) =>
  [...items]
    .filter((item) => toPercent(item.positionSeconds, item.durationSeconds) >= MIN_PROGRESS_PERCENT)
    .sort((a, b) => b.updatedAt - a.updatedAt),
);

/** Resume position (seconds) for a given slug, or 0 if none. */
export const selectResumePosition = (slug: string) => (state: RootState): number =>
  state.continueWatching.items.find((item) => item.slug === slug)?.positionSeconds ?? 0;
