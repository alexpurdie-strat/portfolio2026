import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/*
 * The site is deployed to GitHub Pages, which serves files and nothing else.
 *
 * `basePath` comes from the environment rather than being hardcoded, because a
 * project page lives under /portfolio2026 while `next dev` and a local
 * `next build` want to run at the root. The deploy workflow sets it; nothing
 * else does, so local work is unaffected.
 */
/* NEXT_PUBLIC_ so the same value is readable from src/lib/asset.ts, which
   has to prefix paths into public/ that Next passes through untouched. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  /*
   * Every route here is already static or SSG — no route handlers, no server
   * actions, no cookies() or headers() — so the whole site exports to plain
   * files. `next build` now writes ./out.
   */
  output: "export",
  basePath,
  /*
   * Trailing slashes so each route exports as a directory with an index.html
   * rather than a bare .html file. Static hosts resolve /about/ unambiguously;
   * extensionless /about depends on the host guessing.
   */
  trailingSlash: true,
  images: {
    /*
     * The optimiser is a server, and there is no server. Sources are already
     * sized for their use, so this ships them as they are.
     */
    unoptimized: true,
  },
  /*
   * `/contact` was renamed to `/ask`. This used to be a redirects() entry,
   * which is a server feature and does not survive `output: export` — the
   * replacement is a static page at public/contact/index.html that bounces.
   */
  turbopack: {
    /*
     * `agentation` is a development-only visual feedback toolbar. Guarding the
     * render was not enough to keep it out of the production bundle — it still
     * cost 436KB — so production builds resolve it to a no-op stub instead.
     */
    resolveAlias: isProduction
      ? { agentation: "./src/lib/agentation-stub.tsx" }
      : {},
  },
};

export default nextConfig;
