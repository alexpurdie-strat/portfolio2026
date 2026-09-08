/**
 * A marginal note: handwriting laid on the page beside the column, not in it.
 *
 * The outer span is a zero-height anchor, so the note takes no part in the
 * flow — it is pinned to wherever it sits in the document but floats out into
 * the margin, rotated, and never pushes anything around. Per the design
 * system, the margin carries attitude and never information, which is why
 * these are aria-hidden, pointer-events: none, and disappear when there is no
 * margin left to write in.
 *
 * Two surfaces:
 *   canvas — written straight onto the paper ground. The default.
 *   sheet  — written on a torn scrap laid on top of the page. The scrap has a
 *            fixed aspect and stretches to the note, so it suits a line or two
 *            at most; anything longer distorts the torn edge.
 *
 * Two marks of wear, both off by default and both chosen per note rather than
 * generated — see the design system's Texture notes on why:
 *   smudge — the pen was still wet and the hand caught the last stroke. The
 *            note reads normally right up to the final word, which loses
 *            definition and drags off to the right. Needs string children so
 *            the tail can be separated; anything else renders unsmudged.
 *   rubbed — attacked with an eraser, so the whole note is broken up.
 *            Canvas only: a torn scrap is a thing you would bin and rewrite,
 *            not rub out, so the type below makes the combination impossible
 *            rather than merely discouraged.
 */

type MarginNoteBase = {
  children: React.ReactNode;
  /** degrees of rotation — keep it under about 4 */
  tilt?: number;
  /** vertical offset from the anchor, in rem */
  nudge?: number;
  /** how far out past the edge, in rem */
  reach?: number;
  /**
   * page — column 9 of the sheet, measured as a proportion of the page. For a
   *        note that is a direct child of the page rather than of a grid row.
   * grid — the note has already been given a grid cell by its parent, so it
   *        just fills it. Used by the register, whose note sits in 9-12.
   * text — immediately past the text block it sits inside, for a note anchored
   *        within a body that is itself capped at the measure.
   */
  lane?: "page" | "grid" | "text";
  /** renders in flow instead of floating, for the design system specimen */
  demo?: boolean;
  /** the pen was still wet when the hand went past */
  smudge?: boolean;
};

export type MarginNoteProps =
  | (MarginNoteBase & {
      surface?: "canvas";
      /** rubbed out, as if the writer went at it with an eraser */
      rubbed?: boolean;
    })
  | (MarginNoteBase & {
      surface: "sheet";
      /** not available on a torn scrap — bin it and rewrite instead */
      rubbed?: never;
    });

export function MarginNote(props: MarginNoteProps) {
  const {
    children,
    tilt = -2,
    nudge = 0,
    reach = 2,
    lane = "page",
    surface = "canvas",
    demo = false,
    smudge = false,
  } = props;

  const rubbed = surface === "canvas" && Boolean(props.rubbed);

  // The drag lands on the last word only, so it has to be split off.
  const text = typeof children === "string" ? children : null;
  const dragging = smudge && !rubbed && text !== null;
  const cut = dragging ? /^([\s\S]*?)(\S+\s*)$/.exec(text) : null;
  const head = cut ? cut[1] : "";
  const tail = cut ? cut[2] : "";

  return (
    <span
      className="mnote"
      data-lane={lane}
      data-surface={surface}
      data-demo={demo || undefined}
      data-smudge={(dragging && cut !== null) || undefined}
      data-rubbed={rubbed || undefined}
      aria-hidden
      style={
        {
          "--mnote-tilt": `${tilt}deg`,
          "--mnote-nudge": `${nudge}rem`,
          "--mnote-reach": `${reach}rem`,
        } as React.CSSProperties
      }
    >
      <span className="mnote__inner">
        <span className="mnote__text">
          {cut ? (
            <>
              {head}
              <span className="mnote__tail">
                <span className="mnote__tailDrag" aria-hidden>
                  {tail}
                </span>
                <span className="mnote__tailInk">{tail}</span>
              </span>
            </>
          ) : (
            children
          )}
        </span>
      </span>
    </span>
  );
}
