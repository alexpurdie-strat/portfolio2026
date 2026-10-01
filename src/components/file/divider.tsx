import { STOCKS, type Stock } from "@/content/file";

/*
 * One file folder: a sheet of card folded once, with a tab die-cut into the
 * front leaf's top edge.
 *
 * Two earlier attempts at this read as plastic and then as brushed metal. The
 * things that were wrong, because they are the things that make card:
 *
 *   The grain ran one way. `baseFrequency 0.04 1.4` is low across and high
 *   down, which is vertical streaking — metal, not paper. Card fibre is fine
 *   in both directions with only a slight bias, and it is a mottle rather than
 *   a stripe.
 *
 *   The face was a long ramp from light to dark. Manila is close to even; what
 *   little range it has comes from the fold catching light at the top, not
 *   from a gradient down the whole sheet.
 *
 *   The edges were all one treatment. A folder has two kinds: the top is a
 *   fold, soft and lit, and the sides and tab are cut, showing the pale core
 *   of the board. Drawing both as a dark outline is what made it look printed.
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

  const W = 1000;
  const H = 340;
  /* Deep enough to write on. At 58 the tab was 15px on screen against 16px
     type, so every label straddled the fold score below it — you would not
     write across the crease of a real folder either. */
  const TAB_H = 100;
  const TAB_W = 300;
  const R = 14;
  /* The die taper: a folder tab is narrower at the top than at its shoulder,
     so the cut sides lean in. Square sides are the giveaway of a drawn one. */
  const TAPER = 16;

  const x = Math.round((W - TAB_W) * tab);
  const top = TAB_H;

  const d = [
    `M 0 ${H}`,
    `L 0 ${top}`,
    `L ${x - 2} ${top}`,
    /* up the leaning cut, rounded where the die turns */
    `L ${x + TAPER - R * 0.4} ${R}`,
    `Q ${x + TAPER} 0 ${x + TAPER + R} 0`,
    `L ${x + TAB_W - TAPER - R} 0`,
    `Q ${x + TAB_W - TAPER} 0 ${x + TAB_W - TAPER + R * 0.4} ${R}`,
    `L ${x + TAB_W + 2} ${top}`,
    `L ${W} ${top}`,
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
          {/* Nearly flat. The only real move is the fold at the top catching
              light, and it happens in the first few percent. */}
          <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={s.lit} />
            <stop offset="0.04" stopColor={s.face} />
            <stop offset="0.85" stopColor={s.face} />
            <stop offset="1" stopColor={s.deep} />
          </linearGradient>

          {/* Fibre: fine, near-isotropic, barely there. */}
          <filter id={`${uid}-fibre`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9 1.1"
              numOctaves="2"
              seed={Math.round(tab * 997)}
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0.18 0 0 0 0 0.12 0 0 0 0 0.05 0 0 0 0.07 0"
            />
          </filter>

          {/* Mottle: the broad unevenness of pulp board, an order of magnitude
              coarser than the fibre and just as faint. */}
          <filter id={`${uid}-mottle`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05 0.08"
              numOctaves="3"
              seed={Math.round(tab * 131) + 7}
              result="m"
            />
            <feColorMatrix
              in="m"
              type="matrix"
              values="0 0 0 0 0.2 0 0 0 0 0.14 0 0 0 0 0.06 0 0 0 0.055 0"
            />
          </filter>

          <clipPath id={`${uid}-clip`}>
            <path d={d} />
          </clipPath>
        </defs>

        <path d={d} fill={`url(#${uid}-face)`} />

        <g clipPath={`url(#${uid}-clip)`}>
          <rect width={W} height={H} filter={`url(#${uid}-mottle)`} />
          <rect width={W} height={H} filter={`url(#${uid}-fibre)`} />

          {/* The score the folder is folded along, a little under the lip. */}
          <rect y={top + 7} width={W} height="1.5" fill={s.deep} opacity="0.3" />
          <rect y={top + 8.5} width={W} height="1" fill={s.lit} opacity="0.3" />
        </g>

        {/* The cut edge: the pale core of the board, not a dark outline — the
            single detail that says this was guillotined rather than printed.
            Only along the top, where the cut actually shows. The bottom is
            buried in the folder behind and a bright line there reads as a
            sticker outline. */}
        <path
          d={`M 0 ${top} L ${x - 2} ${top} L ${x + TAPER - R * 0.4} ${R} Q ${x + TAPER} 0 ${x + TAPER + R} 0 L ${x + TAB_W - TAPER - R} 0 Q ${x + TAB_W - TAPER} 0 ${x + TAB_W - TAPER + R * 0.4} ${R} L ${x + TAB_W + 2} ${top} L ${W} ${top}`}
          fill="none"
          stroke={s.lit}
          strokeWidth="1.6"
          strokeOpacity="0.8"
          strokeLinejoin="round"
        />
        {/* And the shoulder line where the front leaf meets what is behind. */}
        <path
          d={`M 0 ${H} L 0 ${top} L ${x - 2} ${top} M ${x + TAB_W + 2} ${top} L ${W} ${top} L ${W} ${H}`}
          fill="none"
          stroke={s.edge}
          strokeWidth="1"
          strokeOpacity="0.5"
        />
      </svg>

      {children}
    </div>
  );
}
