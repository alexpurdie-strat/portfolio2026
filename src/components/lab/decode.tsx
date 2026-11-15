"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Text that resolves from source glyphs into itself, left to right.
 *
 * Hand-written: Craftwork's component catalogue has no decode or scramble
 * effect. Screen readers get the final string from the first render; only the
 * visible copy scrambles. Reduced motion shows the final text.
 *
 * `when` decides what plays it: "view" once as it scrolls in, or a boolean the
 * parent drives (a row being hovered).
 *
 * `glyphClassName` splits the line in two while it plays: the settled part in
 * the element's own face, the unsettled glyphs in a span of their own, so a
 * serif line can resolve out of monospace source.
 */

const GLYPHS = "01<>/_{}[]=+*#:;";

export function Decode({
  text,
  when = "view",
  duration = 700,
  className,
  glyphClassName,
}: {
  text: string;
  when?: "view" | boolean;
  duration?: number;
  className?: string;
  glyphClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [settled, setSettled] = useState(text.length);
  const [noise, setNoise] = useState("");
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (when !== "view") return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [when]);

  const playing = when === "view" ? inView : when;

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const s = Math.floor(p * text.length);
      let n = "";
      for (let i = s; i < text.length; i++) {
        n += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setSettled(s);
      setNoise(n);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setSettled(text.length);
      setNoise("");
    };
  }, [playing, text, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {text.slice(0, settled)}
        {glyphClassName ? <span className={glyphClassName}>{noise}</span> : noise}
      </span>
    </span>
  );
}
