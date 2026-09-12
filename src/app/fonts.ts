import localFont from "next/font/local";

export const martinaPlantijn = localFont({
  src: [
    {
      path: "../fonts/test-martina-plantijn-vf-roman.woff2",
      style: "normal",
      weight: "300 900",
    },
    {
      path: "../fonts/test-martina-plantijn-vf-italic.woff2",
      style: "italic",
      weight: "300 900",
    },
  ],
  variable: "--font-martina-plantijn",
  display: "swap",
});

/**
 * The Blank Weirdos — four static cuts of the same design. The base carries the
 * full 518-glyph set; Alt 1–3 are 392-glyph alternates, so they are separate
 * families rather than weights or styles of one.
 */
export const blankWeirdos = localFont({
  src: "../fonts/the-blank-weirdos-regular.woff2",
  variable: "--font-blank-weirdos",
  display: "swap",
});

export const blankWeirdosAlt1 = localFont({
  src: "../fonts/the-blank-weirdos-alt1-regular.woff2",
  variable: "--font-blank-weirdos-alt1",
  display: "swap",
});

export const blankWeirdosAlt2 = localFont({
  src: "../fonts/the-blank-weirdos-alt2-regular.woff2",
  variable: "--font-blank-weirdos-alt2",
  display: "swap",
  preload: false,
});

export const blankWeirdosAlt3 = localFont({
  src: "../fonts/the-blank-weirdos-alt3-regular.woff2",
  variable: "--font-blank-weirdos-alt3",
  display: "swap",
  preload: false,
});

/*
 * Metric — Klim Type Foundry.
 *
 * Seven weights with a true italic for each, declared as one family so the
 * browser picks the real cut rather than synthesising one. That range is the
 * point: the previous sans had a regular and a bold, which is why the type on
 * this site had a top and a bottom and nothing in between.
 *
 * These are Klim's TEST fonts. They are licensed for evaluation and mockups,
 * not for a public production site — see docs/open-questions.md. A retail
 * licence swaps the files and nothing else.
 */
export const metric = localFont({
  src: [
    { path: "../fonts/test-metric-thin.woff2", weight: "100", style: "normal" },
    { path: "../fonts/test-metric-thin-italic.woff2", weight: "100", style: "italic" },
    { path: "../fonts/test-metric-light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/test-metric-light-italic.woff2", weight: "300", style: "italic" },
    { path: "../fonts/test-metric-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/test-metric-regular-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/test-metric-medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/test-metric-medium-italic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/test-metric-semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/test-metric-semibold-italic.woff2", weight: "600", style: "italic" },
    { path: "../fonts/test-metric-bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/test-metric-bold-italic.woff2", weight: "700", style: "italic" },
    { path: "../fonts/test-metric-black.woff2", weight: "900", style: "normal" },
    { path: "../fonts/test-metric-black-italic.woff2", weight: "900", style: "italic" },
  ],
  variable: "--font-metric",
  display: "swap",
  /* Metric's metrics, so the fallback does not reflow the page when it swaps. */
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
