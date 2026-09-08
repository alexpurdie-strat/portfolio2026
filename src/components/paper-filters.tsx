/**
 * Filter definitions used by the paper treatments. Rendered once in the root
 * layout — an SVG filter has to live in the document to be referenced by
 * `filter: url(#…)`, so this is a hidden host for it rather than anything
 * visible.
 */
export function PaperFilters() {
  return (
    <svg
      aria-hidden
      focusable="false"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
      }}
    >
      <defs>
        {/*
          Rubbed out — the writer went at it with an eraser.

          Grown out of the Figma stack on node 16:879 (Texture S 4 · R 11.5 +
          Layer blur Uniform 1). Order matters more than the numbers: blurring
          last would smear the grain into haze, which is what made an earlier
          version read as nothing but a blur.

          Distortion comes in two passes, because one does not look like an
          eraser. The coarse field wobbles whole strokes off their line; the
          fine field then chews their edges. Grain removes ink on top of that:
          feFuncA `discrete` snaps the noise to hard 0/1 bands, so the ink is
          speckled away rather than faded — soft noise looks like fog, hard
          noise looks like graphite lifted off paper. Finally the coarse field
          is reused as patches, so the eraser clearly bore down unevenly.
        */}
        <filter
          id="rubbed-out"
          x="-40%"
          y="-55%"
          width="180%"
          height="210%"
          colorInterpolationFilters="sRGB"
        >
          {/* both noise fields up front, so each can be used twice */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.09"
            numOctaves="2"
            seed="11"
            result="coarse"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="4"
            seed="7"
            result="fine"
          />

          {/* barely soften — a rubbed line goes slightly fuzzy, no more */}
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="0.35"
            result="soft"
          />

          {/* wobble the strokes off their line, then chew their edges */}
          <feDisplacementMap
            in="soft"
            in2="coarse"
            scale="11"
            xChannelSelector="R"
            yChannelSelector="G"
            result="wobbled"
          />
          <feDisplacementMap
            in="wobbled"
            in2="fine"
            scale="3.5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="ragged"
          />

          {/* fine grain -> alpha, snapped hard, eats the ink */}
          <feColorMatrix
            in="fine"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"
            result="fineAlpha"
          />
          <feComponentTransfer in="fineAlpha" result="speckle">
            <feFuncA type="discrete" tableValues="0 1 1 0 1 1 0 1 1 1" />
          </feComponentTransfer>
          <feComposite
            in="ragged"
            in2="speckle"
            operator="in"
            result="grained"
          />

          {/* coarse patches -> alpha, where the eraser bore down */}
          <feColorMatrix
            in="coarse"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 1 0 0 0"
            result="coarseAlpha"
          />
          <feComponentTransfer in="coarseAlpha" result="patches">
            <feFuncA type="table" tableValues="0.25 1 0.55 1 0.35" />
          </feComponentTransfer>
          <feComposite in="grained" in2="patches" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
