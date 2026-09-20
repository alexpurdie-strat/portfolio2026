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
/* Board-space. The pile overhangs the mat very slightly on every side,
   which is what stops the cutouts looking inset in a tray. */
export const PILE = { x: -14, y: -13, w: 1224, h: 822 };

const clip = (k: keyof typeof CLIPS) => CLIPS[k];

/* ── Furniture ─────────────────────────────────────────────────────────────
   Empty. The wood is no longer an element inside the stage — it is the page's
   own background, covering the viewport, so widening the window reveals more
   desk instead of scaling the composition. Inside the stage it would have
   scaled with the mat, which is the opposite of what a surface does.

   The MacBook and the keyboard are out too: they took a third of the frame
   between them and neither held anything a reader could use. All three assets
   are still in public/desk if they come back. */
export const FURNITURE = [] as const;

/* ── The laptop ────────────────────────────────────────────────────────────
   Anchored to the top-left corner of the window rather than to the stage, so
   it stays "just on screen" at any width — in stage space it would drift
   inward and leave a band of wood between it and the edge on a wide monitor.

   Sized against viewport height so it keeps its scale relative to the mat, and
   offset far enough that only the lower-right of the base is in frame. The
   whole machine is there; the window is simply cropping it. */
export const LAPTOP = {
  src: "/desk/laptop.webp",
  /* Fractions of the element's own width/height, applied as a translate. */
  offsetX: -0.50,
  offsetY: -0.66,
  /*
   * Well past the angle the photograph was shot at. At this rotation the
   * laptop's near edge runs as a diagonal from the top of the frame down to
   * the left of it, so it truncates the corner rather than poking into it —
   * a chamfer, not an object sitting near a corner. Clockwise, which turns the
   * base toward the mat.
   */
  rotate: 42,
  /*
   * Width as a CSS expression rather than a number, because it has to obey the
   * same constraint the stage does. Sized off svh alone it kept growing on a
   * narrow window while the mat was held back by the width cap, and the laptop
   * ended up out of scale with the desk it sits on. 1.48 x the stage height,
   * which is big enough that the corner in frame reads as a MacBook rather
   * than as a grey shape.
   */
  width: "min(130svh, 98.5vw)",
} as const;

/* ── The board ─────────────────────────────────────────────────────────────
   The mat, its printing and the pile are one thing and have to move as one,
   so they get their own coordinate space rather than sitting in the frame's.
   `src` is the box Figma composed them against; `x/y/w/h` is where that box
   now sits. Everything on the board is expressed as a fraction of `src`, so
   growing the board moves the pile, the masthead and the type with it.

   Centred on the green, which is not the same as centring the element: the mat
   photograph carries uneven padding inside its own file — 9px of it on the
   left against 48 on the right, 13 on the top against 62 on the bottom. Centre
   the box and the mat still sits visibly high and left. These numbers put the
   green itself in the middle, measured off the render rather than computed. */
export const BOARD = {
  x: 322,
  y: 61,
  w: 1416,
  h: 950,
  src: { x: 430, y: 215, w: 1210, h: 812 },
} as const;

/* ── The mat ───────────────────────────────────────────────────────────────
   The canvas inside the canvas. Everything interactive sits on it; everything
   off it is context. Its green is also the drawer's green, so opening a piece
   reads as going into the mat rather than as a panel arriving from elsewhere. */
export const MAT = {
  src: "/desk/mat.svg",
  /*
   * The masthead is now inside mat.svg as outlines, drawn by Figma rather than
   * reconstructed from its export — which is what stops the leading, the
   * tracking and the chip drifting from the frame every time one of them is
   * touched. The trade is that the name is no longer live text, so the scene
   * carries a visually-hidden heading instead and nothing is lost to a screen
   * reader.
   */
  ink: "#519378",
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
    /*
     * The paper inside postit-currently.webp is smaller than the file, so the
     * three things on the note are placed against the visible square rather
     * than against the element box — anchored to the box, "Whiteboard" fell
     * off the bottom edge onto the logos below.
     */
    logo: { src: "/desk/whiteboard.svg", x: 66, y: 448, w: 106, h: 40, rotate: -10.82 },
    text: { x: 74, y: 424, rotate: -9.67 },
    second: { text: "Whiteboard", x: 70, y: 486, rotate: -9.67, tracking: 2.07 },
  },
  {
    id: "reminder",
    onBoard: true,
    src: "/desk/postit-reminder.webp",
    x: 975,
    y: 22,
    w: 194,
    h: 192,
    rotate: 3.02,
    lines: ["Reminder:", "", "Drop it like", "     it’s hot..."],
    text: { x: 1008, y: 56, rotate: 11.66 },
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
