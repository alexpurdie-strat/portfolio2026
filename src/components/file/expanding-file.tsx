"use client";

import { useId, useState } from "react";

import { Divider } from "@/components/file/divider";
import { SECTIONS, type Section } from "@/content/file";
import { asset } from "@/lib/asset";
import { handChar } from "@/content/desk";

/*
 * The expanding file.
 *
 * One section open at a time, the way a finger in a file works — opening one
 * closes the last. Underneath the kraft this is a disclosure pattern and
 * nothing more exotic: each tab is a button carrying aria-expanded and the
 * name of the section, and the pocket it controls is a region. A screen reader
 * gets a four-item list of sections; the skeuomorphism is paint.
 *
 * Contents are placeholders. What belongs in each is settled — a sticky note
 * for contact, a printed sheet for the resume, a photo and a lined note for
 * about, cards to shuffle for the work — but the copy is not written, and
 * baking in lorem would be worse than showing the shape honestly.
 */

/* The same hand as the desk's post-its: four cuts of The Blank Weirdos, picked
   per character, so the tabs are written rather than typed. */
function Hand({ id, lines }: { id: string; lines: string[] }) {
  return (
    <span className="file__hand">
      {lines.map((line, i) => (
        <span key={i} className="file__hand-line">
          {[...line].map((ch, j) => {
            const h = handChar(id, i, j, ch);
            return (
              <span
                key={j}
                style={{
                  fontFamily: h.font,
                  letterSpacing: `${h.tracking}em`,
                  verticalAlign: `${h.lift}em`,
                }}
              >
                {ch === " " ? " " : ch}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

/* What rises out of a pocket. Placeholder shapes at the right size, so the
   composition can be judged before the copy exists. */
function Contents({ section }: { section: Section }) {
  if (section.kind === "cards") {
    return (
      <div className="file__cards">
        <button type="button" className="file__arrow" aria-label="Previous">
          ←
        </button>
        <div className="file__card-stack">
          <span className="file__card file__card--back" aria-hidden />
          <span className="file__card file__card--mid" aria-hidden />
          <span className="file__card">
            <span className="file__placeholder">Case study</span>
          </span>
        </div>
        <button type="button" className="file__arrow" aria-label="Next">
          →
        </button>
      </div>
    );
  }

  if (section.kind === "about") {
    return (
      <div className="file__about">
        <span className="file__photo" aria-hidden />
        <span className="file__lined">
          <span className="file__placeholder">About</span>
        </span>
      </div>
    );
  }

  if (section.kind === "note") {
    return (
      <span className="file__sticky">
        <span className="file__placeholder">Contact</span>
      </span>
    );
  }

  return (
    <span className="file__sheet">
      <span className="file__placeholder">Resume</span>
    </span>
  );
}

export function ExpandingFile() {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();

  return (
    <div className="file">
      <div className="file__body">
        <ul className="file__sections">
          {SECTIONS.map((s, i) => {
            const isOpen = open === s.id;
            const panelId = `${uid}-${s.id}`;
            return (
              <li
                key={s.id}
                className="file__section"
                data-open={isOpen || undefined}
                /*
                 * Reversed on purpose. Folders higher up the stack are nearer
                 * the front, so the first one has to cover the work sticking
                 * out of the second — not the other way round.
                 */
                style={{ zIndex: SECTIONS.length - i }}
              >
                {/* Already in the folder, before anything is opened. This is
                    the read of the whole thing: a file full of work. */}
                <div className="file__peek" aria-hidden>
                  {s.peek.map((pk) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={pk.src}
                      alt=""
                      src={asset(pk.src)}
                      style={{
                        width: `${pk.w}%`,
                        left: `${pk.x}%`,
                        rotate: `${pk.rotate}deg`,
                      }}
                    />
                  ))}
                </div>

                {/* The contents rise from behind the divider in front of them,
                    so the paper is always between two panels. */}
                <div
                  className="file__pocket"
                  id={panelId}
                  role="region"
                  aria-label={s.label.join(" ")}
                  hidden={!isOpen}
                >
                  <Contents section={s} />
                  <p className="file__blurb">{s.blurb}</p>
                </div>

                <button
                  type="button"
                  className="file__tab"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : s.id)}
                >
                  <Divider tab={s.tab} stock={s.stock} className="file__divider">
                    <span
                      className="file__label"
                      style={{ left: `${s.tab * 66.7}%` }}
                    >
                      <Hand id={s.id} lines={s.label} />
                    </span>
                  </Divider>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
