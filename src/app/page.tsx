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
  return (
    <>
      <Masthead />
      {/* One screen of runway, so the load-in state is read before anything
          moves. The rows scroll up under the persistent layer from here. */}
      <div className="runway" aria-hidden />
      <main id="main" className="work">
        {WORK.map((w) => (
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
