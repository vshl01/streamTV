import { describe, expect, it } from "vitest";
import { toCatalog, toTitle } from "./transformers";
import type { CmsEntry, CmsResponse } from "@/types/content";

function entry(id: string, slug: string, overrides: Partial<CmsEntry["fields"]> = {}): CmsEntry {
  return {
    sys: { id },
    fields: {
      slug,
      name: slug,
      tagline: "t",
      synopsis: "s",
      kind: "movie",
      year: 2024,
      runtimeMinutes: 100,
      maturity: "U/A 13+",
      rating: 8,
      genres: ["Action"],
      categories: ["action"],
      posterUrl: "p",
      backdropUrl: "b",
      streamUrl: "stream",
      cast: ["A"],
      director: "D",
      featured: false,
      ...overrides,
    },
  };
}

describe("toTitle", () => {
  it("maps sys.id and fields onto the domain model", () => {
    const title = toTitle(entry("abc", "neon"));
    expect(title.id).toBe("abc");
    expect(title.slug).toBe("neon");
    expect(title.genres).toEqual(["Action"]);
  });
});

describe("toCatalog", () => {
  const response: CmsResponse = {
    total: 3,
    items: [
      entry("1", "a", { categories: ["trending", "action"], featured: true }),
      entry("2", "b", { categories: ["drama"], featured: false }),
      entry("3", "c", { categories: ["action"], featured: true }),
    ],
  };

  it("groups titles into ordered, non-empty categories", () => {
    const catalog = toCatalog(response);
    const slugs = catalog.categories.map((c) => c.slug);
    expect(slugs).toEqual(["trending", "action", "drama"]);
    expect(catalog.categories.find((c) => c.slug === "action")?.titles).toHaveLength(2);
  });

  it("collects featured titles and builds a by-slug lookup", () => {
    const catalog = toCatalog(response);
    expect(catalog.featured.map((t) => t.slug)).toEqual(["a", "c"]);
    expect(catalog.bySlug.b.id).toBe("2");
    expect(Object.keys(catalog.bySlug)).toHaveLength(3);
  });
});
