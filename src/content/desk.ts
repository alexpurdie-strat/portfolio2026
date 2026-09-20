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

/* ── Things the window crops ───────────────────────────────────────────────
   Anchored to the corners of the window rather than to the stage, so each
   stays "just on screen" at any width — in stage space they drift inward and
   leave a band of wood between them and the edge on a wide monitor.

   Each width is a CSS expression, not a number, because it has to obey the
   same constraint the stage does. Sized off svh alone they keep growing on a
   narrow window while the mat is held back by the width cap, and they end up
   out of scale with the desk they sit on.

   The rotations are well past the angles the photographs were shot at. At
   these angles each object's near edge runs as a diagonal across its corner,
   so it truncates the corner rather than poking into it — a chamfer, not an
   object sitting near a corner. */
export type CornerProp = {
  id: string;
  src: string;
  /** Which corner it hangs off. */
  corner: "tl" | "tr";
  offsetX: number;
  offsetY: number;
  rotate: number;
  width: string;
};

export const CORNER_PROPS: CornerProp[] = [
  {
    id: "laptop",
    src: "/desk/laptop.webp",
    corner: "tl",
    /* Fractions of the element's own width and height, as a translate. */
    offsetX: -0.5,
    offsetY: -0.66,
    /* Clockwise, which turns the base toward the mat. */
    rotate: 42,
    /* 1.48x the stage height — big enough that the corner in frame reads as a
       MacBook rather than as a grey shape. */
    width: "min(130svh, 98.5vw)",
  },
  {
    id: "keyboard",
    src: "/desk/keyboard.webp",
    corner: "tr",
    /* Positive X pushes it off the right edge; the laptop's negative X pushes
       it off the left. */
    offsetX: 0.46,
    offsetY: -0.56,
    /* Square to the desk, deliberately. The laptop is chamfering its corner at
       42 degrees; matching that here would read as a pattern rather than as
       two objects that happen to be where someone left them. The photograph
       already carries a slight tilt of its own, which is enough. */
    rotate: 0,
    /* About 0.62 of the mat's width, which is roughly a 75% board against a
       cutting mat in real life. */
    width: "min(70svh, 53vw)",
  },
];

/* ── The board ─────────────────────────────────────────────────────────────
   The mat, its printing and the pile are one thing and have to move as one,
   so they get their own coordinate space rather than sitting in the frame's.
   `src` is the box Figma composed them against; `x/y/w/h` is where that box
   now sits. Everything on the board is expressed as a fraction of `src`, so
   growing the board moves the pile, the masthead and the type with it.

   This asset carries its own drop shadow, so the file is bigger than the mat:
   1362x888 around a green of exactly 1162x758 — the Figma node, to the pixel.
   The padding is symmetric, 100 either side and 65 top and bottom, so
   centring the box centres the green and no hand-measured correction is
   needed. Every previous asset had lopsided padding, which is what kept going
   wrong.

   The element is sized so the green lands at 875 of the stage's 1024, which
   is 75svh; the shadow is what pushes the box past the stage's own height. */
export const BOARD = {
  x: 225,
  y: 0,
  w: 1572,
  h: 1025,
  /* Where the green sits inside the asset, as fractions of it. Anything placed
     on the mat is positioned against the green, not against the file, or the
     shadow's padding pushes it all down and right. */
  inset: { x: 0.0734, y: 0.0732 },
  /* The mat box in the frame this asset was cut from — 189:20353, which is the
     same 1162x758. The pile's coordinates below are still in the previous
     frame's 1210x812 mat and will need rebasing when it comes back on. */
  src: { x: 139, y: 207, w: 1162, h: 758 },
} as const;

/* ── The mat ───────────────────────────────────────────────────────────────
   The canvas inside the canvas. Everything interactive sits on it; everything
   off it is context. Its green is also the drawer's green, so opening a piece
   reads as going into the mat rather than as a panel arriving from elsewhere. */
export const MAT = {
  src: "/desk/mat.webp",
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

/* ── Blank notes ───────────────────────────────────────────────────────────
   Four colours of empty post-it, cut out with their own shadows. Board-space:
   x and y are measured from the top-left of the green, not of the asset, and
   the size is in the same units — a real note is about 76mm against a 600mm
   mat, which is the 150 below.

   These carry no text yet. When they do, the copy goes on top of them the way
   the "Currently AT" note works, not baked into the image. */
export const NOTE_COLORS = ["green", "white", "amber", "lime"] as const;

export type Note = {
  id: string;
  color: (typeof NOTE_COLORS)[number];
  x: number;
  y: number;
  size: number;
  rotate: number;
};

export const NOTES: Note[] = [
  /* Low on the mat and well clear of the masthead. */
  { id: "test", color: "amber", x: 96, y: 520, size: 150, rotate: -7 },
  { id: "test-2", color: "lime", x: 872, y: 118, size: 150, rotate: 5 },
];

/*
 * A stable wobble, so no two notes are the same stamp.
 *
 * Deterministic on purpose. Math.random() would re-roll on every render, which
 * means the server and the client would disagree and React would throw a
 * hydration mismatch — and every reload would shuffle the desk. Hashing the
 * note's own id gives each one a tilt that is arbitrary-looking but fixed:
 * same note, same angle, forever.
 *
 * Kept small. Paper on a desk is a degree or two off square and a hair off
 * size; more than that stops reading as "dropped there" and starts reading as
 * a bug. The authored `rotate` is the intent and this only nudges it.
 */
function hash(seed: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  /* -1..1 */
  return ((h >>> 0) % 2000) / 1000 - 1;
}

export function noteWobble(note: Note) {
  return {
    /* Up to 2.5 degrees either side of the authored angle. */
    rotate: note.rotate + hash(note.id, 1) * 2.5,
    /* Up to 2.5% bigger or smaller. */
    scale: 1 + hash(note.id, 2) * 0.025,
    /* Under a degree of skew — just enough that the paper is not a perfect
       rectangle, which is what makes two notes of one colour read as two
       pieces of paper rather than one image used twice. */
    skew: hash(note.id, 3) * 0.8,
  };
}

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
