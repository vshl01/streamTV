/** Public HLS test streams used for playback demos. */

/** Well-known, CORS-friendly HLS manifests. */
export const HLS_STREAMS = {
  mux: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  tearsOfSteel:
    "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
} as const;

/** MIME type for HLS manifests. */
export const HLS_MIME = "application/x-mpegURL";

/** Fallback stream when a title has no `streamUrl` of its own. */
export const DEFAULT_STREAM = HLS_STREAMS.mux;

/**
 * Resolve a usable HLS source for a title. Falls back to the demo stream so
 * the player always has something to play in the portfolio build.
 */
export function resolveStreamUrl(streamUrl?: string | null): string {
  return streamUrl && streamUrl.length > 0 ? streamUrl : DEFAULT_STREAM;
}
