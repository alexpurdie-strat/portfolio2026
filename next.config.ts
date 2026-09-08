import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /*
   * `/contact` was renamed to `/ask`. A permanent redirect rather than a dead
   * link, because the old path may already be written down somewhere.
   */
  /*
   * Off entirely rather than repositioned.
   *
   * Microfilm Mode's housing occupies all four edges of the viewport, so
   * there is no corner left for a floating dev badge to sit in without
   * covering hardware — at top-left it sat on the accession tag, at
   * bottom-left on the mode switch. Compile and runtime errors still surface
   * in the console and in the terminal, which is where they were being read
   * from anyway.
   */
  devIndicators: false,

  async redirects() {
    return [{ source: "/contact", destination: "/ask", permanent: true }];
  },
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
