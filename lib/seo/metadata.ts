/**
 * SEO metadata helpers for `generateMetadata`.
 *
 * Produces consistent titles, descriptions, and Open Graph / Twitter cards
 * across pages. Centralizing this keeps social previews uniform.
 */
import type { Metadata } from "next";
import type { Title } from "@/types/content";

export const SITE_NAME = "StreamTV";
export const SITE_DESCRIPTION =
  "Stream blockbuster movies, binge-worthy series, and award-winning documentaries — anywhere, on any screen.";

/** Absolute base URL for canonical/OG links (Vercel-aware). */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** Base metadata applied at the root layout. */
export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${SITE_NAME} — Watch TV Shows & Movies`, template: `%s · ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: ["OTT", "streaming", "movies", "TV shows", "documentaries", SITE_NAME],
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${SITE_NAME} — Watch TV Shows & Movies`,
      description: SITE_DESCRIPTION,
    },
    twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
    icons: { icon: "/favicon.ico" },
  };
}

/** Per-title metadata for the detail and watch routes. */
export function titleMetadata(title: Title): Metadata {
  const description = `${title.synopsis} ${title.year} · ${title.genres.join(", ")}.`;
  return {
    title: title.name,
    description,
    openGraph: {
      type: "video.other",
      title: `${title.name} (${title.year})`,
      description,
      images: [{ url: title.backdropUrl, width: 1600, height: 900, alt: title.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: title.name,
      description,
      images: [title.backdropUrl],
    },
  };
}
