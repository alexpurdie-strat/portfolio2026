import type { ComponentType } from "react";
import HomeDepot from "./home-depot.mdx";
import HundredShapes from "./100-shapes.mdx";
import ItvStudiosPortal from "./itv-studios-portal.mdx";
import JaFinancePark from "./ja-finance-park.mdx";
import YourMove from "./your-move.mdx";

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
  /*
   * What cycles in the image area on the home page. Three, to match the frames
   * the scroll model steps through. Omitted where no imagery exists yet — the
   * stage falls back to setting the challenge as display type rather than
   * showing an empty block, which is a better answer than a grey rectangle and
   * an honest one.
   */
  images?: { src: string; alt: string }[];
  /*
   * The hue the home page washes toward while this project is on screen, taken
   * from the work itself rather than invented. Kept low and resolved back to
   * paper, because the ground is still an editorial one — this is meant to be
   * noticed on the way past, not looked at.
   */
  tint?: string;
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
      tint: "#2B5BE8",
      images: [
        { src: "/work/ja-finance-park/storefront-in-room.webp", alt: "A tablet held in front of a real storefront inside a Finance Park facility, showing that storefront unlocked." },
        { src: "/work/ja-finance-park/tablets-array.webp", alt: "Eight tablets showing the shipped product — avatar, budget balancing, savings, and the running total." },
        { src: "/work/ja-finance-park/budget-complete.webp", alt: "A student's budget-balancing round marked complete, beside the screen where tax cards are revealed." },
      ],
    },
  },
  {
    Body: ItvStudiosPortal,
    meta: {
      slug: "itv-studios-portal",
      title: "ITV Studios Portal",
      subtitle:
        "Systemized how ITV delivers its shows, then built the design system and governance to hold it.",
      client: "ITV Studios",
      agency: "100 Shapes",
      years: "2021–2024",
      role: "Embedded product designer, then design system lead",
      team: "TODO(alex): ITV internal development teams plus who from 100 Shapes",
      platform:
        "Web platform for production managers, planning through post-transmission",
      status: "live" as const,
      featured: true,
      order: 2,
      challenge:
        "What do you build for someone with nine thousand things to do, when the one they forget is the one that matters?",
      product:
        "Studios Portal — a single point of origin for production tasks, replacing a set of processes that had never been designed as a set.",
      tint: "#1D2B4A",
      images: [
        { src: "/work/itv/welcome-onboarding.webp", alt: "The portal's home screen behind a welcome tour explaining where a production's tasks live." },
        { src: "/work/itv/asset-gallery.webp", alt: "A grid of sixteen episode stills in the portal's asset library, each with its filename and size." },
        { src: "/work/itv/episode-clip-timecode.webp", alt: "Selecting an extract clip by timecode, with the source footage playing alongside the fields." },
      ],
    },
  },
  {
    Body: YourMove,
    meta: {
      slug: "your-move",
      title: "Your Move",
      subtitle:
        "Built a working AI prototype on day one, and learned which parts of discovery it cannot skip.",
      client: "Your Move",
      agency: "Whiteboard",
      years: "2026",
      role: "Lead platform strategist",
      team: "6 at Whiteboard — UI designer, creative director, PM, account lead, developer",
      platform: "Mobile web personal development coach",
      status: "in development" as const,
      featured: true,
      order: 3,
      challenge:
        "What happens when building the thing becomes cheaper than deciding what to build?",
      product:
        "A self-guided coaching platform, prototyped to the point of being mistaken for the real product before a line of it was built.",
      tint: "#5A6B5E",
    },
  },
  {
    Body: HundredShapes,
    meta: {
      slug: "100-shapes",
      title: "Building the practice",
      subtitle:
        "Built the structure that let eight designers get better on purpose rather than by accident.",
      client: "100 Shapes",
      years: "2021–2024",
      role: "Head of Product Design",
      team: "8 designers led, 4 hired, a 20-person contractor pool",
      platform: "A design practice, in London",
      status: "live" as const,
      featured: true,
      order: 4,
      challenge:
        "How do you install a growth structure in a team that has not asked for one and is fully booked?",
      product:
        "Skills matrices, growth rubrics, weekly critique and pairing — the scaffolding a design practice needs to improve on purpose.",
      tint: "#3A9E1E",
      images: [
        { src: "/work/100-shapes/skill-definitions.webp", alt: "Twelve design skills defined across three families — craft, management and impact." },
        { src: "/work/100-shapes/responsibility-matrix.webp", alt: "The role responsibility matrix, reading six dimensions across four levels of seniority." },
        { src: "/work/100-shapes/skills-matrix-full.webp", alt: "The full skills matrix on a tablet, twelve skills against five named levels of proficiency." },
      ],
    },
  },
  {
    Body: HomeDepot,
    meta: {
      slug: "home-depot",
      title: "The Home Depot",
      subtitle:
        "Designed the tools two thousand stores use, across three teams and with authority over none of them.",
      client: "The Home Depot",
      years: "2018",
      role: "UX designer, contract",
      team: "TODO(alex): who else, across the three streams",
      platform: "Enterprise retail — rental, sign-on and departmental reporting",
      status: "live" as const,
      featured: true,
      order: 5,
      challenge:
        "How do you get anything adopted across three teams when you report to none of them?",
      product:
        "Truck rental, single sign-on for 2,000+ stores, and the reporting a paint manager acts on — all of it used standing up, with a customer waiting.",
      tint: "#B8752A",
      images: [
        { src: "/work/home-depot/sign-on-landing.avif", alt: "The sign-on screen offering a list of names to pick from rather than an empty username field." },
        { src: "/work/home-depot/paint-dashboard.avif", alt: "The paint department's performance view, ranking it within its store, district and region." },
        { src: "/work/home-depot/truck-rental.avif", alt: "The truck rental booking screen, with pickup and return stores shown side by side." },
      ],
    },
  },
] satisfies WorkEntry[]).sort((a, b) => a.meta.order - b.meta.order);

export const FEATURED = WORK.filter((w) => w.meta.featured);

export function findWork(slug: string) {
  return WORK.find((w) => w.meta.slug === slug);
}
