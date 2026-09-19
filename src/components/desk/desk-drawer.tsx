"use client";

import { useEffect, useRef } from "react";

import type { Piece } from "@/content/desk";
import { asset } from "@/lib/asset";
import { findWork } from "@/content/work";

/*
 * The drawer.
 *
 * Green, because the mat is green: opening a piece should read as going into
 * the cutting mat rather than as a panel arriving from somewhere else. That
 * color match is the whole trick and it is worth protecting.
 *
 * It starts off the bottom of the screen and rises to just above vertical
 * centre. From there, scrolling moves the drawer and nothing else — the desk
 * behind is `position: fixed`, so it stays exactly where it was under a heavy
 * scrim. You are pulling a sheet up over the desk, not navigating away.
 *
 * A real dialog: focus moves in, Escape closes it, focus goes back to the
 * piece you opened.
 *
 * Content is placeholder until the copy exists — see docs. The shape is
 * implemented from Figma 166:20249 (the Ministry Brands drawer).
 */
export function DeskDrawer({
  piece,
  onClose,
}: {
  piece: Piece | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!piece) return;

    /* Always open at the bottom of the travel, so the rise is visible rather
       than the drawer appearing already half read. */
    scrollRef.current?.scrollTo(0, 0);
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      /* Keep Tab inside the panel. Behind it is a desk full of buttons that a
         reader cannot see and should not be able to reach. */
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [piece, onClose]);

  if (!piece) return null;

  const work = piece.slug ? findWork(piece.slug) : undefined;
  const title = work?.meta.title ?? piece.title ?? "";
  const subtitle = work?.meta.subtitle ?? "";

  /* The sheets shown inside the drawer. Figma stacks the two Ministry Brands
     documents; for every other piece the artifact is the piece itself, which
     is the honest placeholder until real drawer imagery is cut. */
  const sheets =
    piece.id === "mb"
      ? ["/desk/piece-mb-a.webp", "/desk/piece-mb-b.webp"]
      : [piece.src];

  return (
    <div className="drawer-layer">
      {/* The scrim is heavy on purpose: the desk has to stay legible as a
          place you came from without competing with the reading. */}
      <button
        type="button"
        className="drawer-scrim"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="drawer-scroll" ref={scrollRef}>
        <div className="drawer-spacer" aria-hidden />
        <div
          className="drawer-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          tabIndex={-1}
        >
          <button type="button" className="drawer-close" onClick={onClose}>
            Close
          </button>

          <header className="drawer-head">
            <h2 className="drawer-title" id="drawer-title">
              {title}
            </h2>
            {subtitle ? <p className="drawer-sub">{subtitle}</p> : null}
          </header>

          <p className="drawer-body">
            {work?.meta.product ??
              "This drawer is a placeholder. The copy for this piece has not been written yet — the shape, the rise and the scroll are what is being judged here."}
          </p>

          <div className="drawer-sheets">
            {sheets.map((s) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={s} alt="" src={asset(s)} className="drawer-sheet" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
