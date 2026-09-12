import type { Metadata } from "next";
import { Masthead } from "@/components/masthead";
import { SiteFooter } from "@/components/site-footer";
import { WorkRow } from "@/components/work-row";
import { SITE } from "@/content/site";
import { WORK } from "@/content/work";

export const metadata: Metadata = {
  title: SITE.meta.title,
  description: SITE.meta.description,
};

/* TODO(alex): three disciplines per project, as the frame shows them. */
const DISCIPLINES: Record<string, string[]> = {
  "ja-finance-park": ["Strategy", "Product", "Service design"],
  "itv-studios-portal": ["Systems", "Design systems", "Service design"],
};

export default function Home() {
  const [lead, ...rest] = WORK;

  return (
    <>
      {/* The masthead carries the first project: once collapsed, the hero is
          that project's row. */}
      <Masthead
        lead={lead.meta}
        disciplines={DISCIPLINES[lead.meta.slug] ?? []}
      />
      <main id="main" className="work">
        {rest.map((w) => (
          <WorkRow
            key={w.meta.slug}
            meta={w.meta}
            disciplines={DISCIPLINES[w.meta.slug] ?? []}
          />
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
