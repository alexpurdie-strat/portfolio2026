"use client";

import { useState } from "react";

import { asset } from "@/lib/asset";

/*
 * A stack of folders, cut from one photograph of a single closed one.
 *
 * Each folder is two halves. The back is the whole thing, tab included — on a
 * real folder the tab belongs to the back, which is why it stands above the
 * front when the thing is shut. The front is cut AWAY under the tab, so its
 * top edge is the tab's inverse: 14.9% of the height beneath it and 9.4%
 * beside it, both traced off the photograph column by column. Cutting that
 * edge flat leaves a band of back leaf on the front half, and that band
 * carries the tab's outline, so the flap tips forward with a tab printed on
 * its face.
 *
 * The three tab positions are composited, not photographed. The tab is lifted
 * off the original as a patch, the folder beneath it is rebuilt with no tab at
 * all, and the patch goes back down wherever it is wanted. Its left side is
 * the folder's own edge so it carries only one diagonal; mirroring it supplies
 * the other, which is what makes a centre cut possible from a left-cut
 * photograph.
 */

type Leaf = "left" | "center" | "right";

const STACK: { id: string; cut: Leaf; label: string }[] = [
  /* Back to front. There are only three cuts in a box, so with four folders
     one position repeats — but never on neighbours, or the two tabs sit in a
     column and read as one piece of card. */
  { id: "about", cut: "right", label: "About" },
  { id: "resume", cut: "center", label: "Experience" },
  { id: "work", cut: "left", label: "Work" },
  { id: "contact", cut: "center", label: "Contact" },
];

/* The desk's own work, guillotined rather than torn — paper that has been
   filed has a cut edge. */
const PAPERS = [
  { src: "/file/sheet-jafp.webp", w: 84, x: 8, y: 7, rotate: -2 },
  { src: "/file/sheet-itvs.webp", w: 80, x: 13, y: 16, rotate: 1.6 },
];

export function Folder() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="file__stack">
      {STACK.map((f, i) => {
        const isOpen = open === f.id;
        return (
          <button
            key={f.id}
            type="button"
            className="file__folder"
            data-open={isOpen || undefined}
            aria-expanded={isOpen}
            /* Later folders are nearer the front and sit lower in the stack. */
            style={{ zIndex: i + 1, top: `${i * 46}px` }}
            onClick={() => setOpen(isOpen ? null : f.id)}
          >
            <span className="sr-only">{f.label}</span>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              aria-hidden
              className="file__leaf file__leaf--back"
              src={asset(`/file/folder-${f.cut}-back.webp`)}
              width={998}
              height={712}
            />

            {/* Between the halves, which is the only reason it reads as inside
                the folder rather than lying on it. */}
            <span className="file__papers" aria-hidden>
              {PAPERS.map((p) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={p.src}
                  alt=""
                  src={asset(p.src)}
                  style={{
                    width: `${p.w}%`,
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    rotate: `${p.rotate}deg`,
                  }}
                />
              ))}
            </span>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              aria-hidden
              className="file__leaf file__leaf--front"
              src={asset(`/file/folder-${f.cut}-front.webp`)}
              width={998}
              height={712}
            />
          </button>
        );
      })}
    </div>
  );
}
