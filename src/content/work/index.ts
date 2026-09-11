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
        "Unstalled a 120-page platform rebuild and shipped it to 99+ Junior Achievement sites in 10 months.",
      client: "Junior Achievement",
      agency: "Whiteboard",
      years: "2025–2026",
      role: "Lead platform strategist",
      team: "13 at Whiteboard — 3 designers, 2 creative directors, 4 developers, 2 PMs, account lead",
      platform: "Tablet companion app, native and web, used inside a 4.5-hour live simulation",
      status: "live" as const,
      featured: true,
      order: 1,
      challenge:
        "How do you restart a stalled rebuild when you are the newest person on the team and nobody asked you to change how they work?",
      product:
        "The tablet companion for Finance Park — the software a student holds while they are standing in the simulation, deciding whether they can afford the apartment.",
    },
  },
] satisfies WorkEntry[]).sort((a, b) => a.meta.order - b.meta.order);

export const FEATURED = WORK.filter((w) => w.meta.featured);

export function findWork(slug: string) {
  return WORK.find((w) => w.meta.slug === slug);
}
