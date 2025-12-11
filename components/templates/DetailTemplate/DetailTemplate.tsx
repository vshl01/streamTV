/**
 * Title detail page layout. Arranges the backdrop hero, detail panel, and a
 * "More Like This" row. No data fetching — the page supplies title + related.
 */
import { Image } from "@/components/atoms/Image";
import { DetailPanel } from "@/components/organisms/DetailPanel";
import { ContentRow } from "@/components/organisms/ContentRow";
import type { Title } from "@/types/content";

export interface DetailTemplateProps {
  title: Title;
  related: Title[];
}

export function DetailTemplate({ title, related }: DetailTemplateProps) {
  return (
    <div className="pb-12">
      <section className="relative min-h-[88vh] w-full overflow-hidden">
        <Image
          src={title.backdropUrl}
          alt={`${title.name} backdrop`}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-canvas/60" />

        <div className="relative flex min-h-[88vh] flex-col justify-end px-4 pb-12 pt-[var(--header-height)] sm:px-8 lg:px-12">
          <DetailPanel title={title} />
        </div>
      </section>

      {related.length > 0 && (
        <div className="relative z-10 -mt-4">
          <ContentRow label="More Like This" slug={`related-${title.slug}`} titles={related} />
        </div>
      )}
    </div>
  );
}
