import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getRelatedTitles, getTitleBySlug } from "@/lib/cms/client";
import { DetailTemplate } from "@/components/templates/DetailTemplate";
import { titleMetadata } from "@/lib/seo/metadata";

type TitleParams = { params: Promise<{ slug: string }> };

/** Pre-render a detail page for every title at build time. */
export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TitleParams): Promise<Metadata> {
  const { slug } = await params;
  const title = await getTitleBySlug(slug);
  return title ? titleMetadata(title) : { title: "Title not found" };
}

/** Title detail page (Server Component). */
export default async function TitlePage({ params }: TitleParams) {
  const { slug } = await params;
  const title = await getTitleBySlug(slug);
  if (!title) notFound();

  const related = await getRelatedTitles(title);
  return <DetailTemplate title={title} related={related} />;
}
