import { KRAFT } from "@/content/file";

/*
 * One divider of the expanding file: a kraft panel with a cut tab along its
 * top edge.
 *
 * Drawn rather than exported. The panel is the same shape five times over —
 * Figma repeats one 449x714 vector at stepping offsets — so there is nothing
 * for a photograph to contribute that a path does not, and a path can take its
 * tab anywhere along the edge without a new asset being cut.
 *
 * The fibre is noise and the lighting is two gradients. That is enough for
 * manila, which is near-flat by nature; it would not be enough for wood, which
 * has directional figure that has to agree between adjacent pieces.
 */
export function Divider({
  /* 0 at the left edge, 1 at the right. */
  tab,
  /* Shown on the tab. */
  children,
  className,
}: {
  tab: number;
  children?: React.ReactNode;
  className?: string;
}) {
  /* The panel is drawn in its own 1000-wide space and scaled by CSS, so one
     set of numbers describes it at every size. */
  const W = 1000;
  const H = 300;
  /* Height of the cut tab above the panel's shoulder. */
  const TAB_H = 64;
  const TAB_W = 300;
  /* Radius on the tab's corners — a die-cut tab is rounded, not mitred. */
  const R = 26;

  const x = Math.round((W - TAB_W) * tab);
  const top = TAB_H;

  /* Left shoulder, up and over the tab, down to the right shoulder, then the
     body of the panel. */
  const d = [
    `M 0 ${H}`,
    `L 0 ${top + R}`,
    `Q 0 ${top} ${R} ${top}`,
    `L ${x - R} ${top}`,
    `Q ${x} ${top} ${x} ${top - R}`,
    `L ${x} ${R}`,
    `Q ${x} 0 ${x + R} 0`,
    `L ${x + TAB_W - R} 0`,
    `Q ${x + TAB_W} 0 ${x + TAB_W} ${R}`,
    `L ${x + TAB_W} ${top - R}`,
    `Q ${x + TAB_W} ${top} ${x + TAB_W + R} ${top}`,
    `L ${W - R} ${top}`,
    `Q ${W} ${top} ${W} ${top + R}`,
    `L ${W} ${H}`,
    "Z",
  ].join(" ");

  const uid = `d${Math.round(tab * 1000)}`;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="file__divider-svg"
        aria-hidden
      >
        <defs>
          {/* Light falls from the top: the tab catches it, the body sits in
              the shade of the panel in front. */}
          <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={KRAFT.faceLit} />
            <stop offset="0.28" stopColor={KRAFT.face} />
            <stop offset="1" stopColor={KRAFT.edge} />
          </linearGradient>
          {/* Paper fibre. Coarse and faint — manila is felt more than seen. */}
          <filter id={`${uid}-fibre`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9 0.04"
              numOctaves="3"
              seed={Math.round(tab * 97)}
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0.28 0 0 0 0 0.17 0 0 0 0 0.07 0 0 0 0.12 0"
            />
          </filter>
        </defs>

        <path d={d} fill={`url(#${uid}-face)`} />
        {/* Fibre, clipped to the panel so it cannot bleed past the die cut. */}
        <g clipPath={`url(#${uid}-clip)`}>
          <clipPath id={`${uid}-clip`}>
            <path d={d} />
          </clipPath>
          <rect width={W} height={H} filter={`url(#${uid}-fibre)`} />
        </g>
        {/* The cut edge itself, a shade darker than the face. */}
        <path d={d} fill="none" stroke={KRAFT.edge} strokeWidth="2.5" />
      </svg>

      {children}
    </div>
  );
}
