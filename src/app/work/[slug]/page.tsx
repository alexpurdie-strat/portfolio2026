import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { isMarker, TODOS_VISIBLE } from "@/components/todo";
import { WorkNav } from "@/components/work-nav";
import { WORK, findWork } from "@/content/work";

export function generateStaticParams() {
  return WORK.map((w) => ({ slug: w.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findWork(slug);
  if (!entry) return {};
  return {
    title: `${entry.meta.title} — Alex Purdie`,
    description: entry.meta.subtitle,
  };
}

/* Disciplines run under the title as separate marks, the way the old site set
   them — one per line rather than a comma list. */
const DISCIPLINES: Record<string, string[]> = {
  "ja-finance-park": ["Strategy", "Product", "Service design", "Facilitation"],
  "itv-studios-portal": ["Research", "Strategy", "Design systems", "Governance"],
  "your-move": ["Strategy", "Prototyping", "Research", "Mentorship"],
  "100-shapes": ["Leadership", "Practice", "Hiring", "Mentorship"],
  "home-depot": ["Enterprise", "Service design", "Research"],
};

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findWork(slug);
  if (!entry) notFound();

  const { meta, Body } = entry;
  const index = WORK.findIndex((w) => w.meta.slug === slug);
  const next = WORK[(index + 1) % WORK.length].meta;

  return (
    <>
      <WorkNav />
      <main id="main" className="study">
        {/*
          The opening, borrowed from the old site: a small client line, a title
          at display size, and the disciplines stacked beneath it. The title was
          161px there against 36px here — and at 36px a case study opens like a
          blog post rather than like a piece of work.
        */}
        <header className="grid study__head">
          <p className="study__client ui">
            {meta.client}
            {meta.agency ? ` · ${meta.agency}` : ""} — {meta.years}
          </p>
          <h1 className="study__title">{meta.title}</h1>
          <ul className="study__disciplines ui">
            {(DISCIPLINES[meta.slug] ?? []).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="study__standfirst">{meta.subtitle}</p>
        </header>

        <div className="grid study__hero">
          <span className="study__heroBlock" />
        </div>

        <section className="grid study__facts" aria-label="Project summary">
          <p className="study__challenge">{meta.challenge}</p>
          <dl className="study__factList">
            {[
              { label: "My role", value: meta.role },
              { label: "Team", value: meta.team },
              { label: "Platform", value: meta.platform },
              { label: "Status", value: meta.status },
            ]
              /* A fact still held as a marker prints the marker. Drop the row
                 rather than leave a label standing over nothing. */
              .filter((f) => TODOS_VISIBLE || !isMarker(f.value))
              .map((f) => (
              <div key={f.label}>
                <dt className="ui">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
              ))}
          </dl>
        </section>

        <div className="grid study__body">
          <Body />
        </div>

        {/* The old site's closing move, and a better one than a back link. */}
        <section className="grid study__next">
          <p className="study__nextLabel ui">Why not read another while you’re here</p>
          <h2 className="study__nextTitle">
            <Link href={`/work/${next.slug}`}>{next.title}</Link>
          </h2>
          <p className="study__nextSummary">{next.subtitle}</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
