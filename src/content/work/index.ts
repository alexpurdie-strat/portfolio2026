import type { ComponentType } from "react";
import JaFinancePark from "./ja-finance-park.mdx";

/*
 * The work registry.
 *
 * Facts live here as typed data; prose lives in the .mdx beside it. Neither is
 * a component, so copy and facts can both be edited without touching one — and
 * the facts get a schema, which is what stops a case study shipping without a
 * role or a status.
 *
 * Explicit rather than filesystem-globbed: a static export needs its routes
 * known at build time, and the list is also the ordering.
 */

export type WorkMeta = {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  agency?: string;
  years: string;
  role: string;
  team: string;
  platform: string;
  status: "live" | "pilot" | "in development" | "concept";
  featured: boolean;
  order: number;
  challenge: string;
  product: string;
};

export type WorkEntry = { meta: WorkMeta; Body: ComponentType };

export const WORK: WorkEntry[] = ([
  {
    Body: JaFinancePark,
    meta: {
      slug: "ja-finance-park",
      title: "JA Finance Park & BizTown",
      subtitle:
        "Turned a stalled platform rebuild into a shipped product running in 99+ Junior Achievement sites.",
      client: "Junior Achievement",
      agency: "Whiteboard",
      years: "2025–2026",
      role: "Lead platform strategist",
      team: "TODO(alex): team size and disciplines",
      platform: "Tablet-first web platform, used in physical simulation sites",
      status: "live" as const,
      featured: true,
      order: 1,
      challenge:
        "How do you rebuild a platform that 99+ sites already depend on, without stopping a single one of them?",
      product:
        "A tablet platform that runs the Finance Park and BizTown simulations — the software students use while they are standing in the room.",
    },
  },
] satisfies WorkEntry[]).sort((a, b) => a.meta.order - b.meta.order);

export const FEATURED = WORK.filter((w) => w.meta.featured);

export function findWork(slug: string) {
  return WORK.find((w) => w.meta.slug === slug);
}
