import type { Metadata } from "next";
import Link from "next/link";

import { Arrow } from "@/components/lab/arrow";
import { Marquee } from "@/components/ui/marquee";
import { INDEX, ROLE, TALLY } from "@/content/lab-index";
import { SITE } from "@/content/site";

import { familjen } from "../fonts";
import "./a.css";

export const metadata: Metadata = {
  title: "Lab — concept 3A, the index",
  description:
    "Concept 3A: the work as a ledger. One typeface, black on white, and a row that inverts and runs its outcomes when you point at it.",
  robots: { index: false, follow: false },
};

/*
 * Lead reference: Ben Powell (bpowell.co), measured at 1440 — four equal
 * columns on a 40px margin, a 26px strip, the index at 86px/1.05 with
 * -0.033em tracking. Detail from romainavalle.dev: the row that inverts and
 * becomes a marquee, carrying outcomes here where he carries awards.
 */
export default function ConceptA() {
  return (
    <div className={`ca ${familjen.variable}`}>
      <header className="ca-strip ca-grid">
        <Link className="ca-link" href="/">
          {SITE.name}
        </Link>
        <span>{ROLE}</span>
        <a className="ca-link" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        <span>Chattanooga, TN</span>
      </header>

      <main id="main">
        <section className="ca-index" aria-labelledby="ca-title">
          <h1 id="ca-title" className="ca-lede">
            A design generalist first, and still hands-on: I design platforms
            where software meets people doing real work, and the systems that
            keep them coherent.
          </h1>

          <ul className="ca-rows">
            {INDEX.map((row) => (
              <li key={row.slug}>
                <Link className="ca-row ca-grid" href={`/work/${row.slug}/`}>
                  <span className="ca-row__years">{row.years}</span>
                  <span className="ca-row__title">{row.title}</span>
                  <span className="ca-row__meta">
                    <span>{row.client}</span>
                    <span className="ca-muted">{row.role}</span>
                  </span>
                  {/* Read on touch screens, where nothing hovers. */}
                  <span className="ca-row__outcomes">
                    {row.outcomes.join(", ")}
                  </span>
                  <span className="ca-row__run" aria-hidden="true">
                    <Marquee fade={false} repeat={3} className="ca-marquee">
                      {row.outcomes.map((o) => (
                        <span key={o} className="ca-marquee__item">
                          {o}
                          <Arrow className="ca-marquee__arrow" />
                        </span>
                      ))}
                    </Marquee>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="ca-section ca-grid" aria-labelledby="ca-numbers">
          <h2 id="ca-numbers" className="ca-muted">
            Numbers
          </h2>
          <dl className="ca-tally">
            {TALLY.map((t) => (
              <div key={t.label} className="ca-tally__row">
                <dt>{t.label}</dt>
                <dd>{t.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ca-section ca-grid" aria-labelledby="ca-about">
          <h2 id="ca-about" className="ca-muted">
            About
          </h2>
          <p className="ca-about">
            Lead platform strategist at Whiteboard. Before that, Head of Product
            Design at 100 Shapes, where I led the design system behind ITV
            Studios Portal. Underneath the strategy is a generalist&rsquo;s
            hand: brand, visual and interface work for clients from TED to
            Chick-fil-A, made, not just directed. Based in Chattanooga,
            Tennessee.
          </p>
        </section>
      </main>

      <footer className="ca-foot">
        <div className="ca-grid">
          <span className="ca-foot__label">Ask</span>
          <a className="ca-foot__mail" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </div>
        <div className="ca-grid ca-foot__base">
          <a className="ca-link" href={SITE.linkedin}>
            LinkedIn
          </a>
          <span>Chattanooga, TN</span>
          <span>2026</span>
        </div>
      </footer>
    </div>
  );
}
