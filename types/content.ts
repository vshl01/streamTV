/**
 * Domain content models for StreamTV.
 *
 * These are the app-facing shapes. Raw CMS payloads (Contentful Delivery API
 * or the local `content.json` fallback) are mapped into these by the
 * transformers in `lib/cms/transformers.ts`.
 */

/** A content genre / browsable category. */
export type CategorySlug =
  | "trending"
  | "new-releases"
  | "action"
  | "drama"
  | "comedy"
  | "documentary";

/** Maturity rating shown on cards and the detail page. */
export type MaturityRating = "U" | "U/A 7+" | "U/A 13+" | "U/A 16+" | "A";

/** Media kind — a movie plays directly, a series exposes episodes. */
export type TitleKind = "movie" | "series";

/** A single playable title (movie or series) in the catalog. */
export interface Title {
  /** Stable CMS id. */
  id: string;
  /** URL-safe identifier used in routes (`/title/[slug]`). */
  slug: string;
  /** Display name. */
  name: string;
  /** One-line tagline shown under the hero title. */
  tagline: string;
  /** Long-form description / plot synopsis. */
  synopsis: string;
  kind: TitleKind;
  /** Release year. */
  year: number;
  /** Runtime in minutes (movies) or average episode length (series). */
  runtimeMinutes: number;
  maturity: MaturityRating;
  /** Editorial / aggregated score out of 10. */
  rating: number;
  /** Genre labels for display. */
  genres: string[];
  /** Categories this title belongs to (drives the home rows). */
  categories: CategorySlug[];
  /** Portrait poster (used by cards). */
  posterUrl: string;
  /** Landscape backdrop (used by the hero and detail page). */
  backdropUrl: string;
  /** HLS manifest URL for playback. */
  streamUrl: string;
  /** Cast member names. */
  cast: string[];
  /** Director / showrunner name. */
  director: string;
  /** Marks featured titles eligible for the hero rotation. */
  featured: boolean;
}

/** A category with its resolved list of titles, ready for a content row. */
export interface Category {
  slug: CategorySlug;
  label: string;
  titles: Title[];
}

/** The fully-resolved catalog consumed by templates. */
export interface Catalog {
  featured: Title[];
  categories: Category[];
  /** Flat lookup of every title by slug. */
  bySlug: Record<string, Title>;
}

/* ------------------------------------------------------------------ *
 * Raw CMS shapes — mirror the Contentful Delivery API response so the
 * local fallback and the real API can share a single transformer.
 * ------------------------------------------------------------------ */

/** A Contentful-style entry as it appears in the raw payload. */
export interface CmsEntry {
  sys: { id: string; contentType?: { sys: { id: string } } };
  fields: {
    slug: string;
    name: string;
    tagline: string;
    synopsis: string;
    kind: TitleKind;
    year: number;
    runtimeMinutes: number;
    maturity: MaturityRating;
    rating: number;
    genres: string[];
    categories: CategorySlug[];
    posterUrl: string;
    backdropUrl: string;
    streamUrl: string;
    cast: string[];
    director: string;
    featured: boolean;
  };
}

/** The raw Contentful-shaped collection response. */
export interface CmsResponse {
  total: number;
  items: CmsEntry[];
}
