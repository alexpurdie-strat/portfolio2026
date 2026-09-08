"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useMode } from "@/lib/mode";

/*
 * The transport: the part of the machine that moves film past the lamp.
 *
 * A crank, a frame counter and a reel label, all reading from one source —
 * document scroll. The crank reflects the film's position and can also drive
 * it; scroll, drag, swipe and the arrow keys are four inputs to the same
 * number, never four states that can disagree.
 *
 * Frames are even slices of the document rather than semantic blocks. That is
 * both more honest to film — real frames are evenly spaced exposures, not
 * paragraphs — and far more robust: it needs no content structure, so it is
 * correct on a case study, a specimen page and a 404 alike.
 *
 * Nothing here re-renders React on scroll. The counter, the crank angle and
 * the slider's own ARIA values are written straight to the DOM from one
 * rAF-throttled handler, because a re-render per scroll event is exactly the
 * cost this site spent a day removing elsewhere.
 */

/*
 * Two frame models, and a document declares which it gets.
 *
 * A page whose sections have been catalogued — a case study — carries
 * [data-frame] on each one, and those *are* its frames: named, uneven, and
 * exactly the divisions the writing already has. Everything else falls back
 * to even slices, which needs no content structure and so is correct on the
 * specimen page and a 404 alike.
 *
 * What deliberately does not happen either way is scroll snapping. Advancing
 * frames by crank or arrow key jumps to a section; free scrolling stays free.
 * Snapping would be the first change that alters how the writing is *read*
 * rather than how it looks, on the surface a hiring reader spends longest on,
 * and film being sectioned is not a reason to take the scrollbar away.
 */

/* A slice is a bit over half a screen — roughly a page of film. Small enough
   that cranking feels like it is doing something, large enough that the
   counter is not noise. */
const FRAME_RATIO = 0.62;
const FRAME_MIN = 320;

/* Where in the viewport a frame counts as "the one being read". */
const READING_LINE = 0.34;

/* Degrees of crank per pixel of film. Tuned so a full screen is a little
   over one turn: fast enough to look driven, slow enough to read. */
const DEG_PER_PX = 0.42;

/* Drag: pixels of film per pixel of pointer travel. Slightly geared up, the
   way a crank's throw is. */
const DRAG_GEAR = 2.4;

const REELS: [test: (p: string) => boolean, mark: string, label: string][] = [
  [(p) => p === "/", "00", "Index"],
  [(p) => p.startsWith("/approach"), "01", "Approach"],
  [(p) => p.startsWith("/archive"), "02", "Archive"],
  [(p) => p.startsWith("/about"), "03", "About"],
  [(p) => p.startsWith("/ask"), "04", "Ask"],
  [(p) => p.startsWith("/design-system"), "99", "Specimen"],
];

function reelFor(pathname: string) {
  const hit = REELS.find(([test]) => test(pathname));
  return hit
    ? { mark: hit[1], label: hit[2] }
    : { mark: "--", label: "Uncatalogued" };
}

export function ReaderTransport() {
  const { mode } = useMode();
  const pathname = usePathname();

  const crank = useRef<HTMLButtonElement | null>(null);
  const readout = useRef<HTMLSpanElement | null>(null);
  const label = useRef<HTMLSpanElement | null>(null);
  const face = useRef<HTMLSpanElement | null>(null);
  const perfs = useRef<HTMLElement[]>([]);
  const spools = useRef<HTMLElement[]>([]);
  /* Last written spool step, so an unchanged value costs no repaint. */
  const wound = useRef(-1);
  /* Document offsets of each named frame, newest measurement wins. Rebuilt on
     route change and resize, never per scroll frame. */
  const marks = useRef<{ top: number; name: string }[]>([]);

  /* The perforation strips belong to ReaderShell, not to this component, so
     they are looked up once rather than passed down through it. */
  useEffect(() => {
    perfs.current = Array.from(
      document.querySelectorAll<HTMLElement>(".reader__perf"),
    );
    spools.current = Array.from(
      document.querySelectorAll<HTMLElement>("[data-spool]"),
    );
  }, []);

  const reel = reelFor(pathname);
  const active = mode === "microfilm";

  /* Reads the named frames out of the DOM. Layout-reading, so it runs on
     route change and resize only — never on scroll. */
  const survey = useCallback(() => {
    const found = Array.from(
      document.querySelectorAll<HTMLElement>("main [data-frame]"),
    )
      .map((el) => ({
        top: el.getBoundingClientRect().top + window.scrollY,
        name: el.dataset.frame || "",
      }))
      .sort((a, b) => a.top - b.top);
    /* One named frame is not a sectioned document, it is a masthead. */
    marks.current = found.length >= 3 ? found : [];
  }, []);

  /* One source of truth for "where is the film", shared by the counter, the
     crank angle, the sprockets, the spools and the slider's ARIA. */
  const measure = useCallback(() => {
    const doc = document.documentElement;
    const travel = Math.max(0, doc.scrollHeight - window.innerHeight);
    const y = Math.min(Math.max(window.scrollY, 0), travel);
    const named = marks.current;

    if (named.length) {
      const line = y + window.innerHeight * READING_LINE;
      let index = 0;
      for (let i = 0; i < named.length; i += 1) {
        if (named[i].top <= line) index = i;
      }
      /* At the end of the film you are on the last frame, whatever the
         reading line says. A section close to the foot of the document sits
         below the line even at maximum scroll, so without this the counter
         stopped at 007/008 and stepping to 8 reported 7 — the unreachable
         frame from phase 3 in a different disguise. */
      if (y >= travel - 1) index = named.length - 1;
      return {
        y,
        travel,
        total: named.length,
        frame: index + 1,
        name: named[index].name,
        stops: named.map((m) => m.top),
      };
    }

    const frameH = Math.max(FRAME_MIN, window.innerHeight * FRAME_RATIO);
    /* Counted off *reachable* travel, not scrollHeight. Off scrollHeight the
       last screenful became frames nobody could crank to — the readout said
       005 on a reel that stopped at 003. A counter that cannot be reached is
       a counter that lies. */
    const total = Math.max(1, Math.floor(travel / frameH) + 1);
    const frame = Math.min(total, Math.floor(y / frameH) + 1);
    const stops = Array.from({ length: total }, (_, i) => i * frameH);
    return { y, travel, total, frame, name: "", stops };
  }, []);

  const paint = useCallback(() => {
    const { y, travel, total, frame, name } = measure();

    /*
     * Written to the three elements that use them, never to :root.
     *
     * A custom property set on the root element invalidates style for every
     * element that could inherit it — the whole document, on every scroll
     * frame. Measured: 18.8ms average and a 27.7ms spike, 53fps. Scoped to
     * these nodes it is back inside budget. The perforations get the property
     * rather than a direct style because the travelling gradient lives on
     * their ::before, which JS cannot address.
     */
    for (const strip of perfs.current) {
      strip.style.setProperty("--film-y", `${y.toFixed(1)}px`);
    }
    if (face.current) {
      face.current.style.rotate = `${(y * DEG_PER_PX).toFixed(2)}deg`;
    }

    /*
     * Film remaining on the feed spool, and wound onto the take-up.
     *
     * Quantised to 64 steps: the spools are radial gradients, which repaint
     * more expensively than the linear ones elsewhere, and writing a new
     * value every frame cost a dropped frame while cranking (24.1ms spike).
     * A 64th of a spool's radius is well under a pixel of wound film, so
     * nothing visible is given up.
     */
    const through = travel > 0 ? y / travel : 0;
    const step = Math.round(through * 64) / 64;
    if (step !== wound.current) {
      wound.current = step;
      for (const spool of spools.current) {
        spool.style.setProperty(
          "--wound",
          (spool.dataset.spool === "take-up" ? step : 1 - step).toFixed(4),
        );
      }
    }

    const pad = (n: number) => String(n).padStart(3, "0");
    if (readout.current) {
      const next = `${pad(frame)}/${pad(total)}`;
      /* Only touch the DOM when the text actually changes — this runs on
         every scroll frame. */
      if (readout.current.textContent !== next) {
        readout.current.textContent = next;
      }
    }
    if (label.current && label.current.textContent !== name) {
      label.current.textContent = name;
    }
    const el = crank.current;
    if (el) {
      el.setAttribute("aria-valuemin", "1");
      el.setAttribute("aria-valuemax", String(total));
      el.setAttribute("aria-valuenow", String(frame));
      /* Named frames announce their name — "Frame 5 of 8, what it moved" is
         worth far more to someone listening than a bare number. */
      el.setAttribute(
        "aria-valuetext",
        name
          ? `Frame ${frame} of ${total}, ${name}`
          : `Frame ${frame} of ${total}`,
      );
    }
  }, [measure]);

  /* Scroll → readout. rAF-throttled: many scroll events collapse into one
     write per frame. */
  useEffect(() => {
    if (!active) return;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        paint();
      });
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [active, paint]);

  /* Re-survey when the route changes: a new reel has different frames in
     different places, and their offsets are wrong until we look again. */
  useEffect(() => {
    if (!active) return;
    /* Two frames, because the new route's content has to lay out first. */
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        survey();
        paint();
      }),
    );
    return () => cancelAnimationFrame(id);
  }, [active, pathname, survey, paint]);

  /* Reflow moves every frame, so the offsets have to be taken again. Scroll
     does not — which is why survey is not in the scroll handler. */
  useEffect(() => {
    if (!active) return;
    const onResize = () => {
      survey();
      paint();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, survey, paint]);

  /* ── Drag, with inertia ──────────────────────────────────────────────────
     Pointer events, so mouse drag and touch swipe are the same code path. */
  useEffect(() => {
    const el = crank.current;
    if (!active || !el) return;

    let dragging = false;
    let lastY = 0;
    let velocity = 0;
    let glide = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastY = e.clientY;
      velocity = 0;
      cancelAnimationFrame(glide);
      el.setPointerCapture(e.pointerId);
      el.dataset.turning = "";
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dy = e.clientY - lastY;
      lastY = e.clientY;
      velocity = dy * DRAG_GEAR;
      window.scrollBy(0, -velocity);
      /* Dragging a crank should not also select the label under it. */
      e.preventDefault();
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      delete el.dataset.turning;
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      /* A cranked reel keeps turning for a moment. Reduced motion stops it
         dead instead — the movement is the decoration, not the scrolling. */
      if (reduced.matches || Math.abs(velocity) < 1) return;
      const decay = () => {
        velocity *= 0.94;
        if (Math.abs(velocity) < 0.4) return;
        window.scrollBy(0, -velocity);
        glide = requestAnimationFrame(decay);
      };
      glide = requestAnimationFrame(decay);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      cancelAnimationFrame(glide);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [active]);

  /* ── Keyboard ────────────────────────────────────────────────────────────
     The crank is a slider over frame number, so the standard slider keys do
     the standard slider things. This is the required alternative to drag,
     not a courtesy. */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const { travel, frame, stops } = measure();
      /* Steps frame to frame rather than by a fixed distance, so on a
         sectioned reel the crank lands on "What it moved" instead of
         somewhere in the middle of it. */
      const step = (n: number) => {
        e.preventDefault();
        const target = Math.min(
          Math.max(frame - 1 + n, 0),
          Math.max(stops.length - 1, 0),
        );
        /* Named frames are positioned at their element's top, so back the
           scroll off by the reading line to put the section under it rather
           than at the very top edge of the gate. */
        const top = Math.min(
          Math.max(stops[target] - window.innerHeight * READING_LINE + 4, 0),
          travel,
        );
        window.scrollTo({
          top,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });
      };
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          return step(1);
        case "ArrowUp":
        case "ArrowLeft":
          return step(-1);
        case "PageDown":
          return step(3);
        case "PageUp":
          return step(-3);
        case "Home":
          e.preventDefault();
          return window.scrollTo({ top: 0 });
        case "End":
          e.preventDefault();
          return window.scrollTo({ top: travel });
      }
    },
    [measure],
  );

  return (
    <div className="transport">
      <span className="transport__reel" translate="no">
        <span className="transport__reelMark">Reel {reel.mark}</span>
        <span className="transport__reelLabel">{reel.label}</span>
      </span>

      <span className="transport__frame" translate="no">
        <span className="transport__frameKey">Frame</span>
        {/* written imperatively on scroll, never re-rendered */}
        <span className="transport__frameNum" ref={readout}>
          001/001
        </span>
        {/* Empty on an unsectioned reel, so it collapses rather than
            reserving space for a name that is never coming. */}
        <span className="transport__frameName" ref={label} />
      </span>

      <button
        type="button"
        className="transport__crank"
        ref={crank}
        role="slider"
        aria-label="Film transport"
        aria-orientation="vertical"
        aria-valuemin={1}
        aria-valuemax={1}
        aria-valuenow={1}
        onKeyDown={onKeyDown}
      >
        <span className="transport__crankFace" ref={face} aria-hidden>
          <span className="transport__crankHandle" />
        </span>
      </button>
    </div>
  );
}
