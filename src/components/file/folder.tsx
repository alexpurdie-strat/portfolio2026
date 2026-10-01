"use client";

import { useState } from "react";

import { asset } from "@/lib/asset";

/*
 * A folder that opens, made from one photograph of a closed one.
 *
 * The trick is that the picture is used twice. Underneath it sits whole, which
 * is the back leaf. On top sits the same picture clipped to the front leaf
 * only — the tab and everything below the fold — and that copy hinges forward
 * on its bottom edge. Papers go between the two.
 *
 * The clip is measured off the asset rather than guessed: the front leaf's top
 * edge reads at 9.7% of the height, and the tab runs from 2.8% to 34.4% of the
 * width, which is a left third cut. The short diagonal between them is the die.
 */
const FRONT_LEAF =
  "polygon(0% 0%, 34.4% 0%, 37.7% 9.7%, 100% 9.7%, 100% 100%, 0% 100%)";

/* What is in it. Real work from the desk build, so nothing new is cut. */
const PAPERS = [
  { src: "/desk/piece-jafp.webp", w: 86, x: 7, y: 6, rotate: -2.5 },
  { src: "/desk/piece-itvs-a.webp", w: 76, x: 17, y: 15, rotate: 2 },
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
        src={asset("/file/folder-manila.webp")}
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
        src={asset("/file/folder-manila.webp")}
        style={{ clipPath: FRONT_LEAF }}
        width={998}
        height={712}
      />
    </button>
  );
}
