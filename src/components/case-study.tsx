import Link from "next/link";
import { MarginNote } from "@/components/margin-note";
import { PageMasthead } from "@/components/page-masthead";
import { PlatePile } from "@/components/plate-pile";
import type { Entry } from "@/content/work";

/**
 * A case study. The quality is the headline and the client is the evidence for
 * it, so the masthead leads with the quality and files the client beneath.
 *
 * Entries with no source material render honestly rather than with filler: the
 * front matter reports `status: draft` and the margin says what is missing.
 */
export function CaseStudy({ entry }: { entry: Entry }) {
  const frontMatter = [
    "---",
    `ref: ${entry.ref}`,
    `quality: ${entry.quality.toLowerCase()}`,
    `client: ${entry.client}`,
    `role: ${entry.role ?? "~"}`,
    `year: ${entry.year ?? "~"}`,
    `status: ${entry.status === "written" ? "published" : "draft"}`,
    entry.tags.length ? "tags:" : null,
    ...entry.tags.map((t) => ` - ${t}`),
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <main id="main" className="page">
      <PageMasthead
        eyebrow={`${entry.ref} · ${entry.client}`}
        title={`${entry.quality}.`}
        standfirst={entry.title || undefined}
      />

      {/* On a phone the two columns collapse to one and the plates interleave
          with the writing, so evidence arrives beside the claim it supports
          rather than after all of it. Both wrappers become `display: contents`
          below 1080px and these order values do the weaving. */}
      <div className="case">
        <div className="case__prose">
          {entry.standfirst ? (
            <p className="page__lede" data-frame="Summary">
              {entry.standfirst}
            </p>
          ) : null}

          {entry.quote ? (
            <blockquote className="page__quote" data-frame="Testimony">
              <p>&ldquo;{entry.quote.text}&rdquo;</p>
              <footer>
                <span aria-hidden translate="no">
                  {`<class="source">${entry.quote.source}>`}
                </span>
                <span className="sr-only">Source: {entry.quote.source}</span>
              </footer>
            </blockquote>
          ) : null}

          {entry.body.map((para, i) => (
            <p
              key={para.slice(0, 32)}
              /* Only the first paragraph opens a frame: the account is one
                 stretch of film, not one frame per paragraph. */
              data-frame={i === 0 ? "Account" : undefined}
            >
              {para}
            </p>
          ))}

          {entry.status === "unwritten" ? (
            <p className="page__lede page__lede--empty">
              Currently being written up.
            </p>
          ) : null}

          {entry.metrics.length ? (
            <>
              <h2 className="page__subhead" data-frame="What it moved">
                What it moved
              </h2>
              <ul className="metrics">
                {entry.metrics.map((m) => (
                  <li key={m.of}>
                    <span className="metrics__value" data-value={m.value}>
                      {m.value}
                    </span>
                    <span className="metrics__of">{m.of}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {entry.disciplines.length ? (
            <>
              <h2 className="page__subhead" data-frame="Disciplines">
                Disciplines
              </h2>
              <p>{entry.disciplines.join(" · ")}</p>
            </>
          ) : null}

          <h2 className="page__subhead" data-frame="Front matter">
            Front matter
          </h2>
          <pre className="source" translate="no">
            {frontMatter}
          </pre>

          <p className="page__outro" data-frame="End of reel">
            <Link className="text-button" href="/archive">
              <span aria-hidden>←</span> Back to the archive
            </Link>
          </p>

          {/* The note used to sit at the top of the right-hand lane, which is
              the plates' lane — it forced the whole stack down the page to
              clear it. Down here it comments on the writing it belongs to and
              occupies the empty lower-left, which nothing else wants. */}
          {entry.note ? (
            <MarginNote lane="grid" tilt={-1.6} nudge={1.5}>
              {entry.note}
            </MarginNote>
          ) : null}
        </div>

        <PlatePile plates={entry.plates} />
      </div>
    </main>
  );
}
