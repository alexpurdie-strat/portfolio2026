"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  BOARD,
  LOGOS,
  MAT,
  PIECES,
  PILE,
  POSTITS,
  STAGE,
  type Piece,
} from "@/content/desk";
import { asset } from "@/lib/asset";
import { DeskDrawer } from "@/components/desk/desk-drawer";

/*
 * Everything inside the stage is positioned as a percentage of it.
 *
 * The first attempt scaled a fixed 2022×1024 box with transform, which cannot
 * work in pure CSS: `100vw / 2022` resolves to a length, and scale() needs a
 * number. Percentages have no such problem — the stage is sized to cover the
 * viewport at the frame's aspect ratio, and every child then lands exactly
 * where Figma put it at any size. Type scales with `cqw` off the same box.
 */
const px = (v: number, of: number) => `${(v / of) * 100}%`;
const inStage = (x: number, y: number, w: number, h: number) => ({
  left: px(x, STAGE.w),
  top: px(y, STAGE.h),
  width: px(w, STAGE.w),
  height: px(h, STAGE.h),
});

/* Board-space: fractions of the box Figma composed the mat against, so the
   whole board can be resized by changing BOARD alone. */
const onBoard = (x: number, y: number, w?: number, h?: number) => ({
  left: px(x, BOARD.src.w),
  top: px(y, BOARD.src.h),
  ...(w !== undefined ? { width: px(w, BOARD.src.w) } : null),
  ...(h !== undefined ? { height: px(h, BOARD.src.h) } : null),
});

/*
 * What is currently on the desk.
 *
 * Stripped back to the surface and the mat while the composition is being
 * reworked. Nothing is deleted — the pile, the scatter and the notes all still
 * live in src/content/desk.ts with their coordinates, hit shapes and titles
 * intact, and the drawer still works. Flip a flag to put one back.
 */
const SHOW = {
  pile: false,
  logos: false,
  postits: false,
  /* Printed on the mat rather than placed on it, so it counts as the mat. */
  masthead: true,
};

/*
 * The desk.
 *
 * One fixed stage, 2022×1024, scaled to cover the viewport. The page itself
 * never scrolls — the only thing that scrolls is the drawer, and it scrolls
 * over a desk that stays exactly where it was.
 *
 * Everything sits at its Figma pixel coordinate inside the stage and the whole
 * stage is transformed as a unit, which is the only way a photographic
 * composition survives being put on the web: reflowing it would pull the pile
 * apart, and the pile is the design.
 *
 * Interactive pieces are real buttons carrying the work's title as their
 * accessible name, so a pointer, a keyboard and a screen reader all get the
 * same thing. Scenery is inert and hidden from the tree.
 */
export function DeskScene() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState<Piece | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const openPiece = useCallback((piece: Piece, el: HTMLElement) => {
    lastFocused.current = el;
    setOpen(piece);
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    /* Send focus back to the piece that was opened, or the reader is dropped
       at the top of the document with no idea where they were. */
    lastFocused.current?.focus();
  }, []);

  /* The stage is fixed, so the document must not scroll behind the drawer
     either — without this, iOS scrolls the body under an open panel. */
  useEffect(() => {
    document.documentElement.classList.add("desk-locked");
    return () => document.documentElement.classList.remove("desk-locked");
  }, []);

  return (
    <div className="desk">
      <div className="desk__stage">
        {/* ── The board: mat, printing and pile, moving as one ────────── */}
        <div className="desk__board" style={inStage(BOARD.x, BOARD.y, BOARD.w, BOARD.h)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" aria-hidden className="desk__mat-img" src={asset(MAT.src)} />

          {MAT.cuts.map((c) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={c.src}
              alt=""
              aria-hidden
              className="desk__prop desk__cut"
              src={asset(c.src)}
              style={onBoard(c.x, c.y, c.w, c.h)}
            />
          ))}

          {/* The mat's printed masthead. Live text, not baked into the photo. */}
          {SHOW.masthead ? (
          <div className="desk__masthead" style={{ color: MAT.ink }}>
            <span
              className="desk__chip"
              aria-hidden
              style={{ background: MAT.chipColor, ...onBoard(MAT.chip.x, MAT.chip.y, MAT.chip.w, MAT.chip.h) }}
            />
            <h1 className="desk__name" style={onBoard(MAT.name.x, MAT.name.y)}>
              Alex Purdie
            </h1>
            <p className="desk__role" style={onBoard(MAT.role.x, MAT.role.y)}>
              Platform
              <br />
              Strategy
            </p>
            <p className="desk__edition" style={onBoard(MAT.edition.x, MAT.edition.y)}>
              Portfolio 2026.09
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              aria-hidden
              className="desk__prop"
              src={asset(MAT.arrow.src)}
              style={onBoard(MAT.arrow.x, MAT.arrow.y, MAT.arrow.w, MAT.arrow.h)}
            />
          </div>
          ) : null}

          {/* ── The pile ────────────────────────────────────────────────── */}
          {SHOW.pile ? (
          <div className="desk__pile" style={onBoard(PILE.x, PILE.y, PILE.w, PILE.h)}>
          {PIECES.map((p) => {
            const style = {
              left: px(p.x, PILE.w),
              top: px(p.y, PILE.h),
              width: px(p.w, PILE.w),
              height: px(p.h, PILE.h),
              rotate: `${p.rotate}deg`,
              clipPath: p.clip,
              mixBlendMode: p.blend as React.CSSProperties["mixBlendMode"],
              opacity: p.opacity,
            } as React.CSSProperties;

            /* Scenery: no name, no focus, no pointer events. */
            if (!p.title) {
              return (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={p.id}
                  alt=""
                  aria-hidden
                  className="desk__scenery"
                  src={asset(p.src)}
                  style={style}
                />
              );
            }

            return (
              <button
                key={p.id}
                type="button"
                className="desk__piece"
                data-lifted={hovered === p.id || undefined}
                style={style}
                onPointerEnter={() => setHovered(p.id)}
                onPointerLeave={() => setHovered((h) => (h === p.id ? null : h))}
                onFocus={() => setHovered(p.id)}
                onBlur={() => setHovered((h) => (h === p.id ? null : h))}
                onClick={(e) => openPiece(p, e.currentTarget)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={p.alt} src={asset(p.src)} />
                {/* The title rides with the piece. Counter-rotated, because a
                    label that leans with the paper is a label nobody reads. */}
                <span className="desk__label" style={{ rotate: `${-p.rotate}deg` }}>
                  {p.title}
                </span>
              </button>
            );
          })}
          </div>
          ) : null}
        </div>

        {/* ── Post-its ──────────────────────────────────────────────────── */}
        {SHOW.postits ? POSTITS.map((n) => {
          /* One note is on the mat and one is on the desk, so they resolve
             against different boxes. */
          const place = "onBoard" in n && n.onBoard ? onBoard : inStage;
          const at = (x: number, y: number) =>
            "onBoard" in n && n.onBoard
              ? { left: px(x, BOARD.src.w), top: px(y, BOARD.src.h) }
              : { left: px(x, STAGE.w), top: px(y, STAGE.h) };
          return (
          <div key={n.id} className={`desk__postit-group${"onBoard" in n && n.onBoard ? " desk__postit-group--board" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              aria-hidden
              className="desk__prop desk__prop--bottom"
              src={asset(n.src)}
              style={{ ...place(n.x, n.y, n.w, n.h), rotate: `${n.rotate}deg` }}
            />
            <p
              className="desk__hand"
              style={{ ...at(n.text.x, n.text.y), rotate: `${n.text.rotate}deg` }}
            >
              {n.lines.map((l, i) => (
                <span key={i}>{l || " "}</span>
              ))}
            </p>
            {"second" in n && n.second ? (
              <p
                className="desk__hand"
                style={{
                  ...at(n.second.x, n.second.y),
                  rotate: `${n.second.rotate}deg`,
                  letterSpacing: `${(n.second.tracking / STAGE.w) * 100}cqw`,
                }}
              >
                <span>{n.second.text}</span>
              </p>
            ) : null}
            {"logo" in n && n.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                alt=""
                aria-hidden
                className="desk__prop desk__logo-mark"
                src={asset(n.logo.src)}
                style={{
                  ...place(n.logo.x, n.logo.y, n.logo.w, n.logo.h),
                  rotate: `${n.logo.rotate}deg`,
                }}
              />
            ) : null}
          </div>
          );
        }) : null}

        {/* ── The logo scatter ──────────────────────────────────────────── */}
        {SHOW.logos ? (
        <ul
          className="desk__logos"
          aria-label="Clients"
          style={{ inset: 0 }}
        >
          {LOGOS.map((l) => (
            <li
              key={l.k}
              className="desk__logo"
              data-lifted={hovered === `logo-${l.k}` || undefined}
              style={{ ...inStage(l.x, l.y, l.s, l.s), rotate: `${l.r}deg` }}
              onPointerEnter={() => setHovered(`logo-${l.k}`)}
              onPointerLeave={() => setHovered((h) => (h === `logo-${l.k}` ? null : h))}
            >
              {/* Not links yet — the detail copy for these does not exist, and
                  a client mark that looks clickable and is not is worse than
                  one that plainly is not. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={l.n} src={asset(`/desk/logos/${l.k}.webp`)} />
            </li>
          ))}
        </ul>
        ) : null}
      </div>

      <DeskDrawer piece={open} onClose={close} />
    </div>
  );
}
