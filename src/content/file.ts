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
  /* Which stock the folder is cut from. */
  stock: keyof typeof STOCKS;
  /*
   * What is already in the folder, visible before anything is opened. This is
   * the whole read of the design and the thing the first pass left out: a file
   * full of work, not a stack of empty card. Assets are the desktop's, so
   * nothing new ships for mobile.
   */
  peek: { src: string; w: number; x: number; rotate: number }[];
};

export const SECTIONS: Section[] = [
  {
    id: "contact",
    label: ["Contact me"],
    kind: "note",
    tab: 0.62,
    blurb: "Text or call. Email if it is long.",
    stock: "manila",
    peek: [{ src: "/desk/note-amber.webp", w: 36, x: 16, rotate: -6 }],
  },
  {
    id: "work",
    label: ["Work", "examples"],
    kind: "cards",
    tab: 0.3,
    blurb: "Five case studies, shuffled. Swipe or use the arrows.",
    stock: "rust",
    peek: [
      { src: "/desk/piece-jafp.webp", w: 70, x: 6, rotate: -3 },
      { src: "/desk/piece-itvs-a.webp", w: 58, x: 46, rotate: 4 },
    ],
  },
  {
    id: "resume",
    label: ["Experience", "/resume"],
    kind: "sheet",
    tab: 0.68,
    blurb: "Fifteen years, one page.",
    stock: "slate",
    peek: [
      { src: "/desk/piece-mb-a.webp", w: 74, x: 10, rotate: 2 },
      { src: "/desk/piece-100s.webp", w: 52, x: 52, rotate: -5 },
    ],
  },
  {
    id: "about",
    label: ["About Me"],
    kind: "about",
    tab: 0.26,
    blurb: "The short version, and a photograph.",
    stock: "sage",
    peek: [
      { src: "/desk/piece-about.webp", w: 30, x: 14, rotate: -7 },
      { src: "/desk/note-white.webp", w: 32, x: 48, rotate: 5 },
    ],
  },
];

/* ── Stock ─────────────────────────────────────────────────────────────────
   A drawer of folders: manila, and three muted colors of the kind that come in
   the same box. Each one is a face, a lit top edge where the card bends over,
   and a darker cut edge.

   The first pass drew these in two flat gradients and they came out as
   plastic. Card has a long tonal range and visible fibre, so the face runs
   through four stops and the grain is coarse enough to see. */
export type Stock = { face: string; lit: string; deep: string; edge: string };

/*
 * Tones are muted on purpose. The first set was a shade too saturated and
 * read as plastic toys; real file stock is dusty — pulp board takes dye
 * badly, which is why a drawer of coloured folders is always a little grey.
 */
export const STOCKS: Record<string, Stock> = {
  manila: { face: "#c9ad80", lit: "#e0c9a2", deep: "#a98d63", edge: "#8d7149" },
  rust: { face: "#b58571", lit: "#cfa795", deep: "#956755", edge: "#7d5244" },
  sage: { face: "#9fa88c", lit: "#bcc3aa", deep: "#808a6d", edge: "#687258" },
  slate: { face: "#96a0ab", lit: "#b4bdc7", deep: "#78828e", edge: "#616b76" },
};

export const INK = "#3b2412";

