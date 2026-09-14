import type { Metadata } from "next";

import { PageMast } from "@/components/page-mast";
import { SITE } from "@/content/site";
import { asset } from "@/lib/asset";

const C = SITE.contact;

export const metadata: Metadata = {
  title: "Contact — Alex Purdie",
  description: `Get in touch with Alex Purdie — ${SITE.email}, or ${SITE.phone}.`,
  alternates: { canonical: "/contact" },
};

/*
 * Implemented from Figma: Portfolio Moodboard, 113:2772 ("contact concept").
 *
 * Same skeleton as the archive: masthead, a 160px title, then a left column on
 * the grid with a square of image opposite it. Three labeled channels rather
 * than a form — there is no server behind this site, so a form would either be
 * a lie or a third-party embed, and the frame does not ask for one.
 */
export default function ContactPage() {
  return (
    <main id="main" className="contact-page">
      <PageMast />

      {/* Two colors, so two elements. The accent lands on the verb. */}
      <h1 className="contact-title">
        {C.titleLead} <span className="contact-title__accent">{C.titleTail}</span>
      </h1>

      <div className="channels">
        <section className="channel">
          <h2 className="channel__label ui">{C.labels.phone}</h2>
          <p className="channel__value">
            {/* Digits stripped for the href so a phone can dial it; the visible
                string keeps the dots the frame sets it with. */}
            <a href={`tel:${SITE.phone.replace(/\D/g, "")}`}>{SITE.phone}</a>
          </p>
          <p className="channel__note">{C.phoneNote}</p>
        </section>

        <section className="channel">
          <h2 className="channel__label ui">{C.labels.email}</h2>
          <p className="channel__value">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </section>

        <section className="channel channel--wide">
          <h2 className="channel__label ui">{C.labels.linkedin}</h2>
          <p className="channel__value">
            {/* The frame prints the URL rather than a label, so the link text
                is the URL — and it has to be able to break, or it pushes the
                page sideways on a narrow screen. */}
            <a
              className="channel__url"
              href={SITE.linkedin}
              rel="me noreferrer"
              target="_blank"
            >
              {SITE.linkedin}
            </a>
          </p>
        </section>
      </div>

      {/*
        Luminosity, not a grayscale filter. The frame blends the photograph
        against the page, so it takes the paper's warmth instead of going
        neutral gray — which is the difference between a black-and-white
        photograph and one that belongs to this particular sheet of paper.

        eslint-disable: next/image cannot infer dimensions from a string path,
        and `images.unoptimized` means it would emit this same tag anyway.
      */}
      {/*
        Figure, not a bare image: the caption is a comment on the photograph
        rather than a line of page copy, and a reader arriving at it out of
        order should get the two as one thing.
      */}
      <figure className="portrait">
        {/* `alt` stays on the opening line: the hygiene gate reads line by
            line, so an alt attribute wrapped onto its own line is an alt
            attribute the gate cannot see. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={C.portrait.alt}
          className="portrait__img"
          src={asset(C.portrait.src)}
          width={566}
          height={566}
        />
        <figcaption className="portrait__caption">
          {C.portrait.caption}
        </figcaption>
      </figure>
    </main>
  );
}
