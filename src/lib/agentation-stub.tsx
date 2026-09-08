/**
 * Production stand-in for `agentation`.
 *
 * The toolbar is a development tool, but importing it at all pulled its whole
 * runtime — measured at 436KB — into the production bundle. Neither a
 * NODE_ENV guard on the render nor a dynamic import removed it, because the
 * module stays in the graph either way. next.config.ts aliases the package to
 * this file for production builds, so the real one is never resolved.
 */
export function Agentation() {
  return null;
}
