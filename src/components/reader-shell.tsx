"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ReaderTransport } from "@/components/reader-transport";
import { SoundSwitch } from "@/components/sound-switch";
import { useMode } from "@/lib/mode";
import * as audio from "@/lib/reader-audio";

/*
 * The machine.
 *
 * A microform reader-printer is an optical device, not an electronic one: a
 * lamp shines up through physical film, through a lens, onto a sheet of ground
 * glass you sit in front of. There is no phosphor, no scanline, no electron
 * beam. Everything here follows from that — the hot centre and falloff of a
 * real lamp, dust sitting in the light path, a faint colour split where the
 * lens gives up at the edges, and the sheen of the glass you are looking
 * through.
 *
 * Nothing in here is interactive and nothing in here contains content. It is
 * four bezel edges drawn around the viewport plus a stack of pointer-events:
 * none light layers. Page content scrolls underneath in its own DOM, exactly
 * as it does in Studio Mode, which is why switching cannot lose scroll
 * position or unmount anything.
 *
 * Layer order matters and is the whole legibility strategy: the lamp and the
 * ground sit *behind* content, so the falloff darkens the panel rather than
 * the text. Only the glass sheen sits above, at an opacity low enough to
 * measure as no contrast change at all.
 */
export function ReaderShell() {
  const { mode } = useMode();
  const pathname = usePathname();

  /*
   * Loading a new reel: the lens comes to focus.
   *
   * A transient attribute rather than a class React owns, because the
   * animation has to be able to restart on a repeat navigation to the same
   * route — removing and re-adding the attribute is what re-triggers it.
   */
  useEffect(() => {
    if (mode !== "microfilm") return;
    const root = document.documentElement;
    /* A case study is a cartridge and gets the mechanical sequence; every
       other route is a reel already on the machine and just comes to focus. */
    const cartridge = /^\/archive\/[^/]+$/.test(pathname);
    const kind = cartridge ? "cartridge" : "reel";
    const ms = cartridge ? 660 : 420;

    delete root.dataset.threading;
    /* one frame off, so the removal lands before the re-add */
    const id = requestAnimationFrame(() => {
      root.dataset.threading = kind;
      /* A cartridge seats; a reel is already on the machine. */
      if (cartridge) audio.thunk();
      audio.nudgeIdle();
    });
    const done = window.setTimeout(() => {
      delete root.dataset.threading;
    }, ms);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(done);
      delete root.dataset.threading;
    };
  }, [mode, pathname]);

  return (
    <>
      {/* ── behind the content ── */}
      <div className="reader-ground" aria-hidden>
        {/* the lamp: hot at the centre of the gate, falling off to the edges */}
        <div className="reader-ground__lamp" />
        {/* dust on the platen and in the optical path. Static, because dust
            does not shimmer — it is *in* focus and it sits still. */}
        <div className="reader-ground__dust" />
        {/* where the lens stops correcting: a faint warm/cool split, only in
            the last few per cent of the field */}
        <div className="reader-ground__fringe" />
        {/* grain in the emulsion — only visible while the film is running */}
        <div className="reader-ground__agitate" />
        {/* the lamp wandering */}
        <div className="reader-ground__flicker" />
      </div>

      {/* ── above the content ── */}
      {/*
        The lamp's falloff, above the content and multiplied so it darkens text
        and ground by the same factor — which preserves the contrast ratio
        rather than eroding it.

        It has to be its own top-level layer, NOT a child of .reader below.
        mix-blend-mode blends an element with the backdrop of its nearest
        isolating ancestor, and .reader is a fixed, z-indexed stacking context
        — so inside it the gradient had nothing to blend with and painted
        opaquely straight over the page.
      */}
      <div className="reader-falloff" aria-hidden />

      <div className="reader" aria-hidden>
        {/* the hard edge of the film's aperture */}
        <div className="reader__gate" />

        {/* Where the film leaves the focal plane on its way in and out of the
            gate. Above the content, because it blurs what is behind it. */}
        <div className="reader__soft reader__soft--top" />
        <div className="reader__soft reader__soft--bottom" />

        {/* the glass you are looking through */}
        <div className="reader__sheen" />

        {/* The housing. Four edges rather than one framed box, so each can
            carry its own hardware and none of them has to clip content. */}
        <div className="reader__bezel reader__bezel--top">
          <span className="reader__tag" translate="no">
            Accession AP&#8209;2026&#8209;0031
            <span className="reader__nameplate-sep">·</span>
            Catalogued 09&#183;2026
          </span>
          <span className="reader__vents" />
        </div>
        <div className="reader__bezel reader__bezel--right" />
        <div className="reader__bezel reader__bezel--left" />
        <div className="reader__bezel reader__bezel--bottom">
          {/* Stamped, in the archival register the rest of the site uses. */}
          <span className="reader__nameplate" translate="no">
            Model RC&#8209;400
            <span className="reader__nameplate-sep">·</span>
            Reader&#8209;Printer
          </span>
          <span className="reader__lamp-indicator" />
          <SoundSwitch />
          <ReaderTransport />
        </div>

        {/* After the bezels, not before: the housing is painted later in DOM
            order and was covering these completely. */}
        <div className="reader__perf reader__perf--left" />
        <div className="reader__perf reader__perf--right" />

        {/* Feed above, take-up below, flanking the crank they are geared to.
            The film visibly moves from one to the other, which is the reel
            progress indicator the machine would actually have. */}
        <span className="reader__spool" data-spool="feed" />
        <span className="reader__spool" data-spool="take-up" />

        {/* Screws sit above the bezel edges so they read as holding the
            housing together rather than as dots on a panel. */}
        <span className="reader__screw reader__screw--tl" />
        <span className="reader__screw reader__screw--tr" />
        <span className="reader__screw reader__screw--bl" />
        <span className="reader__screw reader__screw--br" />
      </div>
    </>
  );
}
