import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";

/** robots.txt — allow all, point crawlers at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
