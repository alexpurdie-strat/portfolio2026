"use client";

import { useEffect, useRef } from "react";

/*
 * The tear's edge, small, on the previews switch: glyphs bleeding off the
 * pill's outline, densest on the line and feathering out, white at the line
 * and cooling outward, shimmering slowly. Drawn only while the switch is on;
 * the canvas fades out when it is off. Under reduced motion it is drawn once
 * and holds still.
 */

const GLYPHS = "01#@%*+=<>/{}[];:$&";
const COLORS = ["#fffcf4", "#fffcf4", "#fffcf4", "#9ff2c8", "#8fc8ff", "#5f9dff", "#b7e6ff"];
const COUNT = 260;
const PAD = 26; // px of canvas round the pill

export function SwitchBleed({ on }: { on: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host || !on) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = host.offsetWidth;
    const H = host.offsetHeight;
    canvas.width = Math.round((W + PAD * 2) * dpr);
    canvas.height = Math.round((H + PAD * 2) * dpr);
    canvas.style.width = `${W + PAD * 2}px`;
    canvas.style.height = `${H + PAD * 2}px`;
    ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
    const family =
      getComputedStyle(canvas).getPropertyValue("--font-martian").trim() || "monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // A point on the pill's outline at u (0..1), and its outward normal.
    const r = H / 2;
    const straight = W - H;
    const total = 2 * straight + Math.PI * H;
    const at = (u: number): [number, number, number, number] => {
      let d = u * total;
      if (d < straight) return [r + d, 0, 0, -1];
      d -= straight;
      if (d < Math.PI * r) {
        const a = -Math.PI / 2 + d / r;
        return [W - r + Math.cos(a) * r, r + Math.sin(a) * r, Math.cos(a), Math.sin(a)];
      }
      d -= Math.PI * r;
      if (d < straight) return [W - r - d, H, 0, 1];
      d -= straight;
      const a = Math.PI / 2 + d / r;
      return [r + Math.cos(a) * r, r + Math.sin(a) * r, Math.cos(a), Math.sin(a)];
    };

    const gauss = () =>
      Math.abs(Math.sqrt(-2 * Math.log(Math.random() || 1e-6)) * Math.cos(2 * Math.PI * Math.random()));
    const glyphs = Array.from({ length: COUNT }, () => {
      const out = Math.random() < 0.7;
      const g = Math.min(gauss(), 3);
      const d = (out ? 1 : -1) * g * (out ? 5 : 2.5);
      const far = g / 3;
      return {
        u: Math.random(),
        d,
        ch: GLYPHS[(Math.random() * GLYPHS.length) | 0],
        size: Math.random() < 0.3 ? 9 : 7,
        color: Math.random() < 0.25 + far * 0.6 ? COLORS[3 + ((Math.random() * 4) | 0)] : COLORS[0],
        a: (0.55 + 0.45 * Math.exp(-(g * g) / 2)) * (0.7 + Math.random() * 0.3),
      };
    });

    const draw = () => {
      ctx.clearRect(-PAD, -PAD, W + PAD * 2, H + PAD * 2);
      for (const p of glyphs) {
        const [x, y, nx, ny] = at(p.u);
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.color;
        ctx.font = `500 ${p.size}px ${family}`;
        ctx.fillText(p.ch, x + nx * p.d, y + ny * p.d);
      }
      ctx.globalAlpha = 1;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw();
      return;
    }

    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 90) {
        last = now;
        for (let n = 0; n < COUNT * 0.1; n++) {
          glyphs[(Math.random() * COUNT) | 0].ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        draw();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  return <canvas ref={ref} className="cb-previews__bleed" aria-hidden="true" />;
}
