"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

/*
 * Two machines, one document.
 *
 * The mode is *not* React state that renders the page. It is an attribute on
 * <html>, set before first paint, that CSS reads. Components render the same
 * DOM in both modes and the stylesheet reframes it. That is what makes content
 * parity structural rather than a promise: there is no second render tree to
 * drift, and switching cannot lose scroll position because nothing unmounts.
 *
 * React subscribes to the mode only so controls can label themselves honestly.
 */

export type Mode = "studio" | "microfilm";

/* "microfilm", not "archive". /archive is already a route — the work index —
   and two meanings of the word in one codebase is a bug waiting to be written.
   The brief offers this pair as an option; it is also the better name. */
export const MODES: readonly Mode[] = ["studio", "microfilm"];

export const MODE_KEY = "apco:mode";

/* The changeover, under the brief's 600ms. Duplicated as --dur-changeover in
   globals.css because setTimeout cannot read a custom property; if you change
   one, change the other. */
export const CHANGEOVER_MS = 420;

function isMode(value: unknown): value is Mode {
  return value === "studio" || value === "microfilm";
}

/*
 * Runs before first paint, inline in <head>, so a returning visitor never sees
 * a frame of the wrong machine. Deliberately tiny and dependency-free — it is
 * on the critical path of every page. Wrapped in try/catch because
 * localStorage throws outright in some privacy modes rather than returning
 * null, and a themed site is worth less than a site that loads.
 */
export const MODE_SCRIPT = `try{var m=localStorage.getItem("${MODE_KEY}");document.documentElement.dataset.mode=m==="microfilm"?"microfilm":"studio"}catch(e){document.documentElement.dataset.mode="studio"}`;

/* ── The store ──────────────────────────────────────────────────────────────
 * localStorage is external mutable state, so it is read through
 * useSyncExternalStore rather than copied into useState. That is what keeps
 * the server and client renders honest: getServerSnapshot answers "studio"
 * during SSR and hydration, and React re-reads the real value afterwards.
 *
 * Doing this with a lazy useState initialiser is the obvious-looking version
 * and it is a trap — the server emits aria-checked="false", the client renders
 * "true", and suppressHydrationWarning resolves the mismatch by keeping the
 * DOM, leaving the control permanently mislabelled while looking correct.
 */

const listeners = new Set<() => void>();

function readStored(): Mode {
  try {
    const stored = localStorage.getItem(MODE_KEY);
    return isMode(stored) ? stored : "studio";
  } catch {
    return "studio";
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  /* Another tab switching machines should switch this one too. */
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/* Snapshots must be primitives so React can compare them by value. */
const getSnapshot = readStored;
const getServerSnapshot = (): Mode => "studio";

function writeStored(next: Mode) {
  try {
    localStorage.setItem(MODE_KEY, next);
  } catch {
    /* Refusing to remember the choice is not a reason to refuse to make it. */
  }
  listeners.forEach((notify) => notify());
}

type ModeContextValue = {
  mode: Mode;
  setMode: (next: Mode) => void;
  toggle: () => void;
  /* True only while the changeover plays. Chrome reads it to hold still
     rather than animating its own entrance on top of the transition. */
  shifting: boolean;
};

const ModeContext = createContext<ModeContextValue | null>(null);

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be called inside <ModeProvider>");
  return ctx;
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [shifting, setShifting] = useState(false);

  /*
   * Re-apply the root attribute after React's development remount.
   *
   * Strict Mode remounts once and resets <html> to only the attributes React
   * manages from JSX, wiping the one the pre-paint script set — without this
   * the page renders as Studio while localStorage says microfilm. A layout
   * effect runs before paint, so the correction is never visible. In
   * production it just rewrites the value already there.
   */
  useLayoutEffect(() => {
    document.documentElement.dataset.mode = readStored();
  }, []);

  const setMode = useCallback((next: Mode) => {
    const root = document.documentElement;
    if (root.dataset.mode === next) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /*
     * Keep the reader's place across the reflow.
     *
     * The machine's housing occupies real space, so entering Microfilm Mode
     * adds a bezel's worth of padding above the content and everything slides
     * down — measured at 59px, which is a visible jump in the middle of a
     * paragraph. Scroll position in *pixels* is preserved either way; what
     * matters is the position in the *document*, so the shift is measured and
     * given back.
     *
     * Not at the top of the page, though: there the housing legitimately
     * consumes space and compensating would scroll the masthead under it.
     */
    const main = document.querySelector("main");
    const wasTop = main?.getBoundingClientRect().top ?? 0;

    /* The attribute drives the whole visual change, so it flips once and
       everything downstream follows from CSS. */
    root.dataset.modeShift = reduced ? "fade" : "power";
    root.dataset.mode = next;
    writeStored(next);
    setShifting(true);

    if (main) {
      requestAnimationFrame(() => {
        const drift = main.getBoundingClientRect().top - wasTop;
        if (drift !== 0 && window.scrollY > Math.abs(drift)) {
          window.scrollBy(0, drift);
        }
      });
    }

    window.setTimeout(() => {
      delete root.dataset.modeShift;
      setShifting(false);
    }, CHANGEOVER_MS);
  }, []);

  const toggle = useCallback(() => {
    setMode(readStored() === "microfilm" ? "studio" : "microfilm");
  }, [setMode]);

  const value = useMemo(
    () => ({ mode, setMode, toggle, shifting }),
    [mode, setMode, toggle, shifting],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}
