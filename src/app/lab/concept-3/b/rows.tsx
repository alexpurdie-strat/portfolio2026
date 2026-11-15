"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { Arrow } from "@/components/lab/arrow";
import { Decode } from "@/components/lab/decode";
import { Marquee } from "@/components/ui/marquee";
import type { ListRow } from "@/content/lab-index";

import { SwitchBleed } from "./switch-bleed";
import { planTears, Tear, type TearSpec } from "./tears";

/* How long the outcomes take to resolve before they start to run. */
const DECODE_MS = 450;

/*
 * Travel speed of the run, in ems a second. The duration comes from each
 * row's own length, so a long row and a short one move at the same pace.
 * Approximations of the set width: half an em a character in Martina at this
 * weight, plus the arrow and spacing after each item.
 */
const EM_PER_SECOND = 2.6;
const runDuration = (run: string[]) => {
  const ems = run.join("").length * 0.5 + run.length * 1.3;
  return `${(ems / EM_PER_SECOND).toFixed(2)}s`;
};

/*
 * Every project, linked where there is somewhere to go.
 *
 * Pointing at a row turns it into its outcomes: the row inverts, the title
 * gives way, and the outcomes decode out of mono source glyphs into the
 * serif, then start to run. The other rows step back. The run is mounted only
 * while the row is active, so it always starts from the title's position.
 *
 * And somewhere else on the screen, the work itself tears through: see
 * tears.tsx. Only where there is a pointer to hover with.
 */
type Live = TearSpec & { closing: boolean };

/* A linked row's own hue, for its tinted background. */
const hueStyle = (row: ListRow) =>
  (row.hue ? { "--hue": row.hue } : undefined) as CSSProperties | undefined;

export function Rows({ rows }: { rows: ListRow[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [tears, setTears] = useState<Live[]>([]);
  // The row being pointed at, and where it was on screen, so a tear that has
  // had its time can be replaced by another for the same row.
  const current = useRef<{ row: ListRow; rect: DOMRect } | null>(null);

  // Hover intent: a row's tears start only once the pointer has rested on it
  // for a moment, so passing over rows on the way somewhere else tears
  // nothing open. The row itself still answers straight away.
  const intent = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DWELL_MS = 240;

  // The previews toggle, remembered per browser where storage allows.
  const [previews, setPreviews] = useState(true);
  const previewsRef = useRef(true);
  useEffect(() => {
    try {
      if (localStorage.getItem("cb-previews") === "off") {
        previewsRef.current = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviews(false);
      }
    } catch {
      /* storage blocked: previews stay on */
    }
  }, []);
  const togglePreviews = useCallback(() => {
    const next = !previewsRef.current;
    previewsRef.current = next;
    setPreviews(next);
    try {
      localStorage.setItem("cb-previews", next ? "on" : "off");
    } catch {
      /* storage blocked: the choice lasts until reload */
    }
    if (!next) {
      if (intent.current) clearTimeout(intent.current);
      current.current = null;
      setTears((prev) => prev.map((t) => ({ ...t, closing: true })));
    }
  }, []);
  useEffect(() => () => {
    if (intent.current) clearTimeout(intent.current);
  }, []);

  const activate = useCallback((row: ListRow, el: Element) => {
    setActive(row.id);
    if (intent.current) clearTimeout(intent.current);
    current.current = null;
    setTears((prev) => prev.map((t) => ({ ...t, closing: true })));
    if (!window.matchMedia("(hover: hover)").matches || !previewsRef.current) return;
    intent.current = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      current.current = { row, rect };
      setTears((prev) => [
        ...prev,
        ...planTears(row.previews, rect, {
          avoid: prev.filter((t) => !t.closing),
        }).map((t) => ({ ...t, closing: false })),
      ]);
    }, DWELL_MS);
  }, []);

  const deactivate = useCallback(() => {
    setActive(null);
    if (intent.current) clearTimeout(intent.current);
    current.current = null;
    setTears((prev) => prev.map((t) => ({ ...t, closing: true })));
  }, []);

  // A tear's time is up: it burns shut, and another opens somewhere else,
  // with another image where the project has one.
  const expire = useCallback((key: string) => {
    const now = previewsRef.current ? current.current : null;
    setTears((prev) => {
      const old = prev.find((t) => t.key === key);
      if (!old || old.closing) return prev;
      const next = prev.map((t) => (t.key === key ? { ...t, closing: true } : t));
      if (!now) return next;
      const open = next.filter((t) => !t.closing);
      const fresh = planTears(now.row.previews, now.rect, {
        count: 1,
        avoid: open,
        not: [old.preview.src, ...open.map((t) => t.preview.src)],
      }).map((t) => ({ ...t, closing: false }));
      return [...next, ...fresh];
    });
  }, []);

  const drop = useCallback((key: string) => {
    setTears((prev) => prev.filter((t) => t.key !== key));
  }, []);

  return (
    <>
    <button
      type="button"
      role="switch"
      aria-checked={previews}
      className="cb-previews cb-mono"
      onClick={togglePreviews}
    >
      <SwitchBleed on={previews} />
      Previews
      <span className="cb-switch" aria-hidden="true">
        <span className="cb-switch__knob" />
      </span>
    </button>
    <div className="cb-tears">
      {tears.map((t) => (
        <Tear
          key={t.key}
          spec={t}
          closing={t.closing}
          onClosed={() => drop(t.key)}
          onExpire={() => expire(t.key)}
        />
      ))}
    </div>
    <ul className="cb-rows">
      {rows.map((row) => {
        const on = active === row.id;
        const handlers = {
          onPointerEnter: (e: React.PointerEvent) => activate(row, e.currentTarget),
          onPointerLeave: deactivate,
          onFocus: (e: React.FocusEvent) => activate(row, e.currentTarget),
          onBlur: deactivate,
        };
        const body = (
          <>
            <span className="cb-row__src cb-mono">
              {row.src.map((s, i) => (
                <span key={s} className={i ? "cb-muted" : undefined}>
                  {s}
                </span>
              ))}
            </span>
            <span className="cb-row__title">{row.title}</span>
            <span className="cb-row__meta cb-mono">
              {row.meta.map((m, i) => (
                <span key={m} className={i ? "cb-muted" : undefined}>
                  {m}
                </span>
              ))}
              {row.href && <Arrow className="cb-row__arrow" />}
            </span>
            {/* Read where nothing hovers, and by screen readers everywhere. */}
            <span className="cb-row__out cb-mono">{row.run.join(" / ")}</span>
            {on && (
              <span
                className="cb-row__run"
                aria-hidden="true"
                style={
                  {
                    "--run-duration": runDuration(row.run),
                    "--delay": `${DECODE_MS}ms`,
                  } as CSSProperties
                }
              >
                <Marquee fade={false} repeat={3} className="cb-marquee">
                  {row.run.map((o) => (
                    <span key={o} className="cb-marquee__item">
                      <Decode
                        text={o}
                        when
                        duration={DECODE_MS}
                        glyphClassName="cb-glyph"
                      />
                      <Arrow className="cb-marquee__arrow" />
                    </span>
                  ))}
                </Marquee>
              </span>
            )}
          </>
        );

        let el: ReactNode;
        if (row.href && !row.external) {
          el = (
            <Link className="cb-row cb-row--linked" style={hueStyle(row)} href={row.href} data-active={on || undefined} {...handlers}>
              {body}
            </Link>
          );
        } else if (row.href) {
          el = (
            <a
              className="cb-row cb-row--linked"
              style={hueStyle(row)}
              href={row.href}
              target="_blank"
              rel="noopener"
              data-active={on || undefined}
              {...handlers}
            >
              {body}
              <span className="cb-sr">(opens the old portfolio in a new tab)</span>
            </a>
          );
        } else {
          el = (
            <div className="cb-row" data-active={on || undefined} {...handlers}>
              {body}
            </div>
          );
        }
        return <li key={row.id}>{el}</li>;
      })}
    </ul>
    </>
  );
}
