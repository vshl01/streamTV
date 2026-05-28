/**
 * Home page layout. Arranges organisms only — no data fetching.
 * The hero bleeds under the first rows for the classic OTT overlap.
 */
import { HeroBanner } from "@/components/organisms/HeroBanner";
import { ContentRow } from "@/components/organisms/ContentRow";
import { ContinueWatchingRow } from "@/components/organisms/ContinueWatchingRow";
import type { Catalog } from "@/types/content";

export interface HomeTemplateProps {
  catalog: Catalog;
}

export function HomeTemplate({ catalog }: HomeTemplateProps) {
  return (
    <div className="pb-10">
      <HeroBanner titles={catalog.featured} />

      <div className="relative z-10 -mt-12 space-y-10 sm:-mt-16 sm:space-y-12 lg:-mt-20">
        <ContinueWatchingRow bySlug={catalog.bySlug} />
        {catalog.categories.map((category, index) => (
          <ContentRow
            key={category.slug}
            label={category.label}
            slug={category.slug}
            browseSlug={category.slug}
            titles={category.titles}
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
