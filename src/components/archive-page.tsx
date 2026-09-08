import Image from "next/image";
import { MarginNote } from "@/components/margin-note";
import { PageMasthead } from "@/components/page-masthead";
import { Register } from "@/components/register";
import { ENTRIES } from "@/content/work";

/**
 * Archive.
 *
 * The masthead used to be a canvas holding the Figma frame's composition —
 * torn band over torn band, with the paper stack bleeding off the left edge.
 * It came out so this page opens the same way as Approach, About and Ask:
 * a title on the paper, beneath the one torn band the site already has.
 *
 * The entries are registers in normal flow. The frame designed two of them at
 * absolute positions on a 1418-wide canvas; six cannot live that way, and
 * below about 1000px the absolute placement collided with itself because
 * positions scale with the canvas while reading type is clamped. Flow cannot
 * overlap, takes any number of entries, and is what the design system
 * prescribes for anything enumerable.
 */
export function ArchivePage() {
  return (
    <main id="main" className="page">
      <PageMasthead eyebrow="What backs it up" title="Archive." />

      {/* Lifted clear of the first register's own note — both live in column
          9, and this one anchors just above the list. */}
      <MarginNote surface="sheet" tilt={3.4} nudge={-5.5}>
        → Reminder: S. has dance class Monday @ 5 — finish up early
      </MarginNote>

      <ol className="registers">
        {ENTRIES.map((entry) => (
          <Register
            key={entry.slug}
            mark={entry.ref}
            eyebrow={
              <>
                {/* The seam is a deliberate glitch — unrendered markup shown
                    as itself. Read aloud it becomes "class equals quote
                    company quote greater than", so the decorative form is
                    hidden and a plain twin carries the meaning. */}
                <span aria-hidden translate="no">
                  {`<class="company">${entry.client}>`}
                </span>
                <span className="sr-only">Client: {entry.client}</span>
              </>
            }
            title={entry.quality}
            href={`/archive/${entry.slug}`}
            note={entry.note}
            aside={
              entry.plates.length ? (
                <div className="plates">
                  {/* Three at most. The archive is an index — the whole set
                      is on the case study, and six overlapping cutouts in a
                      register row is a pile, not a thumbnail. */}
                  {entry.plates.slice(0, 3).map((pl) => (
                    <span className="plate" key={pl.src}>
                      <Image
                        src={pl.src}
                        alt={pl.alt}
                        width={pl.width}
                        height={pl.height}
                        sizes="(max-width: 700px) 40vw, 15vw"
                      />
                    </span>
                  ))}
                </div>
              ) : null
            }
          >
            {entry.title ? (
              <p className="register__lead">{entry.title}</p>
            ) : null}
            {entry.standfirst ? <p>{entry.standfirst}</p> : null}
            {entry.tags.length ? (
              <pre className="source">
                {["---", "tags:", ...entry.tags.map((t) => ` - ${t}`)].join(
                  "\n",
                )}
              </pre>
            ) : null}
          </Register>
        ))}
      </ol>
    </main>
  );
}
