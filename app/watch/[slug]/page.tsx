import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getTitleBySlug } from "@/lib/cms/client";
import { PlayerTemplate } from "@/components/templates/PlayerTemplate";
import { titleMetadata } from "@/lib/seo/metadata";

type WatchParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WatchParams): Promise<Metadata> {
  const { slug } = await params;
  const title = await getTitleBySlug(slug);
  return title ? { ...titleMetadata(title), title: `Watch ${title.name}` } : { title: "Watch" };
}

/** Watch / player page (Server Component shell; the player itself is client). */
export default async function WatchPage({ params }: WatchParams) {
  const { slug } = await params;
  const title = await getTitleBySlug(slug);
  if (!title) notFound();

  return <PlayerTemplate title={title} />;
}
