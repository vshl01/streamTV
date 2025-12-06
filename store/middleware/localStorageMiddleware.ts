/**
 * Persistence middleware.
 *
 * After any `user/*` or `continueWatching/*` action, snapshots those two
 * slices to localStorage. All other slices stay session-only. The matching
 * `loadPersistedState` rehydrates them when the client store is created.
 */
import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { UserState } from "@/store/slices/userSlice";
import type { ContinueWatchingState } from "@/store/slices/continueWatchingSlice";

const STORAGE_KEYS = {
  user: "streamtv:user",
  continueWatching: "streamtv:continueWatching",
} as const;

/** The subset of state we persist between sessions. */
export interface PersistedState {
  user?: UserState;
  continueWatching?: ContinueWatchingState;
}

/** Read persisted slices from localStorage (client-only; safe on the server). */
export function loadPersistedState(): PersistedState | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const state: PersistedState = {};
    const user = window.localStorage.getItem(STORAGE_KEYS.user);
    const cw = window.localStorage.getItem(STORAGE_KEYS.continueWatching);
    if (user) state.user = JSON.parse(user) as UserState;
    if (cw) state.continueWatching = JSON.parse(cw) as ContinueWatchingState;
    return Object.keys(state).length > 0 ? state : undefined;
  } catch {
    return undefined;
  }
}

/** Middleware that writes persisted slices after relevant actions. */
export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    if (typeof window === "undefined") return result;

    const type = (action as { type?: string }).type ?? "";
    if (type.startsWith("user/") || type.startsWith("continueWatching/")) {
      try {
        const state = store.getState() as RootState;
        window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user));
        window.localStorage.setItem(
          STORAGE_KEYS.continueWatching,
          JSON.stringify(state.continueWatching),
        );
      } catch {
        /* storage full / disabled — non-fatal */
      }
    }
    return result;
  };
