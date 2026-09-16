"use client";

import { useEffect, useRef } from "react";

/*
 * A field of pixels that lights where the cursor has been.
 *
 * Nothing is drawn until something moves over it: at rest this is an empty
 * rectangle, and the mark it leaves is the only content. Cells brighten hard on
 * approach and cool slowly, so what you get is a stroke rather than a spotlight
 * — the page keeps a short memory of where you went.
 *
 * Monochrome and deliberately dim. It sits behind the statement, and a bright
 * animated grid next to 68px type is a competition the type loses.
 *
 * Under `prefers-reduced-motion` it never mounts a loop and stays blank.
 */
export function PixelField({
  cell = 6,
  radius = 70,
  className,
}: {
  /** Pixel size in CSS px, including its gap. */
  cell?: number;
  /** Cursor reach in CSS px. */
  radius?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    const box = wrapRef.current;
    if (!el || !box) return;
    const g = el.getContext("2d");
    if (!g) return;
    /* See the note in ascii-image.tsx: narrowing does not survive into the
       hoisted declarations below, so bind non-null locals here. */
    const canvas: HTMLCanvasElement = el;
    const wrap: HTMLDivElement = box;
    const ctx: CanvasRenderingContext2D = g;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cols = 0;
    let rows = 0;
    let heat = new Float32Array(0);
    let raf = 0;
    let dead = false;
    /* The pointer is tracked on the window, not on the element. The field
       bleeds off the edge of the page, so half of it is unhoverable — listening
       locally would make the visible half the only live half. */
    let px = -1e4;
    let py = -1e4;

    function resize() {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      cols = Math.max(1, Math.ceil(rect.width / cell));
      rows = Math.max(1, Math.ceil(rect.height / cell));
      heat = new Float32Array(cols * rows);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame() {
      if (dead) return;
      const rect = wrap.getBoundingClientRect();
      const lx = px - rect.left;
      const ly = py - rect.top;

      const r = radius / cell;
      const r2 = r * r;
      const cx = lx / cell;
      const cy = ly / cell;

      /* Only walk the cells the cursor could possibly have touched. Sweeping
         the whole grid every frame is what makes these effects expensive, and
         the lit region is always a small disc. */
      const x0 = Math.max(0, Math.floor(cx - r));
      const x1 = Math.min(cols - 1, Math.ceil(cx + r));
      const y0 = Math.max(0, Math.floor(cy - r));
      const y1 = Math.min(rows - 1, Math.ceil(cy + r));

      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          const add = 1 - Math.sqrt(d2) / r;
          const i = y * cols + x;
          if (add > heat[i]) heat[i] = add;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      const size = cell - 1; /* one px of gap, so it reads as a grid not a wash */
      for (let i = 0; i < heat.length; i++) {
        const h = heat[i];
        if (h <= 0.004) {
          if (h !== 0) heat[i] = 0;
          continue;
        }
        alive = true;
        heat[i] = h * 0.965;
        /* Eased so the trail has a bright head and a long faint tail rather
           than a linear ramp, which reads as a smear. */
        const a = h * h * 0.78;
        ctx.fillStyle = `rgba(224, 217, 216, ${a.toFixed(3)})`;
        const gx = (i % cols) * cell;
        const gy = Math.floor(i / cols) * cell;
        ctx.fillRect(gx, gy, size, size);
      }

      if (alive) raf = requestAnimationFrame(frame);
      else raf = 0;
    }

    function onMove(e: PointerEvent) {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      dead = true;
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cell, radius]);

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
