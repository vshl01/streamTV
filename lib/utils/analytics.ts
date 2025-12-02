/**
 * Analytics interface + no-op implementation.
 *
 * Server-side analytics are out of scope, but we ship the seam so product
 * events have one place to flow through. Swap `noopAnalytics` for a real
 * Segment/Amplitude client later without touching call sites.
 */

/** Product events the app emits. */
export type AnalyticsEvent =
  | { type: "page_view"; path: string }
  | { type: "title_open"; slug: string }
  | { type: "playback_start"; slug: string }
  | { type: "playback_progress"; slug: string; percent: number }
  | { type: "search"; query: string; results: number };

export interface Analytics {
  /** Record a single product event. */
  track(event: AnalyticsEvent): void;
}

/** Default sink — logs in development, silent in production. */
export const noopAnalytics: Analytics = {
  track(event) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event.type, event);
    }
  },
};
