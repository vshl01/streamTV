/** User domain types. Auth is mocked — a single hardcoded profile. */

import type { Quality } from "./player";

/** A viewing profile (Netflix-style). Auth is out of scope, so this is mocked. */
export interface Profile {
  id: string;
  name: string;
  avatarColor: string;
  /** Two-letter initials for the avatar chip. */
  initials: string;
}

/** Persisted user preferences. */
export interface Preferences {
  /** Preferred default playback quality. */
  preferredQuality: Quality;
  /** Autoplay the next episode / related title. */
  autoplay: boolean;
  /** Render captions by default. */
  captions: boolean;
}

/** A single Continue Watching entry, persisted to localStorage. */
export interface ContinueWatchingItem {
  slug: string;
  /** Playhead position in seconds. */
  positionSeconds: number;
  /** Total duration in seconds. */
  durationSeconds: number;
  /** Epoch ms of the last update — drives recency ordering. */
  updatedAt: number;
}
