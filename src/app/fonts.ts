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
