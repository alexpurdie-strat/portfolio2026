"use client";

import { useEffect, useRef } from "react";

import { asset } from "@/lib/asset";

/*
 * A photograph rendered as characters.
 *
 * The image is sampled once into a grid of luminance values, and then every
 * frame that grid is mapped onto a ramp of glyphs — sparse where the picture is
 * dark, dense where it is light. The source bitmap is never drawn. What you see
 * is only ever type.
 *
 * The cursor thickens the grid it passes over: inside a radius, each cell is
 * pushed up the ramp and brightened, falling back on its own. It is not a
 * reveal — the picture does not resolve into a photograph, it only gets denser
 * where you are looking. The reading is that attention adds fidelity, not that
 * hovering unlocks the real image underneath.
 *
 * Under `prefers-reduced-motion` it samples, paints once, and never animates.
 */

/* Sparse to dense. Space first, so black stays empty rather than becoming a
   field of dots — the picture needs somewhere to not be. */
const RAMP = " .:-=+*#%@";

export function AsciiImage({
  src,
  alt,
  cell = 7,
  className,
  /* How far the cursor's influence reaches, in cells rather than pixels, so it
     stays proportional when the grid gets finer. */
  radius = 9,
  crop,
}: {
  src: string;
  /** Describes the photograph, not the effect. Screen readers get this. */
  alt: string;
  cell?: number;
  className?: string;
  radius?: number;
  /*
   * Which part of the source to read, in fractions of the image. The effect
   * needs one subject with a tonal range — hand it a composite or a contact
   * sheet and every panel averages into the same mid-grey block. Cropping is
   * cheaper than keeping a second copy of the file on disk.
   */
  crop?: { x: number; y: number; w: number; h: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    const box = wrapRef.current;
    if (!el || !box) return;
    const g = el.getContext("2d");
    if (!g) return;
    /* Bound once, non-null, because TypeScript drops the narrowing from the
       guard above inside the hoisted function declarations below. */
    const canvas: HTMLCanvasElement = el;
    const wrap: HTMLDivElement = box;
    const ctx: CanvasRenderingContext2D = g;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Cell aspect: a character box is taller than it is wide, so sampling on a
       square grid would stretch the picture vertically. */
    const cellW = cell;
    const cellH = Math.round(cell * 1.6);

    let cols = 0;
    let rows = 0;
    /* Luminance per cell, 0–1, sampled once per layout. */
    let lum: Float32Array = new Float32Array(0);
    /* Cursor heat per cell, decaying toward zero. */
    let heat: Float32Array = new Float32Array(0);
    let raf = 0;
    let pointer = { x: -1e4, y: -1e4, inside: false };
    let dead = false;

    const img = new window.Image();
    img.crossOrigin = "anonymous";

    /* An offscreen canvas the size of the character grid. Drawing the photo
       into it at grid resolution *is* the downsample — the browser's own image
       scaling does the averaging, far faster than reading every pixel. */
    const sampler = document.createElement("canvas");
    const sctx = sampler.getContext("2d", { willReadFrequently: true });

    function sample() {
      if (!sctx || !img.naturalWidth) return;
      sampler.width = cols;
      sampler.height = rows;
      sctx!.clearRect(0, 0, cols, rows);

      /* Cover, not contain: the frame is a fixed shape and the picture fills
         it, the same as object-fit on the photograph this replaces. */
      const sx = (crop?.x ?? 0) * img.naturalWidth;
      const sy = (crop?.y ?? 0) * img.naturalHeight;
      const sw = (crop?.w ?? 1) * img.naturalWidth;
      const sh = (crop?.h ?? 1) * img.naturalHeight;
      const scale = Math.max(cols / sw, rows / sh);
      const w = sw * scale;
      const h = sh * scale;
      sctx!.drawImage(img, sx, sy, sw, sh, (cols - w) / 2, (rows - h) / 2, w, h);

      const { data } = sctx!.getImageData(0, 0, cols, rows);
      lum = new Float32Array(cols * rows);
      for (let i = 0; i < lum.length; i++) {
        const p = i * 4;
        /* Rec. 601 luma. Perceptual weighting matters here more than usual:
           the ramp has ten steps, so a green that reads as mid-grey landing on
           the wrong glyph is visible as a blotch. */
        lum[i] =
          (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255;
      }
    }

    function resize() {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      cols = Math.max(1, Math.floor(rect.width / cellW));
      rows = Math.max(1, Math.floor(rect.height / cellH));
      heat = new Float32Array(cols * rows);

      /* Backing store at device resolution. Characters this small go to mush
         at 1x on a retina screen — which is the one thing this effect cannot
         afford, since the glyphs are the whole subject. */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textBaseline = "top";
      ctx.font = `${cellH}px ui-monospace, SFMono-Regular, Menlo, monospace`;

      sample();
      paint();
    }

    function paint() {
      if (!ctx || !lum.length) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const px = Math.floor(pointer.x / cellW);
      const py = Math.floor(pointer.y / cellH);
      const r2 = radius * radius;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;

          if (pointer.inside) {
            const dx = x - px;
            const dy = y - py;
            const d2 = dx * dx + dy * dy;
            if (d2 < r2) {
              /* Falloff by distance, and only ever raising the value — the
                 cursor adds, it never erases what the picture already had. */
              const add = 1 - Math.sqrt(d2) / radius;
              if (add > heat[i]) heat[i] = add;
            }
          }

          const v = lum[i];
          const h = heat[i];
          /* Heat pushes the cell up the ramp and lifts its alpha. Both, so the
             thickening reads as light rather than as a different texture. */
          const boosted = Math.min(1, v + h * 0.55);
          const ci = Math.min(
            RAMP.length - 1,
            Math.max(0, Math.round(boosted * (RAMP.length - 1))),
          );
          const ch = RAMP[ci];
          if (ch === " ") continue;

          ctx.fillStyle = `rgba(224, 217, 216, ${(0.22 + boosted * 0.58).toFixed(3)})`;
          ctx.fillText(ch, x * cellW, y * cellH);
        }
      }
    }

    function frame() {
      if (dead) return;
      let moving = false;
      for (let i = 0; i < heat.length; i++) {
        if (heat[i] > 0.001) {
          /* Slow decay. The trail is the point — a cursor that leaves nothing
             behind reads as a spotlight rather than as something being worked
             on. */
          heat[i] *= 0.94;
          moving = true;
        } else if (heat[i] !== 0) {
          heat[i] = 0;
        }
      }
      paint();
      /* Stop the loop once the last cell has cooled and the pointer has left.
         An idle canvas repainting 60 times a second is the cost people
         actually notice on a page with four of these. */
      if (moving || pointer.inside) raf = requestAnimationFrame(frame);
      else raf = 0;
    }

    function wake() {
      if (!reduced && !raf) raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      const rect = wrap.getBoundingClientRect();
      pointer = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        inside: true,
      };
      wake();
    }

    function onLeave() {
      pointer.inside = false;
      wake();
    }

    img.onload = () => {
      if (!dead) resize();
    };
    img.src = asset(src);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (!reduced) {
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
    }

    return () => {
      dead = true;
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [src, cell, radius, crop]);

  return (
    <div ref={wrapRef} className={className} role="img" aria-label={alt}>
      <canvas ref={canvasRef} aria-hidden />
    </div>
  );
}
