import { getCatalog } from "@/lib/cms/client";
import { HomeTemplate } from "@/components/templates/HomeTemplate";

/**
 * Home page (Server Component). Fetches the catalog from the CMS client and
 * hands it to the presentational HomeTemplate.
 */
export default async function HomePage() {
  const catalog = await getCatalog();
  return <HomeTemplate catalog={catalog} />;
}
