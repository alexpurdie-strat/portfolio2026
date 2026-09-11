/*
 * Prefixes a path in public/ with the deployment's base path.
 *
 * GitHub Pages serves a project repo from a subdirectory, so the site lives at
 * /portfolio2026 rather than at the root. Next rewrites its own emitted URLs
 * for that automatically — routes, bundles, and any image brought in by a
 * static import — but a string pointing into public/ is passed through exactly
 * as written. With `images.unoptimized` that string *is* the final src, so
 * every plate, collage cutout and demo image resolved to the domain root and
 * 404'd: 95 broken references across 9 pages.
 *
 * Reads the same variable next.config.ts uses for basePath, so the two cannot
 * drift. Empty in development and in a local build, which is why `next dev`
 * still runs at the root.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE}${path}`;
}
