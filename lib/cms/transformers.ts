/**
 * Transformers: raw CMS payloads → app domain models.
 *
 * Keeping this mapping in one place means the Contentful Delivery API response
 * and the local `content.json` fallback (shaped identically) flow through the
 * same code path, and components never touch CMS-specific field structures.
 */
import type {
  Catalog,
  Category,
  CategorySlug,
  CmsEntry,
  CmsResponse,
  Title,
} from "@/types/content";

/** Human labels and display order for the browsable categories. */
export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  trending: "Trending Now",
  "new-releases": "New Releases",
  action: "Action & Adventure",
  drama: "Drama",
  comedy: "Comedy",
  documentary: "Documentaries",
};

/** Stable display order of rows on the home page. */
export const CATEGORY_ORDER: CategorySlug[] = [
  "trending",
  "new-releases",
  "action",
  "drama",
  "comedy",
  "documentary",
];

/** Map a single CMS entry to a domain `Title`. */
export function toTitle(entry: CmsEntry): Title {
  const f = entry.fields;
  return {
    id: entry.sys.id,
    slug: f.slug,
    name: f.name,
    tagline: f.tagline,
    synopsis: f.synopsis,
    kind: f.kind,
    year: f.year,
    runtimeMinutes: f.runtimeMinutes,
    maturity: f.maturity,
    rating: f.rating,
    genres: f.genres,
    categories: f.categories,
    posterUrl: f.posterUrl,
    backdropUrl: f.backdropUrl,
    streamUrl: f.streamUrl,
    cast: f.cast,
    director: f.director,
    featured: f.featured,
  };
}

/** Map the full CMS collection response to an array of `Title`s. */
export function toTitles(response: CmsResponse): Title[] {
  return response.items.map(toTitle);
}

/**
 * Group titles into ordered categories and build a fully-resolved `Catalog`
 * (featured rotation + by-slug lookup) for templates to consume.
 */
export function toCatalog(response: CmsResponse): Catalog {
  const titles = toTitles(response);
  const bySlug: Record<string, Title> = {};
  for (const title of titles) bySlug[title.slug] = title;

  const categories: Category[] = CATEGORY_ORDER.map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug],
    titles: titles.filter((t) => t.categories.includes(slug)),
  })).filter((category) => category.titles.length > 0);

  const featured = titles.filter((t) => t.featured);

  return { featured, categories, bySlug };
}
