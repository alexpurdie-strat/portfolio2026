"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import * as audio from "@/lib/reader-audio";

/*
 * The machine's own speaker switch, on the housing.
 *
 * Off on a first visit, always. The audio engine is not even constructed
 * until this is pressed, so a visitor who never touches it pays nothing and
 * there is no autoplay for a browser to block.
 */

export const SOUND_KEY = "apco:sound";

/* Read through a store for the same reason the mode is: the server has no
   localStorage, so a lazy useState initialiser would render aria-pressed
   differently on each side and suppressHydrationWarning would resolve it by
   keeping the server's — leaving the control permanently mislabelled. */
const listeners = new Set<() => void>();

function readStored(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

const getServerSnapshot = () => false;

export function SoundSwitch() {
  const on = useSyncExternalStore(subscribe, readStored, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = !readStored();
    try {
      localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {
      /* not remembering the choice is not a reason to refuse it */
    }
    listeners.forEach((notify) => notify());
    if (next) void audio.start();
    else audio.stop();
  }, []);

  /* A stored "on" arms the switch but does not start the engine: resuming
     audio wants a gesture, and a page that begins humming because of
     something you clicked yesterday is a page that autoplays. The first real
     interaction starts it. */
  useEffect(() => {
    if (!on || audio.isRunning()) return;
    const go = () => void audio.start();
    window.addEventListener("pointerdown", go, { once: true });
    window.addEventListener("keydown", go, { once: true });
    return () => {
      window.removeEventListener("pointerdown", go);
      window.removeEventListener("keydown", go);
    };
  }, [on]);

  /* Nothing plays to an unfocused tab. */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) audio.pause();
      else if (on) audio.wake();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", audio.pause);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", audio.pause);
    };
  }, [on]);

  return (
    <button
      type="button"
      className="sound-switch"
      aria-pressed={on}
      onClick={toggle}
    >
      <span className="sr-only">Machine sound</span>
      <span className="sound-switch__grille" aria-hidden />
      <span className="sound-switch__lamp" aria-hidden />
    </button>
  );
}
