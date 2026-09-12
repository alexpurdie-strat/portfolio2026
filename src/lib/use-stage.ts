"use client";

import { useEffect, useState } from "react";

/*
 * The scroll model.
 *
 * Phase one is the collapse — the load-in state settling into place over one
 * screen. After that the page stops moving and scroll becomes an index: three
 * images per case study, then on to the next one.
 *
 * Deliberately scroll-*indexed* rather than scroll-jacked. Nothing intercepts
 * the wheel, so momentum, the scrollbar, Page Down, Home and End, trackpad
 * gestures and a screen reader's own navigation all behave normally. The effect
 * the brief asks for — content changing state rather than travelling — comes
 * from the stage being fixed, not from taking the scroll away from the reader.
 */

export type Stage = {
  /** 0 → 1 across the collapse. */
  t: number;
  /** Which case study is showing. */
  caseIndex: number;
  /** Which of its images, 0–2. */
  imageIndex: number;
  /** True while the reader is scrolling down; drives the nav's retreat. */
  hidingNav: boolean;
};

export const IMAGES_PER_CASE = 3;
/** Viewport heights of scroll per image. */
const STEP = 0.7;
/** Viewport heights the collapse takes. Ends as the first image lands. */
export const COLLAPSE = 0.9;

/* Where a given case study's first image sits, in document pixels. Half a step
   in, so a jump lands in the middle of a slot rather than on its boundary. */
export function scrollForCase(index: number) {
  const vh = window.innerHeight;
  return Math.round(
    vh * COLLAPSE + index * IMAGES_PER_CASE * STEP * vh + STEP * vh * 0.5,
  );
}

export function stageHeight(cases: number) {
  /*
   * Plus one viewport, because scrollable distance is the runway *minus* one
   * screen. Without it the final slot sits past the end of the scroll and the
   * last case study's third image is unreachable — which is exactly what
   * happened: sampling the last slot returned the one before it.
   */
  const slots = cases * IMAGES_PER_CASE;
  return `calc(${COLLAPSE * 100}svh + ${slots * STEP * 100}svh + 100svh)`;
}

export function useStage(cases: number): Stage {
  const [stage, setStage] = useState<Stage>({
    t: 0,
    caseIndex: 0,
    imageIndex: 0,
    hidingNav: false,
  });

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let queued = false;
    let lastY = window.scrollY;
    let lastT = -1;
    let hiding = false;

    const paint = () => {
      queued = false;
      const vh = window.innerHeight;
      const y = window.scrollY;

      /* Phase one. Reduced motion skips it — the collapse is decoration. */
      const raw = reduced.matches
        ? 1
        : Math.min(1, Math.max(0, y / Math.max(1, vh * COLLAPSE)));
      const t = Math.round(raw * 200) / 200;
      if (t !== lastT) {
        lastT = t;
        root.style.setProperty("--t", String(t));
      }

      /* Phase two: scroll position as an index, not a position. */
      const past = Math.max(0, y - vh * COLLAPSE);
      const step = Math.max(1, vh * STEP);
      const total = cases * IMAGES_PER_CASE;
      const slot = Math.min(total - 1, Math.floor(past / step));

      /* The nav retreats going down and returns on any meaningful move back
         up — a few pixels of jitter should not flash it. */
      const delta = y - lastY;
      if (delta > 6 && y > vh * 0.35) hiding = true;
      else if (delta < -12) hiding = false;
      lastY = y;

      setStage((prev) => {
        const next = {
          t,
          caseIndex: Math.floor(slot / IMAGES_PER_CASE),
          imageIndex: slot % IMAGES_PER_CASE,
          hidingNav: hiding,
        };
        return prev.t === next.t &&
          prev.caseIndex === next.caseIndex &&
          prev.imageIndex === next.imageIndex &&
          prev.hidingNav === next.hidingNav
          ? prev
          : next;
      });
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
  }, [cases]);

  return stage;
}
