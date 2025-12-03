/**
 * GraphQL query strings for the Contentful GraphQL Content API.
 *
 * The app primarily reads via REST/SSR, but search is wired to a GraphQL
 * endpoint so the "REST + GraphQL" architecture claim is real. When Contentful
 * is not configured, the local GraphQL route handler interprets these against
 * `content.json` (it understands the `titleCollection` shape below).
 */

/** Fragment of fields every title query selects. */
export const TITLE_FIELDS = /* GraphQL */ `
  fragment TitleFields on Title {
    sys { id }
    slug
    name
    tagline
    synopsis
    kind
    year
    runtimeMinutes
    maturity
    rating
    genres
    categories
    posterUrl
    backdropUrl
    streamUrl
    cast
    director
    featured
  }
`;

/** Search titles by a free-text query (matched against name + genres). */
export const SEARCH_TITLES_QUERY = /* GraphQL */ `
  ${TITLE_FIELDS}
  query SearchTitles($query: String!, $limit: Int = 24) {
    titleCollection(where: { query: $query }, limit: $limit) {
      total
      items { ...TitleFields }
    }
  }
`;

/** Fetch every title (used to hydrate the client-side RTK Query cache). */
export const ALL_TITLES_QUERY = /* GraphQL */ `
  ${TITLE_FIELDS}
  query AllTitles {
    titleCollection(limit: 200) {
      total
      items { ...TitleFields }
    }
  }
`;
