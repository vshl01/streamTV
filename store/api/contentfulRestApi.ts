/**
 * RTK Query — REST surface over the CMS.
 *
 * Hits the local `/api/cms/rest` route handler, which proxies Contentful's
 * Delivery (REST) API or the JSON fallback. Used for client-side reads such as
 * browse-by-category and cache hydration.
 */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Catalog, Category, CategorySlug } from "@/types/content";

export const contentfulRestApi = createApi({
  reducerPath: "contentfulRestApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/cms/" }),
  tagTypes: ["Catalog"],
  endpoints: (builder) => ({
    /** The full grouped catalog (featured + categories + lookup). */
    getCatalog: builder.query<Catalog, void>({
      query: () => "rest",
      providesTags: ["Catalog"],
    }),
    /** A single category's titles. */
    getCategory: builder.query<Category, CategorySlug>({
      query: (slug) => `rest?category=${encodeURIComponent(slug)}`,
      providesTags: ["Catalog"],
    }),
  }),
});

export const { useGetCatalogQuery, useGetCategoryQuery } = contentfulRestApi;
