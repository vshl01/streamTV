/**
 * REST CMS endpoint — backs the `contentfulRestApi` RTK Query surface.
 *
 * GET /api/cms/rest               → full Catalog
 * GET /api/cms/rest?category=...  → a single Category
 *
 * Delegates to the CMS client, which transparently uses Contentful's Delivery
 * API or the bundled JSON fallback.
 */
import { NextResponse, type NextRequest } from "next/server";
import { getCatalog } from "@/lib/cms/client";
import type { CategorySlug } from "@/types/content";

export async function GET(request: NextRequest) {
  const catalog = await getCatalog();
  const category = request.nextUrl.searchParams.get("category") as CategorySlug | null;

  if (category) {
    const match = catalog.categories.find((c) => c.slug === category);
    if (!match) {
      return NextResponse.json({ error: "Unknown category" }, { status: 404 });
    }
    return NextResponse.json(match);
  }

  return NextResponse.json(catalog);
}
