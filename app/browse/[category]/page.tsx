import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/cms/client";
import { BrowseTemplate } from "@/components/templates/BrowseTemplate";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/cms/transformers";
import type { CategorySlug } from "@/types/content";

type BrowseParams = { params: Promise<{ category: string }> };

const isCategory = (value: string): value is CategorySlug =>
  (CATEGORY_ORDER as string[]).includes(value);

export function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }));
}

export async function generateMetadata({ params }: BrowseParams): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return { title: "Browse" };
  return {
    title: CATEGORY_LABELS[category],
    description: `Browse ${CATEGORY_LABELS[category]} on StreamTV.`,
  };
}

/** Category browse page (Server Component). */
export default async function BrowsePage({ params }: BrowseParams) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const catalog = await getCatalog();
  const match = catalog.categories.find((c) => c.slug === category);
  if (!match) notFound();

  return <BrowseTemplate label={match.label} slug={match.slug} titles={match.titles} />;
}
