"use client";

import { useId, useState } from "react";

import { StampLink } from "@/components/stamp-link";

import {
  ARCHIVE,
  ENTRY_BY_MARK,
  MARK_NAMES,
  MARK_ORDER,
  type ArchiveEntry,
} from "@/content/archive";
import { asset } from "@/lib/asset";
import { Todo } from "@/components/todo";

/*
 * The archive wall.
 *
 * Implemented from Figma: Portfolio Moodboard, 111:3227. Twenty client marks on
 * the right, one description on the left, and the description is whichever mark
 * you are pointing at.
 *
 * Three things about the interaction that the frame cannot show.
 *
 * The active entry is sticky. Moving the pointer off the wall does not clear
 * it — a panel that empties when you stop pointing at something means you can
 * never read what you just revealed, because reading it requires looking away.
 *
 * Focus does what hover does. A keyboard tabbing through the marks drives the
 * panel exactly as a pointer does, which is the only way this pattern works
 * without a mouse.
 *
 * A mark that leads somewhere is a link and does the CTA's job; a mark that
 * leads nowhere is a button that only changes the panel. The links go through
 * StampLink so they raise the drawer, which is how every other route change on
 * this site happens.
 */

function Mark({
  mark,
  entry,
  active,
  onActivate,
}: {
  mark: string;
  entry: ArchiveEntry;
  active: boolean;
  onActivate: () => void;
}) {
  const name = MARK_NAMES[mark] ?? mark;

  /*
   * Both cuts are in the DOM and cross-fade, rather than one src swapping. A
   * swap fetches the colored file at the moment of the hover, which is the one
   * moment it must not be fetched — the first pass over a mark would show
   * nothing where the logo was. Stacked, both are already decoded.
   *
   * eslint-disable: next/image wants dimensions it cannot infer from a string
   * path, and `images.unoptimized` means it would emit these same tags anyway.
   */
  const cuts = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="wall__mono"
        src={asset(`/logos/${mark}.svg`)}
        alt=""
        width={141}
        height={141}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="wall__color"
        src={asset(`/logos/colored/${mark}.svg`)}
        alt=""
        width={141}
        height={141}
        loading="lazy"
      />
    </>
  );

  /* Pointer and keyboard drive the same state, whichever element this is. */
  const reacts = { onMouseEnter: onActivate, onFocus: onActivate };

  /*
   * A mark that leads somewhere is a link, and the whole mark is the target —
   * it does the job the Learn More CTA does, so it has to be a real link with a
   * real href rather than a button that navigates. Marks with nowhere to go
   * stay buttons: their only job is to change the panel.
   */
  if (entry.href) {
    const label = entry.external
      ? `${name} — read about this work on the old portfolio`
      : `${name} — read the case study`;
    return entry.external ? (
      <a
        className="wall__mark"
        href={entry.href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        data-active={active || undefined}
        {...reacts}
      >
        {cuts}
      </a>
    ) : (
      /* StampLink, not Link: the drawer carrying the client's stamp is how
         every other route change on this site happens, and a plain link
         navigates straight past it. `slug` is the entry id, which for the five
         written case studies is the work slug the stamp is filed under. */
      <StampLink
        className="wall__mark"
        href={entry.href}
        slug={entry.id}
        aria-label={label}
        data-active={active || undefined}
        {...reacts}
      >
        {cuts}
      </StampLink>
    );
  }

  return (
    <button
      type="button"
      className="wall__mark"
      data-active={active || undefined}
      aria-pressed={active}
      onClick={onActivate}
      {...reacts}
    >
      <span className="sr-only">{name}</span>
      {cuts}
    </button>
  );
}

function Panel({ entry, id }: { entry: ArchiveEntry; id: string }) {
  return (
    /*
     * Polite rather than assertive, and on the panel rather than on each field:
     * a keyboard user hears the mark's name from the button, then the entry
     * that name just revealed. Assertive would interrupt the button's own name
     * to do it.
     */
    <div className="panel" id={id} aria-live="polite">
      <p className="panel__disciplines ui">
        {entry.disciplines.map((d) => (
          <span key={d} className="panel__discipline">
            {d}
          </span>
        ))}
      </p>

      {/*
        Keyed on the entry so React replaces these nodes instead of mutating
        them, which is what lets the fade restart on every change.
      */}
      <div className="panel__body" key={entry.id}>
        <p className="panel__client">{entry.client}</p>
        <p className="panel__brief">{entry.brief}</p>
        {entry.work ? (
          <p className="panel__work">{entry.work}</p>
        ) : (
          <Todo>
            {entry.client} has a mark in the wall and a one-line entry in
            docs/project-inventory.md, but nothing written about the work
            itself. Needs a paragraph, or the mark comes out.
          </Todo>
        )}
      </div>

      {/*
        A CTA is a promise, so only entries that lead somewhere get one.

        Off-site links are a different promise and say so: a diagonal arrow
        rather than a straight one, a new tab, and the destination named in the
        label. Without the last part the two CTAs read identically and the
        reader only finds out they have left the site after they have.
      */}
      {entry.href ? (
        entry.external ? (
          <a
            className="panel__cta ui"
            href={entry.href}
            target="_blank"
            rel="noreferrer"
          >
            Learn More
            <span className="panel__cta-where">on the old portfolio</span>
            <span aria-hidden>↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <StampLink className="panel__cta ui" href={entry.href} slug={entry.id}>
            Learn More
            <span aria-hidden>→</span>
          </StampLink>
        )
      ) : null}
    </div>
  );
}

export function ArchiveWall() {
  /* The frame opens on the first mark in the wall rather than on empty space. */
  const [activeId, setActiveId] = useState(ARCHIVE[0].id);
  const panelId = useId();

  const entry = ARCHIVE.find((e) => e.id === activeId) ?? ARCHIVE[0];
  /* A set, because three marks can be lit at once — see the LEGO × TED entry. */
  const lit = new Set(entry.marks);

  return (
    <div className="archive">
      <Panel entry={entry} id={panelId} />

      {/*
        A group rather than a list: the wall is one control with twenty
        switches, and announcing "list, 20 items" over the top of that describes
        the layout instead of the thing.
      */}
      <div
        className="wall"
        role="group"
        aria-label="Clients"
        aria-controls={panelId}
      >
        {MARK_ORDER.map((mark) => (
          <Mark
            key={mark}
            mark={mark}
            entry={ENTRY_BY_MARK[mark]}
            active={lit.has(mark)}
            onActivate={() => setActiveId(ENTRY_BY_MARK[mark].id)}
          />
        ))}
      </div>
    </div>
  );
}
