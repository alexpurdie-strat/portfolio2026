"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { asset } from "@/lib/asset";
import { WORK } from "@/content/work";

/*
 * The drawer.
 *
 * A panel rises from the bottom carrying the client's stamp, covers the page
 * while the next one loads, then drops back out of frame to reveal it. The
 * cover is doing real work — a route change repaints the whole page and resets
 * the scroll, and this is what turns that into something deliberate rather
 * than a flash.
 *
 * The whole thing is skipped under `prefers-reduced-motion`: a full-screen
 * panel crossing the viewport is precisely the movement that preference is
 * about, and there is nothing here a reader needs.
 */

const UP = 420; // rise, covering the page
const HOLD = 240; // long enough for the stamp to land and be read
const DOWN = 460; // fall, revealing the new page

type Go = (href: string, slug?: string) => void;
const TransitionContext = createContext<Go | null>(null);

/* Falls back to a plain push wherever the provider is absent, so a link can
   never become a dead end just because it was rendered outside the tree. */
export function useTransitionTo(): Go {
  const ctx = useContext(TransitionContext);
  const router = useRouter();
  return ctx ?? ((href) => router.push(href));
}

const strip = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "up" | "down">("idle");
  const [slug, setSlug] = useState<string | null>(null);
  const stampBg = slug
    ? WORK.find((w) => w.meta.slug === slug)?.meta.stampBg
    : undefined;
  const target = useRef<string | null>(null);

  /* Warmed after mount, off the critical path. A stamp that decodes while the
     drawer is already up arrives late to its own entrance. */
  useEffect(() => {
    const id = window.setTimeout(() => {
      for (const w of WORK) {
        const img = new window.Image();
        img.src = asset(`/stamps/${w.meta.slug}.png`);
      }
    }, 1200);
    return () => window.clearTimeout(id);
  }, []);

  const go = useCallback<Go>(
    (href, s) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || strip(href) === strip(pathname)) {
        router.push(href);
        return;
      }
      target.current = href;
      setSlug(s ?? null);
      setPhase("up");
    },
    [router, pathname],
  );

  /* Covered: fetch the next page behind the panel. */
  const onCovered = useCallback(() => {
    if (target.current) router.push(target.current);
  }, [router]);

  /* Arrived: hold a beat so the stamp is not a flicker, then drop. */
  useEffect(() => {
    if (phase !== "up" || !target.current) return;
    if (strip(pathname) !== strip(target.current)) return;
    const id = window.setTimeout(() => {
      target.current = null;
      setPhase("down");
    }, HOLD);
    return () => window.clearTimeout(id);
  }, [pathname, phase]);

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div
        className="drawer"
        data-phase={phase}
        aria-hidden
        onTransitionEnd={(e) => {
          if (e.propertyName !== "transform") return;
          if (phase === "up") onCovered();
          else if (phase === "down") setPhase("idle");
        }}
        style={
          {
            "--up": `${UP}ms`,
            "--down": `${DOWN}ms`,
            /* The client's colour while one is in hand; ink otherwise, which is
               what the home link and any stampless route get. */
            ...(stampBg ? { background: stampBg } : null),
          } as React.CSSProperties
        }
      >
        {slug ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className="drawer__stamp" src={asset(`/stamps/${slug}.png`)} alt="" />
        ) : null}
      </div>
    </TransitionContext.Provider>
  );
}
