"use client";

/**
 * Presentational player control bar: scrubber, play/pause, volume, time,
 * quality selector, and fullscreen. All state and handlers are supplied by the
 * VideoPlayer organism — this molecule holds no playback logic.
 */
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/atoms/Icon";
import { formatClock } from "@/lib/utils/format";
import type { Quality } from "@/types/player";

export interface PlayerControlsProps {
  playing: boolean;
  currentTime: number;
  duration: number;
  /** 0–1. */
  volume: number;
  muted: boolean;
  quality: Quality;
  qualities: Quality[];
  fullscreen: boolean;
  /** Whether the bar is currently shown (auto-hide is owned by the parent). */
  visible: boolean;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
  onVolume: (volume: number) => void;
  onToggleMute: () => void;
  onSelectQuality: (quality: Quality) => void;
  onToggleFullscreen: () => void;
}

const ICON_BTN =
  "focus-ring grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-white/15";

export function PlayerControls({
  playing,
  currentTime,
  duration,
  volume,
  muted,
  quality,
  qualities,
  fullscreen,
  visible,
  onPlayPause,
  onSeek,
  onVolume,
  onToggleMute,
  onSelectQuality,
  onToggleFullscreen,
}: PlayerControlsProps) {
  const [qualityOpen, setQualityOpen] = useState(false);
  const effectiveVolume = muted ? 0 : volume;

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-16 transition-opacity duration-300 sm:px-6",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {/* Scrubber */}
      <div className="flex items-center gap-3">
        <span className="w-12 shrink-0 text-right text-xs font-medium tabular-nums text-ink-muted">
          {formatClock(currentTime)}
        </span>
        <input
          type="range"
          aria-label="Seek"
          min={0}
          max={duration || 0}
          step={1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => onSeek(Number(event.target.value))}
          className="player-range h-1.5 flex-1 cursor-pointer accent-brand"
        />
        <span className="w-12 shrink-0 text-xs font-medium tabular-nums text-ink-muted">
          {formatClock(duration)}
        </span>
      </div>

      {/* Buttons */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={onPlayPause}
            className={ICON_BTN}
          >
            <Icon name={playing ? "pause" : "play"} size={22} />
          </button>

          <div className="group/vol flex items-center gap-1">
            <button
              type="button"
              aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
              onClick={onToggleMute}
              className={ICON_BTN}
            >
              <Icon name={muted || volume === 0 ? "volume-mute" : "volume"} size={20} />
            </button>
            <input
              type="range"
              aria-label="Volume"
              min={0}
              max={1}
              step={0.05}
              value={effectiveVolume}
              onChange={(event) => onVolume(Number(event.target.value))}
              className="player-range h-1 w-0 cursor-pointer accent-brand transition-all duration-200 group-hover/vol:w-20 focus:w-20"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Quality selector */}
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={qualityOpen}
              aria-label="Quality settings"
              onClick={() => setQualityOpen((open) => !open)}
              className={cn(ICON_BTN, "w-auto gap-1.5 px-3 text-xs font-semibold uppercase")}
            >
              <Icon name="settings" size={18} />
              {quality}
            </button>
            {qualityOpen && (
              <div
                role="menu"
                className="absolute bottom-12 right-0 min-w-32 overflow-hidden rounded-xl border border-white/10 bg-surface/95 py-1 shadow-2xl backdrop-blur"
              >
                {qualities.map((q) => (
                  <button
                    key={q}
                    role="menuitemradio"
                    aria-checked={q === quality}
                    onClick={() => {
                      onSelectQuality(q);
                      setQualityOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-white/10",
                      q === quality ? "text-brand-soft" : "text-ink-muted",
                    )}
                  >
                    <span className="uppercase">{q}</span>
                    {q === quality && <Icon name="check" size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={onToggleFullscreen}
            className={ICON_BTN}
          >
            <Icon name={fullscreen ? "fullscreen-exit" : "fullscreen"} size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
