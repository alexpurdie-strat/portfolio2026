"use client";

import { useEffect, useRef } from "react";
import { useMode } from "@/lib/mode";

/*
 * A loupe, for inspecting film.
 *
 * On a real reader-printer this is the thing you reach for when the projected
 * image is not quite enough: a lens you hold against the glass to resolve
 * detail. So it only appears over the film — the plates — and never over the
 * reading column, because there is nothing to resolve in type that is already
 * sharp, and a magnifier hovering over prose is a toy rather than a tool.
 *
 * Fine pointers only. The brief is explicit that this must not be faked with
 * taps on a touch device, and it is right: a loupe you cannot hold against
 * anything is just an obstruction.
 */

/* Enough to reveal detail, little enough to stay recognisable as the same
   image. Past about 3x the crop stops reading as the plate you are pointing
   at. */
const ZOOM = 2.5;

export function ReaderLoupe() {
  const { mode } = useMode();
  const lens = useRef<HTMLDivElement | null>(null);
  const active = mode === "microfilm";

  useEffect(() => {
    if (!active) return;
    /* The brief's own instinct, and the correct one. */
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const el = lens.current;
    if (!el) return;

    let target: HTMLImageElement | null = null;
    let px = 0;
    let py = 0;
    let queued = false;

    const draw = () => {
      queued = false;
      if (!target) return;
      const rect = target.getBoundingClientRect();

      /* Where the cursor is inside the plate, 0…1. Taken off the bounding
         box, which on a rotated plate is a few per cent larger than the plate
         itself — the crop centre drifts by that much and is imperceptible in
         a magnifier. What is *not* imperceptible is the angle, so the film
         inside the lens is turned to match the plate it came from. */
      const u = (px - rect.left) / rect.width;
      const v = (py - rect.top) / rect.height;

      const w = rect.width * ZOOM;
      const h = rect.height * ZOOM;
      const r = el.offsetWidth / 2;

      el.style.setProperty("--lens-src", `url("${target.currentSrc}")`);
      el.style.setProperty("--lens-w", `${w.toFixed(1)}px`);
      el.style.setProperty("--lens-h", `${h.toFixed(1)}px`);
      el.style.setProperty("--lens-x", `${(r - u * w).toFixed(1)}px`);
      el.style.setProperty("--lens-y", `${(r - v * h).toFixed(1)}px`);
      el.style.translate = `${(px - r).toFixed(1)}px ${(py - r).toFixed(1)}px`;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      const under = document.elementFromPoint(e.clientX, e.clientY);
      /* Only film. Not the collage, not the header's torn band — those are
         the machine and the desk, not something on the platen. */
      const plate =
        under instanceof HTMLImageElement && under.closest(".plate-pile")
          ? under
          : null;

      if (plate !== target) {
        target = plate;
        if (!plate) {
          delete el.dataset.holding;
          return;
        }
        el.dataset.holding = "";
        /* Match the film's own angle so the crop reads as the same object. */
        const t = getComputedStyle(plate).rotate;
        el.style.setProperty("--lens-turn", t && t !== "none" ? t : "0deg");
      }
      if (!plate) return;

      px = e.clientX;
      py = e.clientY;
      if (!queued) {
        queued = true;
        requestAnimationFrame(draw);
      }
    };

    const onLeave = () => {
      target = null;
      delete el.dataset.holding;
    };

    /*
     * Scrolling does not put the lens away.
     *
     * Hold a loupe still while the film runs under it and you see different
     * film — not nothing. So a scroll re-runs the hit test at the last known
     * pointer position and redraws, which also means the lens correctly lets
     * go when the plate travels out from under it. Only costs anything while
     * the pointer is actually over film.
     */
    const onScroll = () => {
      if (!target || queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const under = document.elementFromPoint(px, py);
        const plate =
          under instanceof HTMLImageElement && under.closest(".plate-pile")
            ? under
            : null;
        if (!plate) {
          onLeave();
          return;
        }
        target = plate;
        draw();
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      delete el.dataset.holding;
    };
  }, [active]);

  return <div className="loupe" ref={lens} aria-hidden />;
}
