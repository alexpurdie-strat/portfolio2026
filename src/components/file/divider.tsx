import { STOCKS, type Stock } from "@/content/file";

/*
 * One file folder: a card panel with a cut tab along its top edge.
 *
 * Drawn rather than exported, and the first attempt at that was wrong. Two
 * gradients and a whisper of noise gave plastic — card has a long tonal range,
 * a lit roll where it bends over the top edge, and fibre coarse enough to see.
 * All three are here now.
 *
 * What is still true: the shape is one panel repeated, and a path can put its
 * tab anywhere along the edge without a new asset being cut.
 */
export function Divider({
  /* 0 at the left edge, 1 at the right. */
  tab,
  stock,
  children,
  className,
}: {
  tab: number;
  stock: keyof typeof STOCKS;
  children?: React.ReactNode;
  className?: string;
}) {
  const s: Stock = STOCKS[stock];

  /* Drawn in its own 1000-wide space and scaled by CSS, so one set of numbers
     describes the folder at every size. */
  const W = 1000;
  const H = 340;
  const TAB_H = 60;
  const TAB_W = 300;
  const R = 22;

  const x = Math.round((W - TAB_W) * tab);
  const top = TAB_H;

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

  const uid = `f${stock}${Math.round(tab * 1000)}`;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="file__divider-svg"
        aria-hidden
      >
        <defs>
          {/*
            Four stops, not two. The top edge is the roll where the card folds
            over and catches the light; under it the face falls away into the
            shade of whatever sits in front.
          */}
          <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={s.lit} />
            <stop offset="0.06" stopColor={s.face} />
            <stop offset="0.55" stopColor={s.face} />
            <stop offset="1" stopColor={s.deep} />
          </linearGradient>

          {/* Fibre. Coarse across the grain, fine along it, the way card is
              actually made — and strong enough to read at phone size. */}
          <filter id={`${uid}-fibre`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 1.4"
              numOctaves="4"
              seed={Math.round(tab * 997)}
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0.16 0 0 0 0 0.1 0 0 0 0 0.04 0 0 0 0.3 0"
            />
          </filter>

          <clipPath id={`${uid}-clip`}>
            <path d={d} />
          </clipPath>
        </defs>

        <path d={d} fill={`url(#${uid}-face)`} />

        <g clipPath={`url(#${uid}-clip)`}>
          <rect width={W} height={H} filter={`url(#${uid}-fibre)`} />
          {/* The crease a folder keeps from being folded, a little below the
              top edge. */}
          <rect y={top + 10} width={W} height="2" fill={s.deep} opacity="0.45" />
          {/* And the shadow the folder in front casts down its face. */}
          <rect
            width={W}
            height={H}
            fill={`url(#${uid}-cast)`}
            opacity="0.5"
          />
        </g>

        <linearGradient id={`${uid}-cast`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1708" stopOpacity="0.5" />
          <stop offset="0.3" stopColor="#2a1708" stopOpacity="0" />
        </linearGradient>

        <path d={d} fill="none" stroke={s.edge} strokeWidth="2" />
      </svg>

      {children}
    </div>
  );
}
