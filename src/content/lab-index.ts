/*
 * Concept 3 — the index both lab directions read from. Every figure here is
 * taken from src/content/work/index.ts or docs/work-context.md; nothing is
 * rounded, inflated or invented.
 */

import { ARCHIVE } from "./archive";

/* The role as concept 3 states it. SITE.role still carries the live site's
   wording, which feeds page titles and metadata beyond this lab. */
export const ROLE = "Digital Strategist";

export type IndexRow = {
  slug: string;
  title: string;
  client: string;
  role: string;
  years: string;
  status: "live" | "in development";
  outcomes: string[];
};

export const INDEX: IndexRow[] = [
  {
    slug: "ja-finance-park",
    title: "JA Finance Park",
    client: "Junior Achievement",
    role: "Lead platform strategist",
    years: "2025-2026",
    status: "live",
    outcomes: ["120-page rebuild unstalled", "Shipped to 99+ sites", "10 months"],
  },
  {
    slug: "itv-studios-portal",
    title: "ITV Studios Portal",
    client: "ITV Studios",
    role: "Design system lead",
    years: "2021-2024",
    status: "live",
    outcomes: [
      "25,000+ tasks a month",
      "£400k in hours saved",
      "24 processes streamlined",
      "20+ task types",
    ],
  },
  {
    slug: "home-depot",
    title: "The Home Depot",
    client: "The Home Depot",
    role: "UX designer, contract",
    years: "2018",
    status: "live",
    outcomes: [
      "2,000+ stores",
      "7m 25s saved per login",
      "$5-10M forecast impact",
      "5+ products",
    ],
  },
  {
    slug: "100-shapes",
    title: "Building the practice",
    client: "100 Shapes",
    role: "Head of Product Design",
    years: "2021-2024",
    status: "live",
    outcomes: ["8 designers", "Skills matrices", "Weekly critique", "Pairing"],
  },
  {
    slug: "your-move",
    title: "Your Move",
    client: "Your Move",
    role: "Lead platform strategist",
    years: "2026",
    status: "in development",
    outcomes: ["AI prototype on day one", "In development"],
  },
];

export const TALLY: { label: string; value: string }[] = [
  { label: "Tasks a month, ITV", value: "25,000+" },
  { label: "Stores, Home Depot", value: "2,000+" },
  { label: "Sites, Junior Achievement", value: "99+" },
  { label: "Processes streamlined, ITV", value: "24" },
  { label: "Saved per login, Home Depot", value: "7m 25s" },
];

/*
 * The full list for 3B: every entry in the archive registry, case studies
 * first in the order above, then the rest in archive order. Rows only link
 * where the archive already has somewhere to send them. What a row runs on
 * hover is, in order of preference: its recorded outcomes, the work the
 * archive documents, or its disciplines. Nothing is written here that the
 * archive or the dossier does not already say.
 */

export type Preview = { src: string; w: number; h: number; sample?: boolean };

/*
 * What a row can show when it is pointed at: the case studies' own images,
 * as registered in src/content/work/index.ts. Everything else falls back to
 * one placeholder, which is marked "sample" wherever it shows until real
 * imagery replaces it.
 */
const SAMPLE: Preview = { src: "/lab/sample-devices.webp", w: 1400, h: 933, sample: true };

const PREVIEWS: Record<string, Preview[]> = {
  "ja-finance-park": [
    { src: "/work/ja-finance-park/storefront-in-room.webp", w: 1520, h: 863 },
    { src: "/work/ja-finance-park/tablets-array.webp", w: 1520, h: 792 },
    { src: "/work/ja-finance-park/budget-complete.webp", w: 1520, h: 882 },
  ],
  "itv-studios-portal": [
    { src: "/work/itv/welcome-onboarding.webp", w: 2048, h: 1176 },
    { src: "/work/itv/asset-gallery.webp", w: 940, h: 588 },
    { src: "/work/itv/episode-clip-timecode.webp", w: 940, h: 588 },
  ],
  "100-shapes": [
    { src: "/work/100-shapes/skill-definitions.webp", w: 1920, h: 1241 },
    { src: "/work/100-shapes/responsibility-matrix.webp", w: 1920, h: 1080 },
    { src: "/work/100-shapes/skills-matrix-full.webp", w: 1920, h: 1647 },
  ],
  "home-depot": [
    { src: "/work/home-depot/sign-on-landing.avif", w: 1008, h: 801 },
    { src: "/work/home-depot/paint-dashboard.avif", w: 1214, h: 1313 },
    { src: "/work/home-depot/truck-rental.avif", w: 1285, h: 973 },
  ],
};

export type ListRow = {
  id: string;
  title: string;
  meta: string[];
  src: string[];
  href?: string;
  external?: boolean;
  run: string[];
  previews: Preview[];
};

const LIBRARY_RUN: Record<string, string[]> = {
  taxslayer: [
    "50+ redundant pages removed",
    "4 financial education schemes added",
    "65+ discovery and framing cadences",
  ],
  itv: ["Marketing surfaces for ITV Studios", "Production asset tracking"],
  "lego-ted-play": ["A play symposium", "play@TED"],
};

export const LIST: ListRow[] = [
  ...INDEX.map((r) => ({
    id: r.slug,
    title: r.title,
    meta: [r.client, r.role],
    src: [r.years, r.status],
    href: `/work/${r.slug}/`,
    run: r.outcomes,
    previews: PREVIEWS[r.slug] ?? [SAMPLE],
  })),
  ...ARCHIVE.filter((a) => !INDEX.some((r) => r.slug === a.id)).map((a) => ({
    id: a.id,
    title: a.client,
    meta: [a.disciplines.join(", ")],
    src: [a.href ? "write-up" : "archive"],
    href: a.href,
    external: a.external,
    run: LIBRARY_RUN[a.id] ?? a.disciplines,
    previews: PREVIEWS[a.id] ?? [SAMPLE],
  })),
];
