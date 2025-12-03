/**
 * CMS client. Server-side only.
 *
 * Resolution order:
 *   1. Contentful Delivery API  — when CONTENTFUL_SPACE_ID + token are set.
 *   2. Local `content.json`     — bundled fallback so the app runs offline.
 *
 * Both sources are normalized to the same `CmsResponse` envelope and handed to
 * the transformers, so the rest of the app is agnostic to where data came from.
 */
import "server-only";
import type { Catalog, CmsEntry, CmsResponse, Title } from "@/types/content";
import rawContent from "@/public/content.json";
import { toCatalog, toTitle } from "./transformers";

/** The bundled fallback payload, typed to our CMS envelope. */
const FALLBACK: CmsResponse = rawContent as unknown as CmsResponse;

/** True when Contentful credentials are present in the environment. */
export function isContentfulConfigured(): boolean {
  return Boolean(
    process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN,
  );
}

/** Fetch and normalize entries from Contentful's Delivery API. */
async function fetchFromContentful(): Promise<CmsResponse> {
  const { createClient } = await import("contentful");
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID as string,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
    environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
  });

  const entries = await client.getEntries({ content_type: "title", limit: 200 });
  const items: CmsEntry[] = entries.items.map((entry) => ({
    sys: { id: entry.sys.id },
    fields: entry.fields as unknown as CmsEntry["fields"],
  }));
  return { total: items.length, items };
}

/**
 * Load the raw CMS collection, preferring Contentful and falling back to the
 * bundled JSON on missing config or any network error.
 */
export async function loadCmsResponse(): Promise<CmsResponse> {
  if (!isContentfulConfigured()) return FALLBACK;
  try {
    return await fetchFromContentful();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[cms] Contentful fetch failed, using fallback:", error);
    }
    return FALLBACK;
  }
}

/** Resolve the full, grouped catalog consumed by templates. */
export async function getCatalog(): Promise<Catalog> {
  return toCatalog(await loadCmsResponse());
}

/** Look up a single title by its slug. Returns `null` when not found. */
export async function getTitleBySlug(slug: string): Promise<Title | null> {
  const response = await loadCmsResponse();
  const entry = response.items.find((item) => item.fields.slug === slug);
  return entry ? toTitle(entry) : null;
}

/** Every slug in the catalog — used for static params generation. */
export async function getAllSlugs(): Promise<string[]> {
  const response = await loadCmsResponse();
  return response.items.map((item) => item.fields.slug);
}

/** Titles sharing at least one genre with `title`, best-rated first. */
export async function getRelatedTitles(title: Title, limit = 12): Promise<Title[]> {
  const titles = (await loadCmsResponse()).items.map(toTitle);
  return titles
    .filter((t) => t.slug !== title.slug && t.genres.some((g) => title.genres.includes(g)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Full-text-ish search across name, genres, and cast. Powers both the
 * GraphQL route handler and any server-side search needs.
 */
export async function searchTitles(query: string): Promise<Title[]> {
  const q = query.trim().toLowerCase();
  const titles = (await loadCmsResponse()).items.map(toTitle);
  if (!q) return [];
  return titles.filter((title) => {
    const haystack = [title.name, title.director, ...title.genres, ...title.cast]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
