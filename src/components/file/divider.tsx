import { STOCKS, type Stock } from "@/content/file";

/*
 * A manila folder, drawn from the reference photograph.
 *
 * Three things in that photograph I had wrong, and they are the whole
 * difference between this and a coloured rectangle with a bump on it:
 *
 *   The stock is pale. Near ivory, not tan — a real manila folder is much
 *   lighter than the idea of one.
 *
 *   The tab is a third of the width and sits flush to an edge. Folders are cut
 *   left, centre or right in thirds; the tab does not float in the middle with
 *   air either side of it.
 *
 *   The run from tab down to shoulder is a diagonal, not a curve. That short
 *   angled cut is what the die leaves, and it reads as a folder immediately.
 */

/* The top profile of a folder is a handful of straight runs and the turns
   between them, every turn carrying the same small radius the die leaves. */
function rounded(pts: [number, number][], r: number): string {
  const out: string[] = [`M ${pts[0][0]} ${pts[0][1]}`];
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const d1 = Math.hypot(cx - px, cy - py) || 1;
    const d2 = Math.hypot(nx - cx, ny - cy) || 1;
    const r1 = Math.min(r, d1 / 2);
    const r2 = Math.min(r, d2 / 2);
    out.push(`L ${cx + ((px - cx) / d1) * r1} ${cy + ((py - cy) / d1) * r1}`);
    out.push(
      `Q ${cx} ${cy} ${cx + ((nx - cx) / d2) * r2} ${cy + ((ny - cy) / d2) * r2}`,
    );
  }
  const last = pts[pts.length - 1];
  out.push(`L ${last[0]} ${last[1]}`);
  return out.join(" ");
}

export function Divider({
  /* 0 cuts the tab flush left, 0.5 centre, 1 flush right — the three
     positions a box of folders actually comes in. */
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
  /* A third cut, as in the photograph. */
  const TAB_W = Math.round(W / 3);
  /* How far the tab stands above the shoulder. */
  const TAB_H = 96;
  /* The angled run of the die cut. */
  const DIAG = 34;
  const R = 9;

  const x = Math.round((W - TAB_W) * tab);
  const flushLeft = x <= 1;
  const flushRight = x + TAB_W >= W - 1;

  const top: [number, number][] = [];
  if (flushLeft) {
    top.push([0, 0], [TAB_W, 0], [TAB_W + DIAG, TAB_H]);
  } else {
    top.push([0, TAB_H], [x - DIAG, TAB_H], [x, 0], [x + TAB_W, 0]);
    if (!flushRight) top.push([x + TAB_W + DIAG, TAB_H]);
  }
  top.push(flushRight ? [W, 0] : [W, TAB_H]);

  const d = `${rounded(top, R)} L ${W} ${H} L 0 ${H} Z`;
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
          {/* Almost nothing. The photograph is flat card with a touch more
              light at the fold and a shade of fall-off at the foot. */}
          <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={s.lit} />
            <stop offset="0.1" stopColor={s.face} />
            <stop offset="0.9" stopColor={s.face} />
            <stop offset="1" stopColor={s.deep} />
          </linearGradient>

          {/* Fibre, fine and even. At phone size it is felt rather than seen,
              which is exactly how much of it the photograph shows. */}
          <filter id={`${uid}-fibre`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85 0.95"
              numOctaves="2"
              seed={Math.round(tab * 997)}
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0.2 0 0 0 0 0.16 0 0 0 0 0.1 0 0 0 0.055 0"
            />
          </filter>

          <clipPath id={`${uid}-clip`}>
            <path d={d} />
          </clipPath>
        </defs>

        <path d={d} fill={`url(#${uid}-face)`} />

        <g clipPath={`url(#${uid}-clip)`}>
          <rect width={W} height={H} filter={`url(#${uid}-fibre)`} />
          {/* The score the front leaf is folded on, just under the shoulder. */}
          <rect y={TAB_H + 9} width={W} height="1.2" fill={s.deep} opacity="0.5" />
        </g>

        {/* The cut edge, the pale core of the board. Along the top only — a cut
            shows where the die went, not round the buried foot. */}
        <path
          d={rounded(top, R)}
          fill="none"
          stroke={s.lit}
          strokeWidth="1.8"
          strokeOpacity="0.9"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {children}
    </div>
  );
}
