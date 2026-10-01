import { GUSSET, KRAFT } from "@/content/file";

/*
 * The concertina down the side of the file.
 *
 * This is the one element that says "expanding file" rather than "stack of
 * cards", and the one that has to change shape when a section opens — the
 * folds pull apart as the pocket takes something. A photograph of a fold
 * cannot do that; stretched, the creases smear. So it is drawn.
 *
 * Figma has it as nine strips 20px wide stacked down the left edge. Here it is
 * one path per fold, with the spacing driven by how open the file is, so the
 * same component covers both states and everything between.
 */
export function Gusset({
  /* 0 closed, 1 fully open. */
  open,
  folds = 9,
  className,
}: {
  open: number;
  folds?: number;
  className?: string;
}) {
  const pitch = GUSSET.closed + (GUSSET.open - GUSSET.closed) * open;
  const W = GUSSET.width;
  const H = folds * pitch;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* The panel the folds sit on. */}
      <rect width={W} height={H} fill={KRAFT.edge} />

      {Array.from({ length: folds }, (_, i) => {
        const y = i * pitch;
        /*
         * Seen front-on, a bellows is not a row of triangles — that is what it
         * looks like from above. From the front each fold presents a lit face
         * and the shadowed valley beneath it, so the gusset reads as a stack of
         * horizontal creases that spread apart as the file opens.
         *
         * The first pass drew the overhead view and it came out as sawtooth.
         */
        return (
          <g key={i}>
            <rect
              x={0}
              y={y}
              width={W}
              height={pitch * 0.64}
              fill={KRAFT.face}
            />
            {/* The valley, darkest where the two faces meet. */}
            <rect
              x={0}
              y={y + pitch * 0.64}
              width={W}
              height={pitch * 0.36}
              fill={KRAFT.crease}
              opacity={0.85}
            />
            {/* The crease itself catches a line of light along its ridge. */}
            <rect
              x={0}
              y={y}
              width={W}
              height={Math.max(1, pitch * 0.07)}
              fill={KRAFT.faceLit}
              opacity={0.75}
            />
          </g>
        );
      })}
    </svg>
  );
}
