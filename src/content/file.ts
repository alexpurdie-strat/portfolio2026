/*
 * The file — mobile variant.
 *
 * Implemented from Figma: Portfolio Moodboard, 229:1828.
 *
 * Back to one folder on the table. Everything else that stood here is in git
 * through d2ebb55; this is the piece that was worth keeping.
 */

export type Stock = { face: string; lit: string; deep: string; edge: string };

/*
 * Sampled off a photograph of a real folder rather than guessed. Far paler
 * than any tan I reasoned my way to — a manila folder is close to ivory, and
 * every darker guess read as cardboard.
 *
 * Tones are dusty because pulp board takes dye badly, which is why a drawer of
 * coloured folders is always a little grey.
 */
export const STOCKS: Record<string, Stock> = {
  manila: { face: "#ecdfc0", lit: "#f7f0dd", deep: "#d8c8a2", edge: "#c3b088" },
  rust: { face: "#e0c3b4", lit: "#f0dcd1", deep: "#c7a494", edge: "#b08f80" },
  sage: { face: "#d3d6bf", lit: "#e7e9d8", deep: "#b7bb9f", edge: "#a0a489" },
  slate: { face: "#ccd3d9", lit: "#e2e7eb", deep: "#aeb7bf", edge: "#97a1aa" },
};
