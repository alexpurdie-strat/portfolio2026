"use client";

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
        {/* the glass you are looking through */}
        <div className="reader__sheen" />

        {/* The housing. Four edges rather than one framed box, so each can
            carry its own hardware and none of them has to clip content. */}
        <div className="reader__bezel reader__bezel--top">
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
          <span className="reader__tag" translate="no">
            Accession AP&#8209;2026&#8209;0031
            <span className="reader__nameplate-sep">·</span>
            Catalogued 09&#183;2026
          </span>
        </div>

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
