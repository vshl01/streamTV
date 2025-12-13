/**
 * GraphQL CMS endpoint — backs the `contentfulGqlApi` RTK Query surface.
 *
 * POST /api/cms/graphql  body: { query: string, variables?: { query, limit } }
 *
 * When Contentful is configured this would proxy its GraphQL Content API; in
 * the fallback build it interprets the supported `titleCollection` query
 * against `content.json` and returns a GraphQL-shaped envelope.
 */
import { NextResponse } from "next/server";
import { searchTitles, getCatalog } from "@/lib/cms/client";
import type { Title } from "@/types/content";

interface GraphQLBody {
  query?: string;
  variables?: { query?: string; limit?: number };
}

export async function POST(request: Request) {
  let body: GraphQLBody;
  try {
    body = (await request.json()) as GraphQLBody;
  } catch {
    return NextResponse.json({ errors: [{ message: "Invalid JSON body" }] }, { status: 400 });
  }

  const term = body.variables?.query?.trim() ?? "";
  const limit = body.variables?.limit ?? 24;

  let items: Title[];
  if (term) {
    items = (await searchTitles(term)).slice(0, limit);
  } else {
    // No search term → return the catalog (used for cache hydration).
    items = (await getCatalog()).categories.flatMap((c) => c.titles).slice(0, limit);
  }

  return NextResponse.json({
    data: { titleCollection: { total: items.length, items } },
  });
}
