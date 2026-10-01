"use client";

import { useState } from "react";

import { asset } from "@/lib/asset";

/*
 * A folder that opens, cut from one photograph of a closed one.
 *
 * Two halves, both cut from the same picture.
 *
 * The back half is the whole folder, tab included — on a real folder the tab
 * belongs to the back, which is exactly why it stands above the front when the
 * thing is shut. The front half is the body only: a straight top edge at the
 * shoulder and no tab at all, hinged on its foot. Papers go between them.
 *
 * Giving the tab to the front half is what produced the glitch: it swung away
 * with the leaf and the back's own tab appeared behind it, so the folder
 * opened to show a tab that was never the one you had been looking at.
 *
 * Both were cut at 4x and brought back down so the die and the keyed ground
 * land with sub-pixel edges. A CSS clip-path did this before and the diagonal
 * came out ragged; and the first key thresholded every pixel independently,
 * which punched holes in the pale patches inside the card. The ground is
 * flooded in from the corners now, so nothing enclosed by the folder is ever
 * touched.
 *
 * The shoulder is measured, not guessed: it reads at 5.3% of the height. The
 * 9.7% used before was the fold score, a different line further down.
 */

/*
 * What is in it: the desk's own work, guillotined rather than torn.
 *
 * The desk's cutouts have ragged edges because they were ripped out of
 * something. Paper that has been filed has a cut edge, and the torn rim read
 * as damage once it was sitting inside a crisp folder.
 *
 * The ITV one is the untorn original rather than a trimmed cutout — its tear
 * runs through the middle of the image, so no crop was going to fix it.
 */
const PAPERS = [
  { src: "/file/sheet-jafp.webp", w: 84, x: 8, y: 7, rotate: -2 },
  { src: "/file/sheet-itvs.webp", w: 80, x: 13, y: 16, rotate: 1.6 },
];

export function Folder() {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      className="file__folder"
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
    >
      <span className="sr-only">
        {open ? "Close the folder" : "Open the folder"}
      </span>

      {/* The back leaf: the whole photograph, never moving. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        aria-hidden
        className="file__leaf file__leaf--back"
        src={asset("/file/folder-back.webp")}
        width={998}
        height={712}
      />

      {/* Between the leaves. Sits above the back and below the front, which is
          the only reason this reads as inside rather than on top. */}
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

      {/* The front leaf: the same photograph, clipped, hinged on its foot. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        aria-hidden
        className="file__leaf file__leaf--front"
        src={asset("/file/folder-front.webp")}
        width={998}
        height={712}
      />
    </button>
  );
}
