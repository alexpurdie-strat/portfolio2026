import type { Metadata } from "next";
import Link from "next/link";
import { MarginNote } from "@/components/margin-note";
import { PageMasthead } from "@/components/page-masthead";
import { Register } from "@/components/register";
import { SiteHeader } from "@/components/site-header";
import { CLAIMS, entryBySlug } from "@/content/work";

export const metadata: Metadata = {
  title: "Approach — Alexpurdie.co",
  description: "How the work gets made, and what it is for.",
};

export default function Approach() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page">
        <PageMasthead eyebrow="How I work" title="Approach." />

        <p className="page__lede">
          Design that has to survive an enterprise release cycle is a different
          discipline from design that has to survive a pitch. What follows is
          the part that transfers: the habits that hold up when the org is
          large, the constraints are real, and the person using the thing does
          it four hundred times a day.
        </p>

        <MarginNote tilt={-3} nudge={2.5} reach={2}>
          Claims are cheap — the archive is where I have to pay for them.
        </MarginNote>

        <ol className="registers">
          {CLAIMS.map((c) => {
            const entry = entryBySlug(c.backedBy);
            return (
              <Register
                key={c.claim}
                mark={c.ref}
                title={c.claim}
                href={entry ? `/archive/${entry.slug}` : undefined}
                linkLabel={entry ? `Backed by ${entry.client}` : undefined}
              >
                <p>{c.line}</p>
              </Register>
            );
          })}
        </ol>

        <p className="page__outro">
          <Link className="text-button" href="/archive">
            Go to the archive <span aria-hidden>→</span>
          </Link>
        </p>
      </main>
    </>
  );
}
