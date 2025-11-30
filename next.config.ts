import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root: a parent-directory lockfile would otherwise be
  // auto-detected as the root and break output file tracing.
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  images: {
    // Poster/backdrop imagery. picsum.photos serves seeded placeholders and
    // redirects to its fastly CDN; image.tmdb.org is allow-listed so posters
    // can be swapped to real TMDB paths without a config change.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "image.tmdb.org" },
    ],
  },
};

export default nextConfig;
