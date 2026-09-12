"use client";

import Link from "next/link";
import { useRef } from "react";
import { Clock } from "@/components/clock";
import { Status } from "@/components/status";
import { SITE } from "@/content/site";
import type { WorkMeta } from "@/content/work";
import { useCollapse } from "@/lib/use-collapse";

/*
 * The masthead, and the first work row, as one thing.
 *
 * Reading the two Figma frames together: in 64:175 the statement sits at y=101
 * and the first project image sits at y=101 as well. They share a top edge
 * because the hero *is* the first row once it has collapsed — the image grows
 * from 687 centered to 1038 on the left, the statement shrinks from 68px
 * centered to 36px in the metadata column, and the project's own details fade
 * in beneath it.
 *
 * So this is one section with one image, interpolated by --t, rather than a
 * hero followed by a list. Building it as two would mean two images and a
 * cross-fade, which is not what the frames show.
 */
export function Masthead({
  lead,
  disciplines,
}: {
  lead: WorkMeta;
  disciplines: string[];
}) {
  const stage = useRef<HTMLDivElement>(null);
  useCollapse(stage);

  return (
    <div className="stage" ref={stage}>
      {/* Arrives as the large wordmark goes, and stays. */}
      <header className="bar">
        <div className="grid bar__inner">
          <Link className="bar__mark" href="/">
            {SITE.name}
          </Link>
          <Nav className="bar__nav" />
        </div>
      </header>

      <section className="hero">
        <div className="grid hero__top">
          <h1 className="hero__mark">
            <span className="hero__markItalic">Alex</span> Purdie
          </h1>
          <Nav className="hero__nav" />
          <p className="hero__tagline ui">{SITE.tagline}</p>
          <p className="hero__email ui">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </div>

        {/* Two instances, not one travelling element: the load-in statement is
            centered on the page and the collapsed one sits in the metadata
            column, so a single element cannot be in both places. They hand over
            on --t. */}
        <p className="hero__statement">
          <em>{SITE.statementLead}</em> {SITE.statementTail}
        </p>

        <div className="grid hero__body">
          <Link className="hero__media" href={`/work/${lead.slug}`} tabIndex={-1} aria-hidden>
            <span className="hero__block" />
          </Link>

          <div className="hero__meta">
            <p className="hero__statementSmall">
              <em>{SITE.statementLead}</em> {SITE.statementTail}
            </p>
            <p className="hero__currently ui">{SITE.currently}</p>
            <Status className="hero__statusTop" />

            <div className="hero__details">
              <p className="row__disciplines ui">
                {disciplines.map((d) => `[${d.toUpperCase()}]`).join(" ")}
              </p>
              <h2 className="row__title">
                <Link href={`/work/${lead.slug}`}>{lead.title}</Link>
              </h2>
              <p className="row__summary">{lead.subtitle}</p>
            </div>

            <p className="row__cta ui">
              <Link href={`/work/${lead.slug}`}>
                Learn More <span aria-hidden>→</span>
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom of the load-in frame only; gone once collapsed. */}
        <div className="grid hero__foot">
          <Clock className="hero__clock ui" />
          <div className="hero__footStatus">
            <p className="ui">{SITE.currently}</p>
            <Status />
          </div>
        </div>
      </section>
    </div>
  );
}

function Nav({ className }: { className?: string }) {
  return (
    <nav className={`nav ${className ?? ""}`} aria-label="Primary">
      {SITE.nav.map((item, i) => (
        <span key={item.href} className="nav__item">
          {i > 0 ? (
            <span className="nav__slash" aria-hidden>
              /
            </span>
          ) : null}
          <Link href={item.href}>{item.label}</Link>
        </span>
      ))}
    </nav>
  );
}
