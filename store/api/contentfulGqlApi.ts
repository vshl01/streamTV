/**
 * RTK Query — GraphQL surface over the CMS.
 *
 * Posts GraphQL documents to the local `/api/cms/graphql` route handler, which
 * proxies Contentful's GraphQL Content API or interprets the query against the
 * JSON fallback. Powers the debounced search experience.
 */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Title } from "@/types/content";
import { SEARCH_TITLES_QUERY } from "@/lib/cms/queries";

/** Shape of the GraphQL `titleCollection` response envelope. */
interface TitleCollectionResponse {
  data: { titleCollection: { total: number; items: Title[] } };
}

export const contentfulGqlApi = createApi({
  reducerPath: "contentfulGqlApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/cms/" }),
  endpoints: (builder) => ({
    /** Search titles by free-text query via GraphQL. */
    searchTitles: builder.query<Title[], { query: string; limit?: number }>({
      query: ({ query, limit = 24 }) => ({
        url: "graphql",
        method: "POST",
        body: { query: SEARCH_TITLES_QUERY, variables: { query, limit } },
      }),
      transformResponse: (response: TitleCollectionResponse) =>
        response.data.titleCollection.items,
    }),
  }),
});

export const { useSearchTitlesQuery, useLazySearchTitlesQuery } = contentfulGqlApi;
