// Noise Texture from Blank by Craftwork
// Copyright (c) 2026 Craftwork. Craftwork License, use in your projects, no resale: https://craftwork.design/license#components
// Source: https://github.com/craftwork-design/blank-new (f6d6614), via craftwork.design

// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/noise-texture
//
// Local changes: a plain class join instead of clsx + tailwind-merge, and the
// Tailwind sizing and opacity classes moved out to the caller, which places
// and fades it. Filter unchanged.
import * as React from "react"

/**
 * A static film-grain overlay made with `feTurbulence`. Lay it over a flat
 * fill or a gradient to take the digital edge off; it is pure SVG, so there
 * is nothing to animate and nothing to load.
 */
function NoiseTexture({
  frequency = 0.4,
  octaves = 6,
  slope = 0.15,
  noiseOpacity = 0.6,
  className,
  ...props
}: React.ComponentProps<"svg"> & {
  /** `baseFrequency` of the turbulence; higher is finer grain. */
  frequency?: number
  /** `numOctaves` of the turbulence; more adds detail at small scales. */
  octaves?: number
  /** Contrast of the grain after desaturation. */
  slope?: number
  /** Opacity of the grain layer, 0–1. */
  noiseOpacity?: number
}) {
  const id = React.useId()

  return (
    <svg
      data-slot="noise-texture"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <filter id={id}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={frequency}
          numOctaves={octaves}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope={slope} />
          <feFuncG type="linear" slope={slope} />
          <feFuncB type="linear" slope={slope} />
        </feComponentTransfer>
      </filter>
      <rect
        width="100%"
        height="100%"
        filter={`url(#${id})`}
        opacity={noiseOpacity}
      />
    </svg>
  )
}

export { NoiseTexture }
