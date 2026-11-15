"use client";

import { useEffect, useId, useRef } from "react";

import type { Preview } from "@/content/lab-index";

/*
 * A tear in the page, with a project behind it.
 *
 * When a row is pointed at, one or two of its images are exposed through
 * holes torn in the screen somewhere outside that row. Each tear is its own:
 * a random place, size, outline and opening angle, so no two open alike.
 *
 * · The edge is glowing white ASCII, drawn on a canvas, never masked: a soft
 *   near-solid white core on the lip, glyphs piling over it, and a feather
 *   that runs twice as far outward as inward and flares and hugs round the
 *   perimeter. Three glyph sizes, uneven brightness, so the falloff is never
 *   a clean ramp; white at the lip, cooling into greens and blues outward. The image is clipped at the core's centre, so its cut is
 *   buried in the brightest part. A share of the characters change as it
 *   runs.
 * · Opening: a burn from a point near the middle. Each stretch of the
 *   outline spreads out from it on its own delay, so the hole grows
 *   unevenly, like paper catching, while the image decodes behind it.
 * · Holding: the outline is a few slow, broad waves around its perimeter,
 *   each drifting at its own speed, so the hole breathes, smoothly, as if
 *   working to stay open.
 * · Tendrils: cracks run out from the tear, mostly from its corners, some
 *   forking once, as glowing lines that taper into glyph trails. They grow
 *   once the burn is mostly open and draw back in as it shuts.
 * · Glitching: now and then the image slips in slices and splits its red
 *   channel for a beat.
 * · Closing: the burn runs backward, to the point, then gone.
 *
 * One animation frame loop per tear, writing attributes directly; nothing
 * re-renders while it lives. Under reduced motion a tear simply appears and
 * disappears, with no breathing, shimmer or glitch.
 */

type Wave = { k: number; amp: number; speed: number; phase: number };

export type TearSpec = {
  key: string;
  preview: Preview;
  x: number;
  y: number;
  w: number;
  h: number;
  /* Where the burn starts, as a share of the box, and the phases of the
     wave that decides which stretch of the edge burns out first. */
  origin: [number, number];
  burn: [number, number];
  openMs: number;
  /* Wait before burning open, and how long to stay before giving way to the
     next one. */
  delay: number;
  life: number;
  waves: Wave[];
  /* The outline's corners: an irregular polygon, angular rather than round.
     Angle round the centre, and distance out as a share of the half-box. */
  corners: { a: number; r: number }[];
};

const DECODE = "01<>/_{}[]=+*#:;";
const EDGE = "01#@%*+=<>/{}[];:$&";
const POINTS = 72;
const PARTICLES = 3600;
const OUT = 36; // px, sigma of the feather outward: ~110px, a few further
const IN = 13.5; // px, sigma inward: shorter, so the image stays clearer
const CORE = 16; // px, the near-solid white band on the lip
const SIZES = [8, 10, 13];
/* The edge's light: white at the lip, cooling into greens and blues out in
   the feather. */
const WHITE = "#fffcf4";
const COOL = ["#9ff2c8", "#6fe0b0", "#8fc8ff", "#5f9dff", "#b7e6ff"];
const PALETTE = [WHITE, ...COOL];

/*
 * Glyph sprites. Every edge glyph is one of EDGE x SIZES x PALETTE, so each
 * is drawn once to a small canvas and stamped from then on: drawImage is far
 * cheaper than fillText, and there are thousands of glyphs a frame.
 */
const sprites: HTMLCanvasElement[] = [];
let spriteFamily = "";
const spriteAt = (ch: number, size: number, color: number, family: string) => {
  if (family !== spriteFamily) {
    sprites.length = 0;
    spriteFamily = family;
  }
  const i = (ch * SIZES.length + size) * PALETTE.length + color;
  let c = sprites[i];
  if (!c) {
    const px = SIZES[size];
    const box = Math.ceil(px * 1.4);
    c = document.createElement("canvas");
    c.width = box;
    c.height = box;
    const g = c.getContext("2d")!;
    g.font = `500 ${px}px ${family}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = PALETTE[color];
    g.fillText(EDGE[ch], box / 2, box / 2);
    sprites[i] = c;
  }
  return c;
};
const pickColor = (coolChance: number) =>
  Math.random() < coolChance ? 1 + ((Math.random() * COOL.length) | 0) : 0;
const PAD = 270; // px of canvas past the box, for the feather, glow and tendrils
const FRAME_MS = 32; // the edge redraws at ~30fps; its motion is slow enough
/* Healing, in stages over HEAL_MS: tendrils draw in first, the image burns
   back to white under returning glyphs, then the hole knits shut toward its
   point while the feather drifts out and fades. */
const HEAL_MS = 1700;
/* A tear closed before it finished burning in just fades, this fast. */
const QUICK_MS = 350;
const SLICES = 3;

/*
 * Lay out tears for a row, outside its band of the screen, clear of any
 * tears still open (`avoid`).
 *
 * With no count, it is the row's first showing: one or two, the second
 * staggered in behind the first. With a count, it is a replacement for a
 * tear that has had its time, and it prefers an image not already showing
 * or just shown (`not`).
 */
export function planTears(
  previews: Preview[],
  row: DOMRect,
  opts: { count?: number; avoid?: TearSpec[]; not?: string[] } = {},
): TearSpec[] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const first = opts.count === undefined;
  const count = opts.count ?? (previews.length > 1 && Math.random() < 0.6 ? 2 : 1);
  const fresh = previews.filter((p) => !opts.not?.includes(p.src));
  const pool = [...(fresh.length ? fresh : previews)]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
  const placed: TearSpec[] = [];
  const avoid = opts.avoid ?? [];

  for (const [index, preview] of pool.entries()) {
    for (let tries = 0; tries < 40; tries++) {
      // Start large; after a few misses, try smaller, so a tear still fits
      // when the row sits in the middle of a short screen.
      const shrink = 1 - Math.min(tries / 40, 0.45);
      const w = (460 + Math.random() * 260) * shrink;
      const h = Math.min(Math.max(w * (preview.h / preview.w), 320 * shrink), 560);
      const above = row.top - 24 - h;
      const below = vh - (row.bottom + 24) - h;
      const options: number[] = [];
      if (above > 12) options.push(12 + Math.random() * (above - 12));
      if (below > 12) options.push(row.bottom + 24 + Math.random() * (below - 12));
      if (!options.length) continue;
      const y = options[(Math.random() * options.length) | 0];
      const x = 24 + Math.random() * Math.max(0, vw - w - 48);
      const clash = [...avoid, ...placed].some(
        (p) => x < p.x + p.w + 24 && x + w + 24 > p.x && y < p.y + p.h + 24 && y + h + 24 > p.y,
      );
      if (clash) continue;
      placed.push({
        key: `${preview.src}-${Math.random().toString(36).slice(2)}`,
        preview,
        x,
        y,
        w,
        h,
        origin: [0.35 + Math.random() * 0.3, 0.35 + Math.random() * 0.3],
        burn: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
        openMs: 900 + Math.random() * 400,
        // The second of a pair waits; a replacement waits for its
        // predecessor to be mostly shut.
        delay: first ? (index ? 300 + Math.random() * 400 : 0) : 260 + Math.random() * 300,
        life: 9000 + Math.random() * 4000,
        corners: (() => {
          // 6, 8 or 9: each divides POINTS, so every corner lands on a sample.
          const n = [6, 8, 9][(Math.random() * 3) | 0];
          const off = Math.random() * Math.PI * 2;
          return Array.from({ length: n }, (_, k) => ({
            a: off + ((k + 0.5 + (Math.random() - 0.5) * 0.7) / n) * Math.PI * 2,
            // Mostly near the box's edge, now and then pushed out into a
            // spike or pulled in to a notch.
            r: Math.random() < 0.25 ? 1.02 + Math.random() * 0.08 : 0.72 + Math.random() * 0.24,
          }));
        })(),
        // A few low harmonics: broad, smooth swells rather than jags.
        waves: [2, 3, 5].map((k) => ({
          k,
          // Kept small: the hole breathes, it does not heave.
          amp: (k === 2 ? 3 : k === 3 ? 2 : 1.2) * (0.8 + Math.random() * 0.4),
          speed: 0.3 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
        })),
      });
      break;
    }
  }
  return placed;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const glyphField = (cols: number, rows: number, set: string, fill = 1) => {
  let out = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out += Math.random() < fill ? set[(Math.random() * set.length) | 0] : " ";
    }
    out += "\n";
  }
  return out;
};

export function Tear({
  spec,
  closing,
  onClosed,
  onExpire,
}: {
  spec: TearSpec;
  closing: boolean;
  onClosed: () => void;
  /* Called once, when the tear has been open for its life. */
  onExpire: () => void;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const clipRef = useRef<SVGPolygonElement>(null);
  const maskRef = useRef<SVGPolygonElement>(null);
  const decodeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sliceRefs = useRef<(SVGGElement | null)[]>([]);
  const splitRef = useRef<SVGImageElement>(null);
  const closingAt = useRef<number | null>(null);
  const closedRef = useRef(onClosed);
  const expireRef = useRef(onExpire);

  useEffect(() => {
    closedRef.current = onClosed;
    expireRef.current = onExpire;
  }, [onClosed, onExpire]);

  useEffect(() => {
    if (closing && closingAt.current === null) closingAt.current = performance.now();
  }, [closing]);

  useEffect(() => {
    const { w, h, origin, burn, openMs, waves, corners } = spec;
    const cx = w / 2;
    const cy = h / 2;
    const ox = w * origin[0];
    const oy = h * origin[1];
    // How far behind the fastest stretch of edge the slowest one starts, as a
    // share of the opening. The burn front is uneven by this much.
    // Kept under ~0.3: any more and a fast stretch overtakes a slow one and
    // the outline folds over itself.
    const LAG = 0.28;
    const lagAt = (a: number) =>
      LAG * (0.5 + 0.5 * (0.6 * Math.sin(2 * a + burn[0]) + 0.4 * Math.sin(3 * a + burn[1])));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now() + spec.delay;
    let expired = false;
    // Set when closing starts: a tear that never finished burning in fades
    // out quickly instead of healing, so nothing burns that never showed.
    let quick: boolean | null = null;
    let quickFrom = 1;
    let raf = 0;
    let glitchUntil = 0;
    // The burn-in: how long the image takes to come through, overexposed and
    // glitching at first, settling as it cools.
    const introMs = openMs + 900 + Math.random() * 500;
    let nextGlitch = start + introMs + 400 + Math.random() * 900;
    let lastDecode = 0;
    let lastShimmer = 0;
    let done = false;

    // The edge's glyphs. Each has a place round the perimeter (u, 0..1), a
    // side, a distance from the outline drawn from half a bell curve on that
    // side (Box-Muller), a size, a character and a brightness that falls off
    // with distance. The outward side spreads more than twice as far as the
    // inward one, and how far it spreads swells and shrinks round the
    // perimeter, so the feather flares in places and hugs in others.
    const gauss = () =>
      Math.abs(
        Math.sqrt(-2 * Math.log(Math.random() || 1e-6)) * Math.cos(2 * Math.PI * Math.random()),
      );
    const f1 = Math.random() * Math.PI * 2;
    const f2 = Math.random() * Math.PI * 2;
    const flare = (u: number) =>
      0.55 + 0.9 * (0.5 + 0.5 * (0.6 * Math.sin(Math.PI * 4 * u + f1) + 0.4 * Math.sin(Math.PI * 10 * u + f2)));
    type Glyph = { u: number; d: number; ch: number; a: number; c: number };
    const buckets: Glyph[][] = SIZES.map(() => []);
    for (let n = 0; n < PARTICLES; n++) {
      const u = Math.random();
      const fl = flare(u);
      const out = Math.random() < 0.62;
      const sigma = out ? OUT * fl : IN * (0.7 + 0.3 * fl);
      // About one in nine rides a short tail past the bell, so a few
      // strays scatter beyond the feather; the rest sit on the bell.
      const tail = Math.random() < 0.11;
      const g = tail ? 1.6 + Math.random() * 1.4 : Math.min(gauss(), 3);
      const d = (out ? 1 : -1) * g * sigma;
      // Near the lip, nearly full; far out, faint, with some glyphs much
      // fainter than their neighbours, so the falloff is never a clean ramp.
      // Glyphs right on the lip are dimmed a little, so the middle of the
      // edge is not a solid mass.
      const lip = 0.75 + 0.25 * Math.min(1, (g * sigma) / CORE);
      const a = (tail ? 0.15 + Math.random() * 0.25 : Math.pow(Math.exp(-(g * g) / 2), 0.55) * lip) * (0.45 + Math.random() * 0.55);
      const near = Math.abs(d) < CORE;
      const roll = Math.random();
      const size = near ? (roll < 0.27 ? 2 : roll < 0.7 ? 1 : 0) : roll < 0.11 ? 2 : roll < 0.5 ? 1 : 0;
      // The further out, the likelier a glyph is coloured: the core stays
      // white, the outer feather is about half green and blue.
      const c = pickColor(Math.min(0.55, (Math.abs(d) / (OUT * 2.2)) * 0.8 + (out ? 0.06 : 0)));
      buckets[size].push({ u, d, ch: (Math.random() * EDGE.length) | 0, a, c });
    }
    buckets.forEach((b) => b.sort((p, q) => p.u - q.u));
    const all = buckets.flat();

    // Tendrils: cracks running out from the tear, mostly from its corners,
    // so a spike splits on further. Each is a jagged walk outward, in the
    // frame of the outline where it starts (u along the outward normal, v
    // along the edge), and some fork once.
    type Crack = {
      pts: [number, number][];
      // Width at each point, as a share of the crack's base: it swells and
      // pinches along the way instead of tapering evenly.
      widths: number[];
      glyphs: { s: number; d: number; ch: number; a: number; c: number; size: number }[];
    };
    const walk = (steps: number, a0: number, lmin: number, lmax: number, root = 0): Crack => {
      // A main crack starts inside the core band, so it grows out of the lip
      // rather than sitting on it.
      const pts: [number, number][] = [[root, 0]];
      let a = a0;
      for (let k = 0; k < steps; k++) {
        a = Math.max(-1.3, Math.min(1.3, a + (Math.random() - 0.5) * 1.25));
        const len = lmin + Math.random() * (lmax - lmin);
        const [u, v] = pts[pts.length - 1];
        pts.push([u + Math.cos(a) * len, v + Math.sin(a) * len]);
      }
      // Its feather: glyphs along it, s from root (0) to tip (1), pushed off
      // the line on a bell curve that narrows toward the tip, fading as they
      // go. The same material as the edge's.
      const n = steps * 14;
      const glyphs = Array.from({ length: n }, () => {
        const sAt = Math.pow(Math.random(), 1.3);
        const g = Math.min(Math.abs(Math.sqrt(-2 * Math.log(Math.random() || 1e-6)) * Math.cos(2 * Math.PI * Math.random())), 3);
        const far = g / 3;
        return {
          s: sAt,
          d: (Math.random() < 0.5 ? -1 : 1) * g,
          ch: (Math.random() * EDGE.length) | 0,
          a: Math.pow(Math.exp(-(g * g) / 2), 0.65) * (0.45 + Math.random() * 0.55),
          c: pickColor(far * 0.6 + sAt * 0.35),
          size: Math.random() < 0.3 * (1 - sAt) ? 2 : Math.random() < 0.5 ? 1 : 0,
        };
      });
      const widths = pts.map((_, k) => {
        const taper = 1 - k / pts.length;
        return taper * (0.45 + Math.random() * 1.1);
      });
      return { pts, widths, glyphs };
    };
    const nc = corners.length;
    const tendrils = Array.from({ length: 2 + ((Math.random() * 3) | 0) }, () => {
      const idx =
        Math.random() < 0.5
          ? ((((Math.random() * nc) | 0) * POINTS) / nc) | 0
          : (Math.random() * POINTS) | 0;
      const main = walk(5 + ((Math.random() * 4) | 0), (Math.random() - 0.5) * 0.6, 13, 22, -CORE * 0.5);
      const fork =
        Math.random() < 0.55
          ? {
              at: 2 + ((Math.random() * (main.pts.length - 3)) | 0),
              crack: walk(
                3 + ((Math.random() * 3) | 0),
                (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.5),
                10,
                17,
              ),
            }
          : null;
      return {
        idx,
        main,
        fork,
        lag: Math.random() * 0.25,
        // Each tendril its own thickness, and its fork a share of that.
        w: 0.5 + Math.random() * 1.1,
        forkW: 0.35 + Math.random() * 0.3,
      };
    });
    let family = "monospace";

    // Two canvases at 1x: the glyphs, and under them the soft white core,
    // which the browser blurs on the GPU (a CSS filter on the element) rather
    // than the canvas blurring it every frame.
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    const coreCanvas = coreRef.current;
    const cctx = coreCanvas?.getContext("2d") ?? null;
    for (const c of [canvas, coreCanvas]) {
      if (!c) continue;
      c.width = w + PAD * 2;
      c.height = h + PAD * 2;
    }
    ctx?.setTransform(1, 0, 0, 1, PAD, PAD);
    cctx?.setTransform(1, 0, 0, 1, PAD, PAD);
    if (canvas) {
      family = getComputedStyle(canvas).getPropertyValue("--font-martian").trim() || "monospace";
    }
    let lastDraw = 0;

    const decodeCols = Math.ceil(w / 6.6);
    const decodeRows = Math.ceil(h / 13);

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      // prog runs 0 to 1 on the way open and back down on the way shut.
      if (!expired && closingAt.current === null && now > start + spec.life) {
        expired = true;
        expireRef.current();
      }
      let prog = still ? (now >= start ? 1 : 0) : Math.min(Math.max((now - start) / openMs, 0), 1);
      let heal = 0;
      if (closingAt.current !== null) {
        if (quick === null) {
          quick = now < start + introMs * 0.7;
          quickFrom = prog;
        }
        if (quick) {
          const c = Math.min((now - closingAt.current) / (still ? 1 : QUICK_MS), 1);
          prog = quickFrom * (1 - easeInOut(c));
          if (c >= 1 && !done) {
            done = true;
            closedRef.current();
            return;
          }
        }
        const c = quick ? 0 : Math.min((now - closingAt.current) / (still ? 1 : HEAL_MS), 1);
        heal = c;
        // The hole holds while the image burns back, then knits shut.
        if (!quick) prog = Math.min(prog, 1 - easeInOut(Math.min(Math.max((c - 0.3) / 0.7, 0), 1)));
        if (c >= 1 && !done) {
          done = true;
          closedRef.current();
          return;
        }
      }

      if (now - lastDraw < FRAME_MS && !still) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastDraw = now;
      const open = easeInOut(prog);

      // Outer outline: a squared-off ellipse whose radius swells with a few
      // slow waves. While it opens, each stretch of it burns outward from the
      // origin on its own delay, so the hole spreads like a burn through
      // paper, unevenly, rather than scaling up as one shape.
      const outer: [number, number][] = [];
      // Corner positions, each breathing a little along its own direction.
      const cps = corners.map((c) => {
        let swell = 0;
        for (const wv of waves) {
          swell += Math.sin(wv.k * c.a + wv.phase + (still ? 0 : t * wv.speed)) * wv.amp;
        }
        return [
          cx + Math.cos(c.a) * ((w / 2 - 10) * c.r + swell),
          cy + Math.sin(c.a) * ((h / 2 - 10) * c.r + swell),
        ];
      });
      for (let i = 0; i < POINTS; i++) {
        // Walk the polygon edge by edge, POINTS samples in all, so straight
        // runs stay straight and the corners stay sharp.
        const pos = (i / POINTS) * nc;
        const j = Math.floor(pos);
        const f = pos - j;
        const [ax, ay] = cps[j];
        const [bx, by] = cps[(j + 1) % nc];
        let px = ax + (bx - ax) * f;
        let py = ay + (by - ay) * f;
        const a = Math.atan2(py - cy, px - cx);
        const lag = lagAt(a);
        const local = still ? 1 : easeInOut(Math.min(Math.max((prog * (1 + LAG) - lag) / 1, 0), 1));
        px = ox + (px - ox) * local;
        py = oy + (py - oy) * local;
        outer.push([px, py]);
      }

      const fmt = (p: [number, number][]) =>
        p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
      const poly = fmt(outer);
      clipRef.current?.setAttribute("points", poly);
      maskRef.current?.setAttribute("points", poly);

      // The edge: walk the outline once, placing every glyph at its share of
      // the perimeter, pushed out or in along the normal there. The spread
      // grows with the opening, so a slit is a thin bright line.
      if (ctx) {
        if (!still && now - lastShimmer > 70) {
          lastShimmer = now;
          for (let n = 0; n < PARTICLES * 0.08; n++) {
            all[(Math.random() * all.length) | 0].ch = (Math.random() * EDGE.length) | 0;
          }
        }
        const lens = [0];
        for (let i = 0; i < POINTS; i++) {
          const [ax, ay] = outer[i];
          const [bx, by] = outer[(i + 1) % POINTS];
          lens.push(lens[i] + Math.hypot(bx - ax, by - ay));
        }
        const total = lens[POINTS] || 1;
        ctx.clearRect(-PAD, -PAD, w + PAD * 2, h + PAD * 2);
        cctx?.clearRect(-PAD, -PAD, w + PAD * 2, h + PAD * 2);

        // The tendrils' paths this frame. They grow out once the burn is
        // mostly open, and draw back in as it shuts.
        type Path = { pts: number[][]; w0: number; grow: number; crack: Crack };
        const paths: Path[] = [];
        const place = (crack: Crack, ax: number, ay: number, nx: number, ny: number, grow: number) =>
          crack.pts.map(([u, v]) => [ax + (nx * u - ny * v) * grow, ay + (ny * u + nx * v) * grow]);
        for (const td of tendrils) {
          const grow =
            easeInOut(Math.min(Math.max((prog - 0.45 - td.lag) / 0.45, 0), 1)) *
            (1 - easeInOut(Math.min(heal / 0.35, 1)));
          if (grow <= 0) continue;
          const [ax, ay] = outer[td.idx];
          const [px0, py0] = outer[(td.idx - 1 + POINTS) % POINTS];
          const [px1, py1] = outer[(td.idx + 1) % POINTS];
          let nx = py1 - py0;
          let ny = -(px1 - px0);
          const nl = Math.hypot(nx, ny) || 1;
          nx /= nl;
          ny /= nl;
          if (nx * (ax - ox) + ny * (ay - oy) < 0) {
            nx = -nx;
            ny = -ny;
          }
          const pts = place(td.main, ax, ay, nx, ny, grow);
          paths.push({ pts, w0: CORE * td.w, grow, crack: td.main });
          if (td.fork) {
            const [fx, fy] = pts[td.fork.at];
            paths.push({
              pts: place(td.fork.crack, fx, fy, nx, ny, grow),
              w0: CORE * td.w * td.forkW,
              grow,
              crack: td.fork.crack,
            });
          }
        }

        // The core and the tendrils' cores, one material: soft solid white,
        // a wide pass then a tight bright one, drawn together on the core
        // canvas (blurred as a whole by CSS) so a tendril runs out of the lip
        // instead of lying on top of it.
        if (cctx) {
          cctx.lineJoin = "round";
          cctx.lineCap = "round";
          cctx.strokeStyle = WHITE;
          const passes: [number, number][] = [
            [0.32, 1.45],
            [0.48, 0.52],
          ];
          for (const [alpha, widthK] of passes) {
            cctx.globalAlpha = alpha * open;
            // The lip's width swells and thins round the perimeter, with the
            // same flare as the feather, so the outline is never an even line.
            for (let i = 0; i < POINTS; i++) {
              const [ax, ay] = outer[i];
              const [bx, by] = outer[(i + 1) % POINTS];
              cctx.lineWidth = CORE * widthK * open * (0.5 + 0.6 * flare(i / POINTS));
              cctx.beginPath();
              cctx.moveTo(ax, ay);
              cctx.lineTo(bx, by);
              cctx.stroke();
            }
            for (const p of paths) {
              const last = p.pts.length - 1;
              for (let k = 0; k < last; k++) {
                const fall = 1 - k / last;
                cctx.globalAlpha = alpha * open * Math.pow(fall, 0.8) * p.grow;
                cctx.lineWidth = Math.max(0.6, p.w0 * widthK * p.crack.widths[k] * p.grow);
                cctx.beginPath();
                cctx.moveTo(p.pts[k][0], p.pts[k][1]);
                cctx.lineTo(p.pts[k + 1][0], p.pts[k + 1][1]);
                cctx.stroke();
              }
            }
          }
          cctx.globalAlpha = 1;
        }

        // The glyphs, a size at a time, each walk round the outline once.
        buckets.forEach((bucket, bi) => {
          const half = Math.ceil(SIZES[bi] * 1.4) / 2;
          let seg = 0;
          for (const p of bucket) {
            const at = p.u * total;
            while (seg < POINTS - 1 && lens[seg + 1] < at) seg++;
            const [ax, ay] = outer[seg];
            const [bx, by] = outer[(seg + 1) % POINTS];
            const sl = lens[seg + 1] - lens[seg] || 1;
            const f = (at - lens[seg]) / sl;
            const px = ax + (bx - ax) * f;
            const py = ay + (by - ay) * f;
            // Outward normal of this segment.
            let nx = by - ay;
            let ny = -(bx - ax);
            const nl = Math.hypot(nx, ny) || 1;
            nx /= nl;
            ny /= nl;
            if (nx * (px - ox) + ny * (py - oy) < 0) {
              nx = -nx;
              ny = -ny;
            }
            const drift = open * (1 + heal * 0.9);
            ctx.globalAlpha = p.a * open * (1 - heal * 0.6);
            ctx.drawImage(
              spriteAt(p.ch, bi, p.c, family),
              px + nx * p.d * drift - half,
              py + ny * p.d * drift - half,
            );
          }
        });
        ctx.globalAlpha = 1;

        // The tendrils' feather: their glyphs, around each line, by size.
        SIZES.forEach((size, si) => {
          const half = Math.ceil(size * 1.4) / 2;
          for (const p of paths) {
            const last = p.pts.length - 1;
            for (const g of p.crack.glyphs) {
              if (g.size !== si) continue;
              const at = g.s * last;
              const k = Math.min(Math.floor(at), last - 1);
              const f = at - k;
              const [x0, y0] = p.pts[k];
              const [x1, y1] = p.pts[k + 1];
              const dx = x1 - x0;
              const dy = y1 - y0;
              const dl = Math.hypot(dx, dy) || 1;
              const width = p.w0 * 2 * (1 - g.s * 0.7);
              ctx.globalAlpha = g.a * (1 - g.s * 0.85) * p.grow * open;
              ctx.drawImage(
                spriteAt(g.ch, si, g.c, family),
                x0 + dx * f + (-dy / dl) * g.d * width - half,
                y0 + dy * f + (dx / dl) * g.d * width - half,
              );
            }
          }
        });
        if (!still && Math.random() < 0.3) {
          const td = tendrils[(Math.random() * tendrils.length) | 0];
          const g = td.main.glyphs[(Math.random() * td.main.glyphs.length) | 0];
          g.ch = (Math.random() * EDGE.length) | 0;
        }
        ctx.globalAlpha = 1;
      }

      // How much of the burn-in is left: 1 as it starts, 0 once settled.
      const burnIn = still
        ? 0
        : Math.max(
            Math.min(1, Math.max(0, 1 - (now - start) / introMs)),
            // Healing: the image burns back to white over the first half.
            easeInOut(Math.min(heal / 0.5, 1)),
          );

      // The decode: glyphs over the image, thinning through the burn-in.
      const decode = Math.pow(burnIn, 1.4);
      if (decodeRef.current) {
        decodeRef.current.style.opacity = decode.toFixed(2);
        if (decode > 0 && now - lastDecode > 50) {
          lastDecode = now;
          decodeRef.current.textContent = glyphField(decodeCols, decodeRows, DECODE, decode);
        }
      }

      // Burning in, the image glitches hard and often, less so as it settles:
      // slices slipping wide, the red channel split, and overexposed, washed
      // out and pale, cooling to its own colour.
      if (!still && burnIn > 0 && now >= start && closingAt.current === null && Math.random() < 0.15 + burnIn * 0.5) {
        const reach = 8 + burnIn * 46;
        glitchUntil = now + 40 + Math.random() * 60;
        sliceRefs.current.forEach((g) =>
          g?.setAttribute("transform", `translate(${((Math.random() - 0.5) * reach).toFixed(1)} 0)`),
        );
        splitRef.current?.setAttribute("x", ((Math.random() - 0.5) * reach * 0.6).toFixed(1));
      }
      if (svgRef.current) {
        svgRef.current.style.filter = burnIn > 0
          ? `brightness(${(1 + 2.4 * burnIn ** 1.5).toFixed(2)}) contrast(${(1 + 0.5 * burnIn).toFixed(2)}) saturate(${(1 - 0.7 * burnIn).toFixed(2)})`
          : "";
      }

      // Once settled, the occasional glitch: slices slip and the red channel
      // splits, for a beat.
      if (!still && burnIn === 0 && now > nextGlitch && closingAt.current === null) {
        glitchUntil = now + 70 + Math.random() * 80;
        nextGlitch = now + 900 + Math.random() * 1800;
        sliceRefs.current.forEach((g) =>
          g?.setAttribute("transform", `translate(${((Math.random() - 0.5) * 16).toFixed(1)} 0)`),
        );
        splitRef.current?.setAttribute("x", ((Math.random() - 0.5) * 10).toFixed(1));
      }
      const glitching = now < glitchUntil;
      if (!glitching) sliceRefs.current.forEach((g) => g?.setAttribute("transform", ""));
      splitRef.current?.setAttribute("opacity", glitching ? (0.6 + burnIn * 0.3).toFixed(2) : "0");
      if (svgRef.current) {
        svgRef.current.style.opacity = glitching && Math.random() < 0.3 + burnIn * 0.3 ? "0.8" : "1";
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [spec]);

  const { x, y, w, h, preview } = spec;
  const slice = h / SLICES;

  return (
    <div className="cb-tear" style={{ left: x, top: y, width: w, height: h }} aria-hidden="true">
      <svg ref={svgRef} className="cb-tear__img" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          {/* The image is masked, not clipped: the same outline, blurred, so
              the picture fades into the edge's glyphs instead of ending on a
              hard line. The clip stays for the brief glyph cover. */}
          <filter id={`soft${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <mask
            id={`m${uid}`}
            maskUnits="userSpaceOnUse"
            x={-PAD}
            y={-PAD}
            width={w + PAD * 2}
            height={h + PAD * 2}
          >
            <polygon ref={maskRef} points="" fill="white" filter={`url(#soft${uid})`} />
          </mask>
          <clipPath id={`in${uid}`} clipPathUnits="userSpaceOnUse">
            <polygon ref={clipRef} points="" />
          </clipPath>
          {Array.from({ length: SLICES }, (_, i) => (
            <clipPath key={i} id={`s${uid}${i}`} clipPathUnits="userSpaceOnUse">
              <rect x={-20} y={i * slice} width={w + 40} height={slice + 0.5} />
            </clipPath>
          ))}
          <filter id={`r${uid}`}>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        <g mask={`url(#m${uid})`}>
          {/* White behind the image, well past its box, so wherever a corner
              reaches beyond the picture the tear shows paper, not page. */}
          <rect x={-PAD} y={-PAD} width={w + PAD * 2} height={h + PAD * 2} fill="#fffcf4" />
          {Array.from({ length: SLICES }, (_, i) => (
            <g key={i} clipPath={`url(#s${uid}${i})`}>
              <g ref={(el) => { sliceRefs.current[i] = el; }}>
                <image href={preview.src} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
              </g>
            </g>
          ))}
          <image
            ref={splitRef}
            href={preview.src}
            width={w}
            height={h}
            preserveAspectRatio="xMidYMid slice"
            filter={`url(#r${uid})`}
            style={{ mixBlendMode: "screen" }}
            opacity={0}
          />
          {preview.sample && (
            <text className="cb-tear__sample" x={w * 0.16} y={h * 0.8}>
              sample
            </text>
          )}
        </g>
      </svg>
      <div
        ref={decodeRef}
        className="cb-tear__decode"
        style={{ clipPath: `url(#in${uid})` }}
      />
      <canvas
        ref={coreRef}
        className="cb-tear__core"
        style={{ left: -PAD, top: -PAD, width: w + PAD * 2, height: h + PAD * 2 }}
      />
      <canvas
        ref={canvasRef}
        className="cb-tear__edge"
        style={{ left: -PAD, top: -PAD, width: w + PAD * 2, height: h + PAD * 2 }}
      />
    </div>
  );
}
