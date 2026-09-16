import type { Metadata } from "next";
import Link from "next/link";

import { AsciiImage } from "@/components/lab/ascii-image";
import { PixelField } from "@/components/lab/pixel-field";
import { Clock } from "@/components/clock";
import { SITE } from "@/content/site";
import { WORK } from "@/content/work";
import { asset } from "@/lib/asset";

import "./lab.css";

export const metadata: Metadata = {
  title: "Lab — artful digitization",
  description:
    "An experimental visual direction: photographs rendered as type, a cursor that thickens what it passes over, and full-fidelity imagery kept for the work itself.",
  /* A spike, not a page. Nothing should index it or follow it anywhere. */
  robots: { index: false, follow: false },
};

/*
 * Implemented from Figma: Portfolio Moodboard, 130:3544 ("Desktop - 6").
 *
 * This route shares no styling with the rest of the site — see the note at the
 * top of lab.css. It reuses the real content registry rather than lorem, so
 * what is being judged is the direction against actual titles and actual
 * imagery, which is the only way to tell whether it survives contact with the
 * work.
 *
 * The four disciplines the frame shows are not in the registry, so they are
 * derived here from the work itself rather than invented for the layout.
 */

const DISCIPLINES: Record<string, string[]> = {
  "ja-finance-park": ["Strategy", "Product", "Service design"],
  "itv-studios-portal": ["Systems", "Design systems", "Governance"],
  "your-move": ["Strategy", "Prototyping", "Research"],
  "100-shapes": ["Leadership", "Practice", "Hiring"],
  "home-depot": ["Enterprise", "Service design", "Research"],
};

/* The frame's three fanned cards. Taken from the site's own anti-positioning —
   the one piece of copy that already comes in three parts and is about who the
   work is for. */
const CARDS = [
  {
    title: "Going zero to one",
    body: "If you are navigating a new business unit, or a new venture entirely, or breaking into a market nobody in the building has sold to yet.",
  },
  {
    title: "Scaling from one to N",
    body: "If you have found product/market fit and the problem has turned into holding a bar across more teams than one person can sit in a room with.",
  },
  {
    title: "Deciding what to build",
    body: "If you want someone to help decide what to build, and then hold the bar while it ships. That is the work I am for.",
  },
];

/* The frame's ASCII subject is a figure. This is the closest real photograph in
   the repo — a student holding the Finance Park tablet in a room — and the
   component takes any src, so it is a one-line swap. */
const PORTRAIT = {
  src: "/work/ja-finance-park/storefront-in-room.webp",
  alt: "A tablet held up in front of a real storefront inside a Finance Park facility, showing that storefront unlocked.",
  /* The file is a two-panel composite; only the left panel is a photograph.
     The right panel is flat product art and renders as a solid block of the
     densest glyph, which reads as a bug rather than as an image. */
  crop: { x: 0, y: 0, w: 0.495, h: 1 },
};

export default function LabPage() {
  const rows = WORK.slice(0, 4);

  return (
    <div className="lab">
      <div className="lab__wrap">
        <header className="lab-mast">
          <Link className="lab-mast__name" href="/">
            {SITE.name}
          </Link>
          {/* Every link the finished IA has, not the gated subset the live
              site ships — this is a concept of the whole thing. */}
          <nav className="lab-nav" aria-label="Primary">
            {SITE.navAll.map((item, i) => (
              <span key={item.href} className="lab-nav__item">
                {i > 0 ? (
                  <span className="lab-nav__slash" aria-hidden>
                    {" / "}
                  </span>
                ) : null}
                <Link href={item.href}>{item.label}</Link>
              </span>
            ))}
          </nav>
        </header>

        <section className="lab-hero">
          <PixelField className="lab-hero__field" />
          <AsciiImage
            className="lab-hero__portrait"
            src={PORTRAIT.src}
            alt={PORTRAIT.alt}
            crop={PORTRAIT.crop}
          />

          <h1 className="lab-statement">
            {SITE.statementLead.split(" ")[0]}{" "}
            <em>embodied lives</em> {SITE.statementTail}.
          </h1>

          <div className="lab-standing">
            <Clock />
            <div className="lab-standing__right">
              <p>{SITE.currently}</p>
              <p className="lab-status">
                <span className="lab-status__dot" aria-hidden />
                {SITE.status}
              </p>
            </div>
          </div>
        </section>

        <section className="lab-reprise" aria-hidden>
          <p className="lab-reprise__line">
            {SITE.statementLead} {SITE.statementTail}
          </p>
          <div className="lab-standing__right">
            <p>{SITE.currently}</p>
            <p className="lab-status">
              <span className="lab-status__dot" />
              {SITE.status}
            </p>
          </div>
        </section>

        <section className="lab-cards">
          {CARDS.map((card, i) => (
            <article
              key={card.title}
              className={`lab-card${i === 1 ? " lab-card--ember" : ""}`}
            >
              <span className="lab-card__mark" aria-hidden />
              <div>
                <h2 className="lab-card__title">{card.title}</h2>
                <p className="lab-card__body">{card.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="lab-rows">
          {rows.map((w) => {
            const image = w.meta.images?.[0];
            return (
              <article className="lab-row" key={w.meta.slug}>
                <div className="lab-row__media">
                  {image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img alt={image.alt} src={asset(image.src)} width={850} height={588} />
                  ) : null}
                </div>
                <div className="lab-row__meta">
                  <div>
                    <p className="lab-row__disciplines">
                      {(DISCIPLINES[w.meta.slug] ?? []).join(" // ")}
                    </p>
                    <h2 className="lab-row__title">{w.meta.title}</h2>
                    <p className="lab-row__body">{w.meta.subtitle}</p>
                  </div>
                  <Link
                    className="lab-row__cta"
                    href={`/work/${w.meta.slug}/`}
                  >
                    <span>Learn More</span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
