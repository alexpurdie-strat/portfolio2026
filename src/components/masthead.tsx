"use client";

import Link from "next/link";
import { useRef } from "react";
import { Clock } from "@/components/clock";
import { SITE } from "@/content/site";
import { useCollapse } from "@/lib/use-collapse";

/*
 * The persistent layer.
 *
 * Everything marked purple in Figma 64:175 lives here, and none of it scrolls.
 * It is one fixed layer whose parts move between the two frames' positions as
 * --t runs 0 → 1, and then hold. The work rows scroll underneath it.
 *
 * That is the correction to the first attempt, which let these elements sit in
 * normal flow and scroll away — so the wordmark, the nav, the statement and the
 * standing details all left the screen when they should have stayed.
 */
export function Masthead() {
  /* --t is written to <html> rather than to this layer, because the first work
     row needs it too and they have no closer shared ancestor. It is the one
     property on the site allowed up there, and it is quantized so an
     imperceptible change costs no recalc. */
  const stage = useRef<HTMLElement>(null);
  useCollapse(stage);

  return (
    <div className="fixed-layer">
      {/* Scales 160 → 24 and rises. One element, not a handover. */}
      <Link className="mark" href="/">
        <span className="mark__italic">Alex</span> Purdie
      </Link>

      {/* Literally stays in place. */}
      <nav className="nav nav--fixed" aria-label="Primary">
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

      {/* Scales down and moves right line by line — each line runs on its own
          offset slice of --t, so they arrive in sequence rather than together. */}
      <p className="statement">
        <span className="statement__line" style={{ "--d": 0 } as React.CSSProperties}>
          <em>Empowering</em>
        </span>
        <span className="statement__line" style={{ "--d": 1 } as React.CSSProperties}>
          <em>embodied lives</em>
        </span>
        <span className="statement__line" style={{ "--d": 2 } as React.CSSProperties}>
          on and off screen
        </span>
      </p>

      {/* Slides up from the foot of the load-in frame to rest under the
          statement, and stays there. */}
      <div className="standing">
        <p className="ui">{SITE.currently}</p>
        <p className="status ui">
          <span className="status__dot" aria-hidden />
          {SITE.status}
        </p>
      </div>

      {/* Present only in the load-in frame. */}
      <p className="tagline ui">{SITE.tagline}</p>
      <p className="email ui">
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </p>
      <Clock className="clock ui" />
    </div>
  );
}
