"use client";

import { useEffect } from "react";

/*
 * Scroll progress, 0 → 1, across the first screen.
 *
 * Drives the masthead collapse: the wordmark shrinking, the tagline and email
 * fading, the compact header arriving. Written as a custom property on the one
 * element that reads it — never on :root, because a custom property set on the
 * root invalidates style for every element that could inherit it, on every
 * scroll frame.
 *
 * Quantized to 200 steps so an imperceptible change costs no style recalc.
 */
export function useCollapse(
  _ref: React.RefObject<HTMLElement | null>,
  /*
   * How far the collapse takes, as a fraction of viewport height.
   *
   * 0.9, not an arbitrary number: the runway is one screen and the first image
   * comes to rest at y=101, so the collapse has to finish at
   * (100vh − 101) / 100vh. Any shorter and the image is still growing after
   * the wordmark has finished, which reads as two separate animations.
   */
  over = 0.9,
) {
  useEffect(() => {
    const el = document.documentElement;

    /* Reduced motion gets the finished state immediately — the collapse is
       decoration; the compact header is the functional part. */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      el.style.setProperty("--t", "1");
      return;
    }

    let queued = false;
    let last = -1;

    const paint = () => {
      queued = false;
      const distance = Math.max(1, window.innerHeight * over);
      const raw = Math.min(1, Math.max(0, window.scrollY / distance));
      const step = Math.round(raw * 200) / 200;
      if (step !== last) {
        last = step;
        el.style.setProperty("--t", String(step));
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [over]);
}
