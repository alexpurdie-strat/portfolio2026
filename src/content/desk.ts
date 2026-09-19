import CLIPS from "./desk-clips.json";

/*
 * The desk.
 *
 * Implemented from Figma: Portfolio Moodboard, 139:19882 ("Desktop - 10").
 *
 * The frame is 2022×1024 and the composition is photographic, so it does not
 * reflow — every coordinate below is the frame's own pixel value and the whole
 * scene is scaled to the viewport as one unit. Treat these numbers as the
 * photograph's geometry rather than as layout: moving one without looking at
 * the render will break the pile.
 *
 * Two coordinate spaces, and only two:
 *   STAGE — the 2022×1024 frame. Furniture, the mat, the post-its.
 *   PILE  — a 1224×822 box at stage (416, 202). Everything on the mat.
 * Figma nests the pile items several groups deep, but every one of those groups
 * is `display: contents` in the export, so the children resolve against the
 * pile itself. That is why the numbers here are flat.
 */

export const STAGE = { w: 2022, h: 1024 };
export const PILE = { x: 416, y: 202, w: 1224, h: 822 };

const clip = (k: keyof typeof CLIPS) => CLIPS[k];

/* ── Furniture: photographed, not interactive ──────────────────────────────
   Each bleeds past the frame, which is what stops the desk reading as a
   picture of a desk and starts it reading as a desk. */
export const FURNITURE = [
  { src: "/desk/desk.webp", x: -134, y: 0, w: 2290, h: 1024, alt: "" },
  {
    src: "/desk/macbook.webp",
    x: -814,
    y: -1245,
    w: 2286,
    h: 1818,
    alt: "",
    shadow: "5px 0 10px rgba(0,0,0,0.1), 19px 0 19px rgba(0,0,0,0.09)",
  },
  {
    src: "/desk/keyboard.webp",
    x: 1376,
    y: 197,
    w: 780,
    h: 400,
    alt: "",
    blur: true,
    shadow: "2px 2px 7px rgba(0,0,0,0.1), 8px 9px 12px rgba(0,0,0,0.09)",
  },
] as const;

/* ── The mat ───────────────────────────────────────────────────────────────
   The canvas inside the canvas. Everything interactive sits on it; everything
   off it is context. Its green is also the drawer's green, so opening a piece
   reads as going into the mat rather than as a panel arriving from elsewhere. */
export const MAT = {
  x: 430,
  y: 215,
  w: 1210,
  h: 812,
  src: "/desk/mat.webp",
  /* Printed on the mat, not typeset on the page — but still live text, so it
     stays selectable and can be read aloud. */
  ink: "#519378",
  chip: "#036250",
  cuts: [
    { src: "/desk/mat-v1.svg", x: 453, y: 232, w: 427, h: 734 },
    { src: "/desk/mat-v2.svg", x: 649, y: 228, w: 931, h: 735 },
  ],
  arrow: { src: "/desk/mat-arrow.svg", x: 663, y: 326, w: 25, h: 27 },
} as const;

/* ── The pile ──────────────────────────────────────────────────────────────
   Work, cut out and dropped on the mat. Order is paint order: later entries
   sit on top, and that is also the order the keyboard walks them in.
   `box` is the element's unrotated footprint; `rotate` is applied about its
   center, exactly as Figma composes it.
 */
export type Piece = {
  id: string;
  /** The work this opens. Null where the piece is scenery. */
  slug: string | null;
  /** Shown on hover and on focus. Null for scenery. */
  title: string | null;
  src: string;
  alt: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  /* Traced from the asset's own alpha, so a torn edge does not take clicks
     meant for whatever is underneath it. Scenery gets none — it never
     receives pointer events at all. */
  clip?: string;
  blend?: string;
  opacity?: number;
};

export const PIECES: Piece[] = [
  {
    id: "100s",
    slug: "100-shapes",
    title: "Building the practice",
    src: "/desk/piece-100s.webp",
    alt: "A printed skills matrix for a product designer, five levels across twelve skills.",
    x: 185,
    y: 242,
    w: 391,
    h: 224,
    rotate: 8.9,
    clip: clip("piece-100s"),
  },
  {
    id: "thd",
    slug: "home-depot",
    title: "The Home Depot",
    src: "/desk/piece-thd.webp",
    alt: "A laptop photographed on the desk showing an enterprise form.",
    x: 555,
    y: 298,
    w: 551,
    h: 427,
    rotate: 0,
    clip: clip("piece-thd"),
  },
  {
    id: "jafp",
    slug: "ja-finance-park",
    title: "JA Finance Park & BizTown",
    src: "/desk/piece-jafp.webp",
    alt: "A Finance Park screen introducing Jenny Rogers, age 35, with her salary, credit score and family.",
    x: 515,
    y: 31,
    w: 379,
    h: 256,
    rotate: 3.48,
    clip: clip("piece-jafp"),
  },
  /* Ministry Brands is two sheets from the same deck. The one underneath is
     scenery — it exists so the pair reads as a stack rather than a single
     sheet — and the chart on top is what opens. */
  {
    id: "mb-under",
    slug: null,
    title: null,
    src: "/desk/piece-mb-b.webp",
    alt: "",
    x: 145,
    y: 414,
    w: 523,
    h: 312,
    rotate: -1.63,
  },
  {
    id: "mb",
    slug: null,
    title: "A soiree with JTBD and Ministry Brands",
    src: "/desk/piece-mb-a.webp",
    alt: "An emotional opportunity zone chart, five church roles plotted against risk.",
    x: 170,
    y: 411,
    w: 516,
    h: 298,
    rotate: 0,
    clip: clip("piece-mb-a"),
  },
  {
    id: "about",
    slug: null,
    title: "About",
    src: "/desk/piece-about.webp",
    alt: "A photograph of the Winged Victory of Samothrace, torn from a book.",
    x: 1016,
    y: 140,
    w: 149,
    h: 196,
    rotate: 7.12,
    clip: clip("piece-about"),
  },
  /* ITV is two pieces of the same job, so either one opens it. */
  {
    id: "itvs-a",
    slug: "itv-studios-portal",
    title: "ITV Studios Portal",
    src: "/desk/piece-itvs-a.webp",
    alt: "The Studios Portal home screen welcoming Alex Purdie, with the onboarding tour open.",
    x: 481,
    y: 284,
    w: 386,
    h: 231,
    rotate: -9.99,
    clip: clip("piece-itvs-a"),
  },
  {
    id: "itvs-b",
    slug: "itv-studios-portal",
    title: "ITV Studios Portal",
    src: "/desk/piece-itvs-b.webp",
    alt: "The portal's key-art viewer showing a series still ready to download.",
    x: 743,
    y: 265,
    w: 129,
    h: 256,
    rotate: -26.03,
    clip: clip("piece-itvs-b"),
  },
  /* A strip of tape. Scenery, and the only thing on the mat that is not paper. */
  {
    id: "tape",
    slug: null,
    title: null,
    src: "/desk/tape.webp",
    alt: "",
    x: 597,
    y: 383,
    w: 214,
    h: 40,
    rotate: 76.87,
    blend: "screen",
    opacity: 0.64,
  },
];

/* ── Post-its ──────────────────────────────────────────────────────────────
   Clarity, emphasis, decor — in that order. Both are stage-space. */
export const POSTITS = [
  {
    id: "currently",
    src: "/desk/postit-currently.webp",
    x: 31,
    y: 403,
    w: 194,
    h: 192,
    rotate: -16.81,
    lines: ["Currently AT:"],
    /* The employer's mark, pinned to the note rather than set as type. */
    logo: { src: "/desk/whiteboard.svg", x: 70, y: 482, w: 110, h: 43, rotate: -10.82 },
    text: { x: 62, y: 440, rotate: -9.67 },
    second: { text: "Whiteboard", x: 86, y: 545, rotate: -9.67, tracking: 2.07 },
  },
  {
    id: "reminder",
    src: "/desk/postit-reminder.webp",
    x: 1495,
    y: 228,
    w: 194,
    h: 192,
    rotate: 3.02,
    lines: ["Reminder:", "", "Drop it like", "     it’s hot..."],
    text: { x: 1528, y: 262, rotate: 11.66 },
  },
] as const;

/* ── The logo scatter ──────────────────────────────────────────────────────
   Off the mat, bottom left: every client, torn out. Not openable yet — these
   respond to a pointer and nothing else until the detail copy exists.

   Stage coordinates, not group coordinates. Figma's export writes several of
   these as `calc(8.33% + Npx)`, and that percentage resolves against the frame
   rather than the group they are nested in — read the other way it bunched the
   whole scatter into a narrow column against the left edge.
 */
export const LOGOS = [
  { k: "TS", n: "TaxSlayer", x: 238.2, y: 686.1, s: 97.8, r: -38.82 },
  { k: "CFA", n: "Chick-fil-A", x: -8.8, y: 864.6, s: 98.1, r: -115.82 },
  { k: "100S", n: "100 Shapes", x: 147.5, y: 881.6, s: 98.1, r: 32.42 },
  { k: "MS", n: "M&S", x: 48.6, y: 872.5, s: 98.5, r: -133.07 },
  { k: "ITV", n: "ITV", x: -0.7, y: 793.8, s: 98.1, r: -7.75 },
  { k: "SS", n: "Self Space", x: 17.8, y: 550.6, s: 97.8, r: 4.39 },
  { k: "MB", n: "Ministry Brands", x: 174.1, y: 808.4, s: 98.1, r: -1.03 },
  { k: "patTED", n: "play@TED", x: 108.4, y: 554.5, s: 97.8, r: -50.67 },
  { k: "NHS", n: "NHS", x: 208.4, y: 578.5, s: 98.1, r: -13.45 },
  { k: "I360", n: "Impact 360 Institute", x: -6.4, y: 623.4, s: 98.5, r: -15.8 },
  { k: "TED", n: "TED", x: 86.3, y: 618.7, s: 98.1, r: -1.87 },
  { k: "ITVS", n: "ITV Studios", x: 130.4, y: 726.3, s: 97.8, r: -13.85 },
  { k: "THD", n: "The Home Depot", x: 173.1, y: 651.9, s: 98.1, r: -4.1 },
  { k: "OSL", n: "OSL", x: 84.2, y: 786.9, s: 98.5, r: -20.6 },
  { k: "LEGO", n: "LEGO", x: -2.6, y: 685.6, s: 97.8, r: -20.85 },
  { k: "LEGO1", n: "LEGO Foundation", x: 57.0, y: 692.4, s: 98.1, r: 3.49 },
  { k: "EDSN", n: "Edisen", x: 84.9, y: 960.9, s: 98.1, r: -7.75 },
  { k: "JA", n: "Junior Achievement", x: 189.2, y: 486.2, s: 98.1, r: 9.17 },
  { k: "YM", n: "Your Move", x: 224.1, y: 883.8, s: 97.8, r: 4.03 },
] as const;
