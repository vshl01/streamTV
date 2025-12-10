"use client";

/**
 * Video.js player organism.
 *
 * Owns playback: dynamically loads the Video.js factory (kept out of the
 * initial bundle), mirrors playback into local state for the controls, syncs
 * the high-level state into Redux, and persists Continue-Watching progress
 * every 10 seconds and on unmount. Supports keyboard shortcuts: Space, ←/→
 * (seek), ↑/↓ (volume), F (fullscreen), M (mute).
 */
import "video.js/dist/video-js.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { Icon } from "@/components/atoms/Icon";
import { PlayerControls } from "@/components/molecules/PlayerControls";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAppDispatch, useAppStore } from "@/store/hooks";
import {
  loadTitle,
  resetPlayer,
  setFullscreen,
  setProgress,
  setQuality as setQualityAction,
  setStatus,
  setVolume as setVolumeAction,
} from "@/store/slices/playerSlice";
import { upsertProgress } from "@/store/slices/continueWatchingSlice";
import { selectResumePosition } from "@/store/slices/continueWatchingSlice";
import { resolveStreamUrl } from "@/lib/player/hlsStreams";
import type { PlayerHandle, Quality } from "@/types/player";
import type { Title } from "@/types/content";

const QUALITIES: Quality[] = ["auto", "1080p", "720p", "480p"];
const PERSIST_INTERVAL_SECONDS = 10;
const SEEK_STEP = 10;
const VOLUME_STEP = 0.1;
const CONTROLS_HIDE_MS = 3200;

interface LocalState {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  quality: Quality;
  fullscreen: boolean;
  ready: boolean;
}

export interface VideoPlayerProps {
  title: Title;
}

export function VideoPlayer({ title }: VideoPlayerProps) {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleRef = useRef<PlayerHandle | null>(null);
  const lastPersistRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);
  // Latest playback position/duration — read by the unmount persist (the
  // create-player effect intentionally only depends on the title slug).
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);

  const [state, setState] = useState<LocalState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    quality: "auto",
    fullscreen: false,
    ready: false,
  });
  const [showControls, setShowControls] = useState(true);

  const patch = useCallback((next: Partial<LocalState>) => {
    setState((prev) => ({ ...prev, ...next }));
  }, []);

  /** Write progress to the Continue Watching slice (persisted by middleware). */
  const persistProgress = useCallback(
    (currentTime: number, duration: number) => {
      if (duration > 0) {
        dispatch(
          upsertProgress({ slug: title.slug, positionSeconds: currentTime, durationSeconds: duration }),
        );
      }
    },
    [dispatch, title.slug],
  );

  // Create the player once per title.
  useEffect(() => {
    let disposed = false;
    const element = videoRef.current;
    if (!element) return;

    dispatch(loadTitle(title.slug));
    const resumeAt = selectResumePosition(title.slug)(store.getState());
    const preferredQuality = store.getState().user.preferences.preferredQuality;

    import("@/lib/player/videojs").then(({ createPlayer }) => {
      if (disposed || !videoRef.current) return;
      const { player, handle } = createPlayer({
        element: videoRef.current,
        src: resolveStreamUrl(title.streamUrl),
        autoplay: true,
        events: {
          onReady: () => {
            patch({ ready: true });
            dispatch(setStatus("paused"));
            if (resumeAt > 5) handle.seek(resumeAt);
            if (preferredQuality !== "auto") {
              handle.setQuality(preferredQuality);
              patch({ quality: preferredQuality });
              dispatch(setQualityAction(preferredQuality));
            }
          },
          onPlay: () => {
            patch({ playing: true });
            dispatch(setStatus("playing"));
          },
          onPause: () => {
            patch({ playing: false });
            dispatch(setStatus("paused"));
          },
          onTimeUpdate: (currentTime, duration) => {
            currentTimeRef.current = currentTime;
            durationRef.current = duration;
            patch({ currentTime, duration });
            dispatch(setProgress({ currentTime, duration }));
            if (currentTime - lastPersistRef.current >= PERSIST_INTERVAL_SECONDS) {
              lastPersistRef.current = currentTime;
              persistProgress(currentTime, duration);
            }
          },
          onEnded: () => {
            patch({ playing: false });
            dispatch(setStatus("ended"));
            persistProgress(0, 0); // reset; slice treats <2% as not-resumable
          },
          onError: (message) => {
            dispatch(setStatus("error"));
            console.error("[player]", message);
          },
        },
      });

      handleRef.current = handle;
      player.on("fullscreenchange", () => {
        const isFs = player.isFullscreen() ?? false;
        patch({ fullscreen: isFs });
        dispatch(setFullscreen(isFs));
      });
      player.on("volumechange", () => {
        patch({ volume: player.volume() ?? 1, muted: player.muted() ?? false });
      });
    });

    return () => {
      disposed = true;
      if (durationRef.current > 0) {
        persistProgress(currentTimeRef.current, durationRef.current);
      }
      handleRef.current?.dispose();
      handleRef.current = null;
      dispatch(resetPlayer());
    };
    // Recreate only when the title changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title.slug]);

  /* ----- Control handlers ----- */
  const onPlayPause = useCallback(() => {
    const handle = handleRef.current;
    if (!handle) return;
    if (state.playing) handle.pause();
    else handle.play();
  }, [state.playing]);

  const onSeek = useCallback((seconds: number) => {
    handleRef.current?.seek(seconds);
    setState((prev) => ({ ...prev, currentTime: seconds }));
  }, []);

  const onVolume = useCallback(
    (volume: number) => {
      handleRef.current?.setVolume(volume);
      patch({ volume, muted: volume === 0 });
      dispatch(setVolumeAction(volume));
    },
    [dispatch, patch],
  );

  const onToggleMute = useCallback(() => {
    handleRef.current?.toggleMute();
    patch({ muted: !state.muted });
  }, [patch, state.muted]);

  const onSelectQuality = useCallback(
    (quality: Quality) => {
      handleRef.current?.setQuality(quality);
      patch({ quality });
      dispatch(setQualityAction(quality));
    },
    [dispatch, patch],
  );

  const onToggleFullscreen = useCallback(() => {
    handleRef.current?.requestFullscreen();
  }, []);

  /* ----- Keyboard shortcuts ----- */
  useKeyboardShortcuts({
    " ": (event) => {
      event.preventDefault();
      onPlayPause();
    },
    ArrowRight: () => onSeek(Math.min(state.currentTime + SEEK_STEP, state.duration)),
    ArrowLeft: () => onSeek(Math.max(state.currentTime - SEEK_STEP, 0)),
    ArrowUp: (event) => {
      event.preventDefault();
      onVolume(Math.min(state.volume + VOLUME_STEP, 1));
    },
    ArrowDown: (event) => {
      event.preventDefault();
      onVolume(Math.max(state.volume - VOLUME_STEP, 0));
    },
    f: onToggleFullscreen,
    m: onToggleMute,
  });

  /* ----- Auto-hide controls ----- */
  const bumpControls = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setShowControls(false), CONTROLS_HIDE_MS);
  }, []);

  // While playing, arm the auto-hide timer; paused keeps controls visible via
  // the `visible` prop below. setState only runs inside the timer callback.
  useEffect(() => {
    if (!state.playing) return;
    const timer = window.setTimeout(() => setShowControls(false), CONTROLS_HIDE_MS);
    return () => window.clearTimeout(timer);
  }, [state.playing]);

  return (
    <div
      className="group/player relative aspect-video w-full overflow-hidden rounded-xl bg-black"
      onMouseMove={bumpControls}
      onClick={bumpControls}
    >
      <div data-vjs-player className="h-full w-full">
        <video
          ref={videoRef}
          className="video-js vjs-fluid h-full w-full"
          playsInline
          aria-label={`Video player: ${title.name}`}
        />
      </div>

      {/* Loading state */}
      {!state.ready && (
        <div className="absolute inset-0 grid place-items-center bg-black">
          <Spinner size={44} className="text-brand-soft" label={`Loading ${title.name}`} />
        </div>
      )}

      {/* Center play affordance when paused */}
      {state.ready && !state.playing && (
        <button
          type="button"
          aria-label="Play"
          onClick={onPlayPause}
          className="focus-ring absolute inset-0 z-10 grid place-items-center"
        >
          <span className="grid h-20 w-20 place-items-center rounded-full bg-black/50 text-ink backdrop-blur transition group-hover/player:scale-110">
            <Icon name="play" size={36} />
          </span>
        </button>
      )}

      {state.ready && (
        <PlayerControls
          playing={state.playing}
          currentTime={state.currentTime}
          duration={state.duration}
          volume={state.volume}
          muted={state.muted}
          quality={state.quality}
          qualities={QUALITIES}
          fullscreen={state.fullscreen}
          visible={showControls || !state.playing}
          onPlayPause={onPlayPause}
          onSeek={onSeek}
          onVolume={onVolume}
          onToggleMute={onToggleMute}
          onSelectQuality={onSelectQuality}
          onToggleFullscreen={onToggleFullscreen}
        />
      )}
    </div>
  );
}
