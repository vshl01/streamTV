/** Player domain types. */

/** Selectable rendition quality. `auto` lets the ABR engine decide. */
export type Quality = "auto" | "1080p" | "720p" | "480p";

/** High-level playback status for the current session. */
export type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

/** Serializable playback state tracked in Redux (no DOM references). */
export interface PlaybackState {
  /** Slug of the title currently loaded into the player, if any. */
  activeSlug: string | null;
  status: PlaybackStatus;
  /** Current playhead position in seconds. */
  currentTime: number;
  /** Total media duration in seconds (0 until known). */
  duration: number;
  /** 0–1. */
  volume: number;
  muted: boolean;
  quality: Quality;
  fullscreen: boolean;
}

/** Minimal event surface a player wrapper exposes to React. */
export interface PlayerEvents {
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onError?: (message: string) => void;
}

/**
 * Engine-agnostic player handle. Today it wraps Video.js; the same contract
 * lets us swap in Shaka or hls.js later without touching components.
 */
export interface PlayerHandle {
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setQuality: (quality: Quality) => void;
  requestFullscreen: () => void;
  dispose: () => void;
}
