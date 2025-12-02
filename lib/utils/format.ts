/** Formatting helpers for durations, dates, and progress. */

/**
 * Format a duration in minutes as a human label, e.g. `2h 14m` or `48m`.
 */
export function formatRuntime(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return "—";
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

/**
 * Format a number of seconds as a clock string: `m:ss` or `h:mm:ss`.
 * Used by the player scrubber and time readouts.
 */
export function formatClock(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
  const secs = Math.floor(totalSeconds % 60);
  const mins = Math.floor((totalSeconds / 60) % 60);
  const hrs = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hrs > 0 ? `${hrs}:${pad(mins)}:${pad(secs)}` : `${mins}:${pad(secs)}`;
}

/**
 * Compute completion as a 0–100 percentage, clamped and safe against zero.
 */
export function toPercent(position: number, duration: number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return Math.min(100, Math.max(0, (position / duration) * 100));
}

/**
 * Format an editorial rating (out of 10) to a single decimal, e.g. `8.4`.
 */
export function formatRating(rating: number): string {
  if (!Number.isFinite(rating)) return "—";
  return rating.toFixed(1);
}
