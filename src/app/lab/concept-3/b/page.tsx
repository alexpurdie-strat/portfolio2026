import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Metadata } from "next";
import Link from "next/link";

import { Decode } from "@/components/lab/decode";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { LIST, ROLE } from "@/content/lab-index";
import { SITE } from "@/content/site";

import { funnelDisplay, funnelSans, martianMono } from "../fonts";
import { Rows } from "./rows";
import { SourceField } from "./source-field";
import "./b.css";

export const metadata: Metadata = {
  title: "Lab — concept 3B, the source",
  description:
    "Concept 3B: a black page where every label is shown as the source it was written from, and resolves into the finished line.",
  robots: { index: false, follow: false },
};

/*
 * Lead reference: Sebastiaan Scheer (sebastiaanscheer.com), measured at 1440 —
 * the name at full width in heavy type on black, 10-11px uppercase labels, a
 * content column starting a third of the way across, statements at 30px.
 * Detail from Visual Domain: condensed display set to the viewport's width.
 *
 * The one idea is the seam between source and output. Every label is written
 * the way it sits in the code, and decodes into place: the method, shown.
 *
 * Display is Funnel Display, text and the italic run Funnel Sans, against
 * Martian Mono: the finished page and its source.
 */
/*
 * Texture, three layers, each with a reason:
 *
 * · The source field. Behind the whole page, the source that makes it (the
 *   page, its rows, the decode, the data, the styles), read from disk at
 *   build time and set in the mono at a few percent. Everything finished
 *   stands on the code that draws it. Now and then a line on screen breaks
 *   into glyphs and decodes back: the page, quietly rewriting itself.
 * · The guides. The margins and the meta column's edge, drawn full height as
 *   hairlines: the system under the page, left visible. The source and
 *   title columns share one field, so the code can run under both.
 * · Grain. Craftwork's Noise Texture, fixed over everything, lightened for a
 *   black ground. Surface, not content.
 */
const SOURCE = [
  "src/app/lab/concept-3/b/page.tsx",
  "src/app/lab/concept-3/b/rows.tsx",
  "src/components/lab/decode.tsx",
  "src/content/lab-index.ts",
  "src/components/ui/marquee.tsx",
  "src/app/lab/concept-3/b/b.css",
]
  .map((f) => readFileSync(join(process.cwd(), f), "utf8"))
  .join("\n");

export default function ConceptB() {
  return (
    <div className={`cb ${martianMono.variable} ${funnelDisplay.variable} ${funnelSans.variable}`}>
      <SourceField text={SOURCE} />
      <div className="cb-guides" aria-hidden="true">
        <span />
        <span />
      </div>
      <NoiseTexture
        className="cb-grain"
        frequency={0.85}
        octaves={3}
        slope={1.1}
        noiseOpacity={1}
      />
      <header className="cb-bar cb-mono">
        <Link className="cb-link" href="/">
          {SITE.name}
        </Link>
        <span>{ROLE}</span>
        <span>Chattanooga, TN</span>
        <a className="cb-link" href={`mailto:${SITE.email}`}>
          Email
        </a>
      </header>

      <main id="main">
        <section className="cb-hero">
          <h1 className="cb-name">Alex Purdie</h1>
          <div className="cb-split">
            <Decode
              className="cb-mono cb-muted"
              text={`role: "${ROLE.toLowerCase()}"`}
              duration={900}
            />
            <p className="cb-statement">
              A design generalist first, and still hands-on: I design platforms
              where software meets people doing real work, and the{" "}
              <em>systems</em> that keep them coherent.
            </p>
          </div>
        </section>

        <section className="cb-section" aria-labelledby="cb-work">
          <h2 id="cb-work" className="cb-label cb-mono cb-muted">
            <Decode text="// work" />
          </h2>
          <Rows rows={LIST} />
        </section>

        <section className="cb-section cb-split" aria-labelledby="cb-about">
          <h2 id="cb-about" className="cb-mono cb-muted">
            <Decode text="// about" />
          </h2>
          <p className="cb-statement">
            Lead platform strategist at Whiteboard. Before that, Head of Product
            Design at 100 Shapes, where I led the design system behind ITV
            Studios Portal. Underneath the strategy is a generalist&rsquo;s
            hand: brand, visual and interface work for clients from TED to
            Chick-fil-A, made, not just directed.
          </p>
        </section>
      </main>

      <footer className="cb-foot">
        <div className="cb-split">
          <span className="cb-mono cb-muted">
            <Decode text="// ask" />
          </span>
          <a className="cb-mail" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </div>
        <div className="cb-bar cb-mono cb-foot__base">
          <a className="cb-link" href={SITE.linkedin}>
            LinkedIn
          </a>
          <span>Chattanooga, TN</span>
          <span>2026</span>
        </div>
      </footer>
    </div>
  );
}
