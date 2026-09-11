import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FramingStrip } from "@/components/framing-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findWork(slug);
  if (!entry) notFound();

  const { meta, Body } = entry;

  return (
    <>
      <SiteHeader />
      <main id="main" className="page case">
        <header className="case__masthead measure">
          <p className="label">
            {meta.client} · {meta.years}
          </p>
          <h1 className="case__title">{meta.title}</h1>
          <p className="lede case__subtitle">{meta.subtitle}</p>
        </header>

        <FramingStrip
          challenge={meta.challenge}
          product={meta.product}
          facts={[
            { label: "Client", value: meta.client },
            ...(meta.agency ? [{ label: "Agency", value: meta.agency }] : []),
            { label: "My role", value: meta.role },
            { label: "Team", value: meta.team },
            { label: "Platform", value: meta.platform },
            { label: "Status", value: meta.status },
          ]}
        />

        <div className="case__body">
          <Body />
        </div>

        <nav className="case__next" aria-label="Keep reading">
          <Link className="tap" href="/">
            <span aria-hidden>←</span> All work
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
