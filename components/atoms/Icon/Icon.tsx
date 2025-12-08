import type { SVGProps } from "react";
import { cn } from "@/lib/utils/cn";

/** Available icon glyphs. */
export type IconName =
  | "play"
  | "pause"
  | "search"
  | "volume"
  | "volume-mute"
  | "fullscreen"
  | "fullscreen-exit"
  | "plus"
  | "check"
  | "info"
  | "chevron-left"
  | "chevron-right"
  | "settings"
  | "close"
  | "tv"
  | "star"
  | "replay"
  | "back";

/** SVG path data for each glyph, drawn on a 24×24 viewBox. */
const PATHS: Record<IconName, string> = {
  play: "M8 5v14l11-7z",
  pause: "M6 5h4v14H6zM14 5h4v14h-4z",
  search:
    "M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z",
  volume: "M3 10v4h4l5 5V5L7 10H3zM16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14",
  "volume-mute": "M3 10v4h4l5 5V5L7 10H3zM22 9l-6 6M16 9l6 6",
  fullscreen: "M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3",
  "fullscreen-exit": "M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3",
  plus: "M12 5v14M5 12h14",
  check: "M20 6L9 17l-5-5",
  info: "M12 16v-4M12 8h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  close: "M18 6L6 18M6 6l12 12",
  tv: "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7zM8 21h8",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  replay: "M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10",
  back: "M19 12H5M12 19l-7-7 7-7",
};

/** Glyphs drawn as filled shapes rather than strokes. */
const FILLED: ReadonlySet<IconName> = new Set(["play", "pause", "star"]);

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Pixel size for both width and height. */
  size?: number;
  /** Accessible label; when omitted the icon is hidden from assistive tech. */
  title?: string;
}

/** Inline, currentColor-driven SVG icon. */
export function Icon({ name, size = 24, title, className, ...rest }: IconProps) {
  const filled = FILLED.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("shrink-0", className)}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={PATHS[name]} />
    </svg>
  );
}
