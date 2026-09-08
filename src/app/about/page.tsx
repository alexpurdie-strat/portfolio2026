import type { Metadata } from "next";
import Link from "next/link";
import { MarginNote } from "@/components/margin-note";
import { PageMasthead } from "@/components/page-masthead";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About — Alexpurdie.co",
  description: "Product designer, London.",
};

const AWARDS = [
  ["Boutique Agency of the Year", "100 Shapes", "2023"],
  ["Hapstar Happiest Company, Q2", "100 Shapes", "2023"],
  [
    "Broadcast Tech Awards finalist — Innovative usage of the Cloud",
    "",
    "2022",
  ],
];

export default function About() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page">
        <PageMasthead eyebrow="Who is doing this" title="About." />

        <MarginNote tilt={2.6} nudge={3} reach={2.25}>
          The sideways projects taught more than the clean ones.
        </MarginNote>

        <p className="page__lede">
          I work on the systems underneath the interface — the processes that
          produce the screens, the teams that produce the processes. Strategic
          problem-solving, user research, and a define, ideate, prototype, test
          and iterate loop that I have run enough times to know where it lies to
          you.
        </p>

        <p>
          Most of my work has been enterprise: broadcast production, retail at
          the scale of two thousand stores, financial self-service. The common
          thread is complexity that someone has stopped noticing, and the job is
          usually to notice it out loud before designing anything at all.
        </p>

        <p>
          Before that, and alongside it, running a design team — building the
          structure that lets people get better on purpose rather than by
          accident.
        </p>

        <h2 className="page__subhead">Recognition</h2>
        <ul className="facts">
          {AWARDS.map(([what, where, when]) => (
            <li key={what} className="facts__row">
              <span className="facts__what">{what}</span>
              <span className="facts__meta">
                {where ? `${where} · ` : ""}
                {when}
              </span>
            </li>
          ))}
        </ul>

        <p className="page__outro">
          <Link className="text-button" href="/ask">
            Get in touch <span aria-hidden>→</span>
          </Link>
        </p>
      </main>
    </>
  );
}
