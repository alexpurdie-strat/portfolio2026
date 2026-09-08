import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /*
   * `/contact` was renamed to `/ask`. A permanent redirect rather than a dead
   * link, because the old path may already be written down somewhere.
   */
  /* Default is bottom-left, which is where the mode switch lives. Dev-only
     either way, but a control you cannot click is a control you cannot judge. */
  devIndicators: {
    position: "top-left",
  },

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
