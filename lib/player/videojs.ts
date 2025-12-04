/**
 * Video.js player factory. Client-side only — import dynamically.
 *
 * Wraps Video.js (with its bundled VHS engine for HLS, plus hls.js available
 * as a documented fallback path) behind the engine-agnostic `PlayerHandle`
 * contract from `types/player`, so the player can be swapped for Shaka later
 * without changing any component.
 */
import videojs from "video.js";
import type { PlayerEvents, PlayerHandle, Quality } from "@/types/player";
import { HLS_MIME, resolveStreamUrl } from "./hlsStreams";

/** The Video.js player instance type (kept loose to avoid deep type imports). */
type VjsPlayer = ReturnType<typeof videojs>;

/** A single VHS rendition we can toggle for manual quality control. */
interface VhsRepresentation {
  height?: number;
  enabled: (value?: boolean) => boolean;
}

interface VhsTech {
  vhs?: { representations?: () => VhsRepresentation[] };
}

/** Map a target quality label to a maximum rendition height. */
const QUALITY_MAX_HEIGHT: Record<Exclude<Quality, "auto">, number> = {
  "1080p": 1080,
  "720p": 720,
  "480p": 480,
};

export interface CreatePlayerArgs {
  /** The mounted `<video>` element Video.js takes over. */
  element: HTMLVideoElement;
  /** HLS manifest URL. */
  src: string;
  autoplay?: boolean;
  events?: PlayerEvents;
}

export interface CreatePlayerResult {
  player: VjsPlayer;
  handle: PlayerHandle;
}

/**
 * Instantiate a Video.js player on `element`, wire lifecycle events, and
 * return both the raw player and a normalized `PlayerHandle`.
 */
export function createPlayer({
  element,
  src,
  autoplay = false,
  events = {},
}: CreatePlayerArgs): CreatePlayerResult {
  const player = videojs(element, {
    controls: false,
    autoplay,
    preload: "auto",
    fluid: true,
    responsive: true,
    playsinline: true,
    sources: [{ src: resolveStreamUrl(src), type: HLS_MIME }],
    html5: { vhs: { overrideNative: true } },
  });

  player.ready(() => events.onReady?.());
  player.on("play", () => events.onPlay?.());
  player.on("pause", () => events.onPause?.());
  player.on("ended", () => events.onEnded?.());
  player.on("timeupdate", () =>
    events.onTimeUpdate?.(player.currentTime() ?? 0, player.duration() ?? 0),
  );
  player.on("error", () => {
    const message = player.error()?.message ?? "Playback error";
    events.onError?.(message);
  });

  /** Access the VHS tech (best-effort; types don't expose it). */
  const vhs = (): VhsTech => player.tech(true) as unknown as VhsTech;

  const handle: PlayerHandle = {
    play: () => void player.play(),
    pause: () => player.pause(),
    seek: (seconds) => player.currentTime(seconds),
    setVolume: (volume) => player.volume(Math.min(1, Math.max(0, volume))),
    toggleMute: () => player.muted(!player.muted()),
    setQuality: (quality) => {
      const reps = vhs().vhs?.representations?.();
      if (!reps?.length) return;
      if (quality === "auto") {
        reps.forEach((rep) => rep.enabled(true));
        return;
      }
      const max = QUALITY_MAX_HEIGHT[quality];
      reps.forEach((rep) => rep.enabled((rep.height ?? 0) <= max));
    },
    requestFullscreen: () => {
      if (player.isFullscreen()) player.exitFullscreen();
      else player.requestFullscreen();
    },
    dispose: () => {
      if (!player.isDisposed()) player.dispose();
    },
  };

  return { player, handle };
}
