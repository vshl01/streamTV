/**
 * Spatial-navigation (D-pad / arrow-key) configuration.
 *
 * Centralizes the focus-key namespace and the one-time `init()` call for
 * `@noriginmedia/norigin-spatial-navigation`, so Smart-TV focus behavior is
 * configured in exactly one place.
 */
import { init } from "@noriginmedia/norigin-spatial-navigation";

/** Stable focus-key prefixes used across the focus tree. */
export const FOCUS_KEYS = {
  HEADER: "header",
  NAV_ITEM: (id: string) => `nav-${id}`,
  ROW: (slug: string) => `row-${slug}`,
  CARD: (rowSlug: string, slug: string) => `card-${rowSlug}-${slug}`,
  HERO_PLAY: "hero-play",
  PLAYER_CONTROL: (id: string) => `player-${id}`,
} as const;

let initialized = false;

/**
 * Initialize spatial navigation once per session. Safe to call repeatedly.
 * Uses geometric distance so focus moves to the visually-nearest element.
 */
export function initSpatialNavigation(): void {
  if (initialized) return;
  init({
    debug: false,
    visualDebug: false,
    // Throttle key handling so holding a direction scrolls at a TV-friendly pace.
    throttle: 100,
    throttleKeypresses: true,
    shouldFocusDOMNode: true,
  });
  initialized = true;
}
