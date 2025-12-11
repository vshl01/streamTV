/**
 * Category browse layout: a responsive poster grid that doubles as a single
 * spatial-navigation focus context. No data fetching.
 */
import Link from "next/link";
import { FocusableDiv } from "@/components/atoms/FocusableDiv";
import { Icon } from "@/components/atoms/Icon";
import { PosterCard } from "@/components/molecules/PosterCard";
import type { Title } from "@/types/content";

export interface BrowseTemplateProps {
  label: string;
  slug: string;
  titles: Title[];
}

export function BrowseTemplate({ label, slug, titles }: BrowseTemplateProps) {
  return (
    <div className="px-4 pb-16 pt-[calc(var(--header-height)+1.5rem)] sm:px-8 lg:px-12">
      <nav aria-label="Breadcrumb" className="mb-3">
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-1 rounded-full text-sm text-ink-subtle transition-colors hover:text-ink"
        >
          <Icon name="chevron-left" size={16} />
          Home
        </Link>
      </nav>

      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{label}</h1>
        <p className="text-sm text-ink-subtle">
          {titles.length} {titles.length === 1 ? "title" : "titles"}
        </p>
      </div>

      <FocusableDiv
        focusKey={`browse-${slug}`}
        provideContext
        saveLastFocusedChild
        className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {titles.map((title, index) => (
          <PosterCard
            key={title.id}
            title={title}
            rowSlug={`browse-${slug}`}
            priority={index < 12}
            fullWidth
          />
        ))}
      </FocusableDiv>
    </div>
  );
}
