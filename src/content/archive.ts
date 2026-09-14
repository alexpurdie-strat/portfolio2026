/*
 * The archive registry.
 *
 * Implemented from Figma: Portfolio Moodboard, 111:3227 ("Archive concept").
 * The frame is a wall of twenty client marks with one description beside it,
 * and the description is whichever mark you are pointing at.
 *
 * Two rules hold this file together.
 *
 * One: a mark is not an entry. Three of the twenty marks — the LEGO brick, the
 * LEGO Foundation lockup and play@TED — are one piece of work wearing three
 * logos, so they share a single entry and light up together. TED stands alone
 * because TED Audacious is its own engagement. That is why `marks` is a list.
 *
 * Two: the same content rule as everywhere else on this site. Nothing here is
 * invented. `brief` says what the client is, which is public knowledge about
 * the organization. `work` says what Alex did, which is only ever sourced from
 * docs/work-context.md, docs/project-inventory.md or src/content/work.ts — and
 * where those say nothing, `work` is omitted and the gap carries a marker
 * rather than a sentence somebody made up. `npm run check` counts them.
 */

export type ArchiveEntry = {
  id: string;
  /*
   * Which logos in the wall belong to this entry, by the filename stem shared
   * by public/logos/<KEY>.svg and public/logos/colored/<KEY>.svg. More than one
   * where a single engagement carries several marks; hovering any of them
   * colors all of them.
   */
  marks: string[];
  /* The orange line. Who the work was for, not what the project was called. */
  client: string;
  /* Three at most — the frame sets them on one line and a fourth wraps. */
  disciplines: string[];
  /* Who the client is. Bold, directly under the name. */
  brief: string;
  /* What Alex did. Omitted where nothing is documented — see the note above. */
  work?: string;
  /*
   * Learn More points here. The five written case studies point at their own
   * pages; TaxSlayer points off-site at the old portfolio, which is still the
   * only place that work is written up. Everything else has no href, because a
   * CTA leading nowhere is worse than no CTA at all.
   */
  href?: string;
  /*
   * Set when `href` leaves this site. It changes the arrow, opens a new tab and
   * says so to a screen reader — a link that silently navigates away from a
   * portfolio is a link that loses the reader.
   */
  external?: boolean;
};

/*
 * Reading order of the wall, four across and five down, exactly as the frame
 * lays it out. Kept separate from the entries because the grid order is a
 * composition — recognizable marks first, no two versions of one brand
 * adjacent — and the entries are content. Changing one should not disturb the
 * other.
 */
export const MARK_ORDER = [
  "THD", "JA", "YM", "100S",
  "ITVS", "BBC", "I360", "ITV",
  "MS", "NHS", "CFA", "TED",
  "LEGO", "patTED", "SS", "OSL",
  "MB", "LEGO1", "EDSN", "TS",
] as const;

/* Alt text for the marks, since the logo itself carries no accessible name. */
export const MARK_NAMES: Record<string, string> = {
  "100S": "100 Shapes",
  BBC: "BBC",
  CFA: "Chick-fil-A",
  EDSN: "Edisen",
  I360: "Impact 360 Institute",
  ITV: "ITV",
  ITVS: "ITV Studios",
  JA: "Junior Achievement",
  LEGO: "LEGO",
  LEGO1: "LEGO Foundation",
  MB: "Ministry Brands",
  MS: "M&S",
  NHS: "NHS",
  OSL: "OSL",
  SS: "Self Space",
  TED: "TED",
  THD: "The Home Depot",
  TS: "TaxSlayer",
  YM: "Your Move",
  patTED: "play@TED",
};

export const ARCHIVE: ArchiveEntry[] = [
  /* ── The five written case studies ─────────────────────────────────────── */
  {
    id: "home-depot",
    marks: ["THD"],
    client: "The Home Depot",
    disciplines: ["Enterprise", "Service design", "Research"],
    brief:
      "A home improvement retailer running more than 2,000 US stores, each staffed by around 150 associates.",
    work:
      "Truck rental, single sign-on and the reporting a paint manager acts on — three streams, across three teams, with authority over none of them. The sign-on work took 7 minutes 25 seconds out of every login, against a forecast business impact of $5–10M.",
    href: "/work/home-depot/",
  },
  {
    id: "ja-finance-park",
    marks: ["JA"],
    client: "Junior Achievement",
    disciplines: ["Strategy", "Product", "Service design"],
    brief:
      "A nonprofit that teaches financial literacy inside Finance Park and BizTown — simulated towns students spend a day working in.",
    work:
      "Restarted a stalled 120-page platform rebuild and shipped it to 99+ sites in 10 months: the tablet a student holds while they are standing in the simulation, deciding whether they can afford the apartment.",
    href: "/work/ja-finance-park/",
  },
  {
    id: "your-move",
    marks: ["YM"],
    client: "Your Move",
    disciplines: ["Strategy", "Prototyping", "Research"],
    brief:
      "A mobile web coaching platform for people doing their own personal development work.",
    work:
      "A working prototype on day one, built with AI in the loop, and the reframe that collapsed six audience segments into one person the team could argue about. Also the clearest lesson in the archive about which parts of discovery that speed cannot skip.",
    href: "/work/your-move/",
  },
  {
    id: "100-shapes",
    marks: ["100S"],
    client: "100 Shapes",
    disciplines: ["Leadership", "Practice", "Hiring"],
    brief:
      "A product design practice in London. Boutique Agency of the Year, 2023.",
    work:
      "Eight designers led, four hired, a 20-person contractor pool, and bench time held under 5%. Skills matrices, growth rubrics, weekly critique and pairing — the structure that let a fully booked team get better on purpose rather than by accident.",
    href: "/work/100-shapes/",
  },
  {
    id: "itv-studios-portal",
    marks: ["ITVS"],
    client: "ITV Studios",
    disciplines: ["Systems", "Design systems", "Governance"],
    brief:
      "The production arm of ITV, delivering shows through global production partners who had each been working to their own standards.",
    work:
      "Studios Portal — one origin for production tasks, from planning through post-transmission. 25,000+ tasks completed monthly, 24 interdepartmental processes streamlined, £400k of opportunity hours saved, and the design system and governance built to hold it. Broadcast Tech Awards finalist, 2022.",
    href: "/work/itv-studios-portal/",
  },

  /* ── The library ───────────────────────────────────────────────────────── */
  {
    id: "taxslayer",
    marks: ["TS"],
    client: "TaxSlayer",
    disciplines: ["Research", "Product", "Information architecture"],
    brief:
      "A self-service tax filing platform, and the financial products around it.",
    work:
      "Native mobile login, onboarding guidance and the COVID relief payment portals, plus 50+ redundant pages removed and four new financial education and assistance schemes added across 65+ discovery and framing cadences. The job inside the client team was mostly arguing against inherited dark patterns.",
    /* The old Framer portfolio, which is still the only written-up version of
       this one. Off-site until it is rewritten here. */
    href: "https://alexold.framer.website/works/project-taxslayer",
    external: true,
  },
  {
    id: "itv",
    marks: ["ITV"],
    client: "ITV",
    disciplines: ["Product", "Enterprise", "Marketing"],
    brief: "Britain's largest commercial broadcaster.",
    work:
      "Marketing surfaces for ITV Studios, and an enterprise system for tracking production assets — separate engagements from the portal work.",
  },
  {
    id: "lego-ted-play",
    /*
     * One engagement, three marks. The symposium was the LEGO Foundation and
     * TED together, and play@TED is what came out of it — so the brick, the
     * Foundation lockup and the play@TED mark all point at this entry and all
     * color together. TED on its own is a different client relationship and
     * sits below.
     */
    marks: ["LEGO", "LEGO1", "patTED"],
    client: "The LEGO Foundation × TED",
    disciplines: ["Facilitation", "Strategy", "Service design"],
    brief:
      "The LEGO Foundation and TED, making the case that play is how people learn.",
    work:
      "A play symposium run jointly by the two organizations, and play@TED — the program that came out of it.",
  },
  {
    id: "ted-audacious",
    marks: ["TED"],
    client: "TED",
    disciplines: ["Product", "Visual design"],
    brief:
      "TED's philanthropic initiative, funding ideas big enough to need nine figures behind them.",
  },
  {
    id: "ministry-brands",
    marks: ["MB"],
    client: "Ministry Brands",
    disciplines: ["Product", "Enterprise"],
    brief: "Software for churches and faith-based nonprofits.",
  },
  {
    id: "bbc",
    marks: ["BBC"],
    client: "BBC News Labs",
    disciplines: ["Research", "Prototyping"],
    brief:
      "The BBC's experimental technology team, prototyping tools for the newsroom.",
  },
  {
    id: "nhs",
    marks: ["NHS"],
    client: "NHS",
    disciplines: ["Product", "Content"],
    brief: "The United Kingdom's public health service.",
  },
  {
    id: "marks-and-spencer",
    marks: ["MS"],
    client: "M&S",
    disciplines: ["Product", "Retail"],
    brief: "A British retailer of food and clothing, trading since 1884.",
  },
  {
    id: "chick-fil-a",
    marks: ["CFA"],
    client: "Chick-fil-A",
    disciplines: ["Marketing", "Visual design"],
    brief: "A quick-service restaurant chain, headquartered in Atlanta.",
  },
  {
    id: "impact-360",
    marks: ["I360"],
    client: "Impact 360 Institute",
    disciplines: ["Product", "Visual design"],
    brief: "A gap-year and leadership program for young adults, in Georgia.",
  },
  {
    id: "selfspace",
    marks: ["SS"],
    client: "Self Space",
    disciplines: ["Product", "Brand"],
    brief: "A therapy practice.",
  },
  {
    id: "edisen",
    marks: ["EDSN"],
    client: "Edisen",
    disciplines: ["Product", "Enterprise"],
    brief: "A creative production company working in advertising.",
  },
  {
    /*
     * Named. docs/project-inventory.md used to carry a standing instruction to
     * anonymize this one, which was withdrawn on 2026-09-13 — the mark is in
     * the wall, and a logo above the words "a security technology provider"
     * anonymizes nobody.
     */
    id: "osl",
    marks: ["OSL"],
    client: "OSL",
    disciplines: ["Product", "Enterprise"],
    brief: "A security technology provider.",
  },
];

/* Mark → entry, so a hover on any logo resolves in one lookup. */
export const ENTRY_BY_MARK: Record<string, ArchiveEntry> = Object.fromEntries(
  ARCHIVE.flatMap((entry) => entry.marks.map((mark) => [mark, entry])),
);
