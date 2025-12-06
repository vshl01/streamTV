/** Search slice — the live query string and recent searches. */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
  query: string;
  recent: string[];
}

const MAX_RECENT = 6;

const initialState: SearchState = { query: "", recent: [] };

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    /** Commit a query to the recent list (deduped, capped, newest first). */
    addRecent(state, action: PayloadAction<string>) {
      const term = action.payload.trim();
      if (!term) return;
      state.recent = [term, ...state.recent.filter((t) => t !== term)].slice(0, MAX_RECENT);
    },
    clearRecent(state) {
      state.recent = [];
    },
  },
});

export const { setQuery, addRecent, clearRecent } = searchSlice.actions;
export default searchSlice.reducer;

/* Selectors */
import type { RootState } from "@/store";
export const selectQuery = (state: RootState): string => state.search.query;
export const selectRecent = (state: RootState): string[] => state.search.recent;
