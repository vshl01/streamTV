import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/cms/client";
import { CATEGORY_ORDER } from "@/lib/cms/transformers";
import { siteUrl } from "@/lib/seo/metadata";

/** Generate sitemap.xml covering static routes + every title. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const slugs = await getAllSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/search`, changeFrequency: "weekly", priority: 0.5 },
    ...CATEGORY_ORDER.map((category) => ({
      url: `${base}/browse/${category}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const titleRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/title/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...titleRoutes];
}
