/*
 * The expanding file — the mobile variant.
 *
 * Implemented from Figma: Portfolio Moodboard, 229:1828.
 *
 * This is the desk bundled up and filed away. Where the desktop is the full
 * experience, this is an overview: four sections, one piece of paper each, and
 * nothing to dig through. It is a stop-gap by design, so the measure of it is
 * whether a reader gets the gist in thirty seconds — not whether everything on
 * the desk survived the trip.
 *
 * One section open at a time. Opening one closes the last, the way a finger in
 * a file does.
 */

export type SectionKind = "note" | "sheet" | "about" | "cards";

export type Section = {
  id: string;
  /* Written on the tab, in the same hand as the desk's post-its. */
  label: string[];
  /* What rises out when it opens. */
  kind: SectionKind;
  /* Where the tab sits along the top edge, 0 at the left and 1 at the right.
     Staggered so the four are readable at once, exactly as a real file is
     cut. */
  tab: number;
  /* A line of summary. This is the whole content of the section at this size —
     if it needs more than this, it needs the desktop. */
  blurb: string;
};

export const SECTIONS: Section[] = [
  {
    id: "contact",
    label: ["Contact me"],
    kind: "note",
    tab: 0.62,
    blurb: "Text or call. Email if it is long.",
  },
  {
    id: "work",
    label: ["Work", "examples"],
    kind: "cards",
    tab: 0.3,
    blurb: "Five case studies, shuffled. Swipe or use the arrows.",
  },
  {
    id: "resume",
    label: ["Experience", "/resume"],
    kind: "sheet",
    tab: 0.68,
    blurb: "Fifteen years, one page.",
  },
  {
    id: "about",
    label: ["About Me"],
    kind: "about",
    tab: 0.26,
    blurb: "The short version, and a photograph.",
  },
];

/* ── Kraft ─────────────────────────────────────────────────────────────────
   A manila expanding file is one color with fibre in it and darker creases.
   Nothing here is a photograph: the panel is a shape, the tone is a token, and
   the fibre is noise — which is the whole reason this material was worth
   synthesizing rather than exporting. Tone is standard manila for now and is
   one value to change. */
export const KRAFT = {
  face: "#b07844",
  faceLit: "#c08a52",
  edge: "#8a5a30",
  crease: "#7a4e28",
  shadow: "rgba(60, 32, 12, 0.45)",
  ink: "#3b2412",
} as const;

/* ── The gusset ────────────────────────────────────────────────────────────
   The concertina down the side. Figma draws it as nine 20px strips stacked
   down the left edge — it is the one element that says "expanding file"
   rather than "stack of cards", and the one that has to stretch when a
   section opens. That is why it is generated rather than exported: a
   photograph of a fold cannot extend. */
export const GUSSET = {
  width: 22,
  /* How far the folds pull apart between closed and open. */
  closed: 10,
  open: 26,
};
