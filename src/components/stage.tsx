"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock } from "@/components/clock";
import { SITE } from "@/content/site";
import type { WorkMeta } from "@/content/work";
import {
  IMAGES_PER_CASE,
  scrollForCase,
  stageHeight,
  useStage,
} from "@/lib/use-stage";

/*
 * The stage.
 *
 * Everything is fixed. The first case study settles into place over one screen
 * of scroll, and after that scrolling changes state rather than moving the
 * page: three images cycle through the image area, then the next case study
 * takes over — its details fading out and back in rather than travelling up
 * off the screen.
 */
export function Stage({
  entries,
  disciplines,
}: {
  /* Metadata only. A WorkEntry also carries its MDX component, and a function
     cannot cross from a server component into a client one. */
  entries: WorkMeta[];
  disciplines: Record<string, string[]>;
}) {
  const { caseIndex, imageIndex } = useStage(entries.length);

  /*
   * The details lag the index by one fade.
   *
   * A case study's details fade out, swap, and fade back in — so what is on
   * screen is not the current index but the last one that finished arriving.
   */
  const [shown, setShown] = useState(0);
  /* Derived, not stored. "Settled" is just whether what is on screen has caught
     up with where the scroll is — holding it in state as well meant setting it
     synchronously inside the effect, which is a cascading render. */
  const settled = caseIndex === shown;

  useEffect(() => {
    if (settled) return;
    const id = window.setTimeout(() => setShown(caseIndex), 260);
    return () => window.clearTimeout(id);
  }, [caseIndex, settled]);

  const meta = entries[shown] ?? entries[0];
  const discs = disciplines[meta.slug] ?? [];

  return (
    <>
      {/* The scroll runway. Nothing is drawn here; it only gives the page the
          distance the state machine reads. */}
      <div
        className="runway"
        style={{ height: stageHeight(entries.length) }}
        aria-hidden
      />

      <div className="fixed-layer">
        {/* A ground for the header. Without it the wordmark and nav sit
            directly on whatever image is passing underneath. */}
        <span className="bar" aria-hidden />
        <Link className="mark" href="/">
          <span className="mark__italic accent-cools">Alex</span> Purdie
        </Link>

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

        <p className="statement">
          <span className="statement__line" style={{ "--d": 0 } as React.CSSProperties}>
            <em>Empowering</em>
          </span>
          <span className="statement__line" style={{ "--d": 1 } as React.CSSProperties}>
            <em>
              embodied <span className="accent-cools">lives</span>
            </em>
          </span>
          <span className="statement__line" style={{ "--d": 2 } as React.CSSProperties}>
            on and off screen
          </span>
        </p>

        <div className="standing">
          <p className="ui">{SITE.currently}</p>
          <p className="status ui">
            <span className="status__dot" aria-hidden />
            {SITE.status}
          </p>
        </div>

        <p className="tagline ui">{SITE.tagline}</p>
        <p className="email ui">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
        <Clock className="clock ui" />
      </div>

      <main id="main" className="board">
        <div className="grid board__row">
          <div className="board__media">
            {/* Three frames per case study, cross-fading in place. Until real
                imagery exists these are identical blocks, so the counter in the
                details is what makes the change legible. */}
            {Array.from({ length: IMAGES_PER_CASE }, (_, i) => (
              <span
                key={i}
                className="board__frame"
                data-on={i === imageIndex || undefined}
                aria-hidden
              />
            ))}
            <span className="sr-only">
              {meta.title}, image {imageIndex + 1} of {IMAGES_PER_CASE}
            </span>

            {/* Pagination for the frames, over the bottom of the image. Dots
                rather than a fraction, because there are only ever three and a
                shape is read faster than a number. */}
            <span className="dots" aria-hidden>
              {Array.from({ length: IMAGES_PER_CASE }, (_, i) => (
                <span key={i} className="dot" data-on={i === imageIndex || undefined} />
              ))}
            </span>
          </div>

          <div className="board__meta" data-settled={settled || undefined}>
          <div className="board__details">
            <p className="board__index ui" aria-hidden>
              {String(shown + 1).padStart(2, "0")} /{" "}
              {String(entries.length).padStart(2, "0")}
            </p>
            <p className="row__disciplines ui">
              {discs.map((d) => `[${d.toUpperCase()}]`).join(" ")}
            </p>
            <h1 className="row__title">
              <Link href={`/work/${meta.slug}`}>{meta.title}</Link>
            </h1>
            <p className="row__summary">{meta.subtitle}</p>

            <p className="row__cta ui">
              <Link href={`/work/${meta.slug}`}>
                Learn More <span aria-hidden>→</span>
              </Link>
            </p>
            </div>
          </div>
        </div>

        {/* In the gap between the images: a way past the remaining frames.
            Three images is a lot to scroll through to reach the next project,
            and the counter tells you how many are left but not how to skip
            them. */}
        <div className="grid board__skip">
          <p className="board__skipInner">
            <button
              type="button"
              className="skip ui"
              onClick={() =>
                window.scrollTo({
                  top: scrollForCase(
                    (caseIndex + 1) % Math.max(1, entries.length),
                  ),
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "auto"
                    : "smooth",
                })
              }
            >
              Next case study <span aria-hidden>↓</span>
            </button>
          </p>
        </div>

        {/* The next case study, showing above the fold. Figma 64:175 puts the
            second image at y=949 against a first that ends at 869 — so what you
            see is the top edge of what is coming, which is what tells you there
            is more. */}
        <div className="grid board__row board__row--peek" aria-hidden>
          <div className="board__media board__media--peek">
            <span className="board__frame" data-on />
          </div>
        </div>
      </main>
    </>
  );
}
