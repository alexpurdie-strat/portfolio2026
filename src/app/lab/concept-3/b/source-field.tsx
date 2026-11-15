"use client";

import { Fragment, useEffect, useRef } from "react";

/*
 * The source field, alive. Every so often a line that is on screen rewrites
 * itself: it breaks into source glyphs from the left, then decodes back into
 * the code it was, a little brighter while it does. At most two at once.
 *
 * Lines are mutated through the DOM directly, never through React state: the
 * listing is a few thousand lines, and re-rendering it every frame to change
 * one of them would be absurd. Nothing runs under reduced motion, or while
 * the tab is hidden.
 */

const GLYPHS = "01<>/_{}[]=+*#:;";
const DURATION = 1100; // ms per rewrite
const BREAK = 0.35; // share of it spent breaking down before it decodes
const EVERY = 650; // ms between attempts to start one
const MAX_LIVE = 2;

const glyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

export function SourceField({ text }: { text: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const lines = text.split("\n");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spans = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-l]"));
    const live = new Set<HTMLSpanElement>();
    const rafs = new Set<number>();

    const rewrite = (el: HTMLSpanElement) => {
      const original = el.dataset.l ?? "";
      const indent = original.length - original.trimStart().length;
      live.add(el);
      el.classList.add("is-live");
      const start = performance.now();

      const tick = (now: number) => {
        const p = Math.min((now - start) / DURATION, 1);
        let out = original.slice(0, indent);
        for (let i = indent; i < original.length; i++) {
          const ch = original[i];
          const at = (i - indent) / Math.max(1, original.length - indent);
          // Breaking: glyphs sweep in from the left. Decoding: the code
          // sweeps back in behind them.
          const broken = p < BREAK ? at < p / BREAK : at >= (p - BREAK) / (1 - BREAK);
          out += broken && ch !== " " ? glyph() : ch;
        }
        el.textContent = out;
        if (p < 1) {
          const id = requestAnimationFrame(tick);
          rafs.add(id);
        } else {
          el.textContent = original;
          el.classList.remove("is-live");
          live.delete(el);
        }
      };
      rafs.add(requestAnimationFrame(tick));
    };

    const pick = () => {
      if (document.hidden || live.size >= MAX_LIVE) return;
      for (let tries = 0; tries < 12; tries++) {
        const el = spans[(Math.random() * spans.length) | 0];
        if (!el || live.has(el) || (el.dataset.l ?? "").trim().length < 12) continue;
        const r = el.getBoundingClientRect();
        if (r.top < 0 || r.bottom > innerHeight) continue;
        rewrite(el);
        return;
      }
    };

    const timer = setInterval(pick, EVERY);
    return () => {
      clearInterval(timer);
      rafs.forEach(cancelAnimationFrame);
      spans.forEach((el) => {
        el.textContent = el.dataset.l ?? "";
        el.classList.remove("is-live");
      });
    };
  }, [text]);

  return (
    <pre ref={ref} className="cb-source" aria-hidden="true">
      {/* The break sits outside the line, so rewriting a line's text can
          never take its newline with it. */}
      {lines.map((l, i) => (
        <Fragment key={i}>
          <span data-l={l}>{l}</span>
          {"\n"}
        </Fragment>
      ))}
    </pre>
  );
}
