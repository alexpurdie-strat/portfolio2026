import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study";
import { SiteHeader } from "@/components/site-header";
import { ENTRIES, entryBySlug } from "@/content/work";

export function generateStaticParams() {
  return ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = entryBySlug(slug);
  if (!entry) return { title: "Not found — Alexpurdie.co" };
  return {
    title: `${entry.quality} · ${entry.client} — Alexpurdie.co`,
    description: entry.standfirst || entry.title || undefined,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entryBySlug(slug);
  if (!entry) notFound();
  return (
    <>
      <SiteHeader />
      <CaseStudy entry={entry} />
    </>
  );
}
