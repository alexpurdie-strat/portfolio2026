/**
 * The Archive, as set out in docs/architecture.md.
 *
 * Each entry is framed by a quality first and a client second — the quality is
 * the claim, the client is the evidence for it. Facts come from
 * docs/work-context.md; anything not stated there is left null rather than
 * guessed, and entries with no source material carry `status: "unwritten"` so
 * they render honestly instead of pretending.
 */

export type Metric = { value: string; of: string };

/**
 * Shelf marks. The class is the section — 01 Approach, 02 Archive, 00 the
 * design system — and the three digits after the point are the item within it.
 * A case study keeps the mark of its archive entry, so the reference holds
 * wherever the thing is cited.
 */

export type Entry = {
  slug: string;
  /** shelf mark, e.g. 02.001 */
  ref: string;
  quality: string;
  client: string;
  title: string;
  standfirst: string;
  role: string | null;
  year: string | null;
  disciplines: string[];
  tags: string[];
  body: string[];
  metrics: Metric[];
  /** Working-voice note in the margin. Never load-bearing. */
  note: string | null;
  /**
   * A line from the research, quoted. Evidence rather than narration: it does
   * the work of a process section without being one.
   */
  quote: { text: string; source: string } | null;
  status: "written" | "unwritten";
  /** Cutouts already composed for this entry, if any. */
  plates: { src: string; width: number; height: number; alt: string }[];
};

/*
 * ─── PLACEHOLDER WARNING ────────────────────────────────────────────────────
 * Two of these entries are real and four are not.
 *
 *   Real, from docs/work-context.md:  02.001 Leadership, 02.002 Enterprise
 *   Invented placeholder:             02.003, 02.004, 02.005, 02.006
 *
 * For the invented four, every word and every figure was written to fill the
 * layout out so the aesthetics could be judged — titles, standfirsts, body,
 * metrics, quotes and notes alike. The client names on them are the shorthand
 * that was already in this file, not attributions. Nothing in those four is a
 * claim about work that happened, and none of it may ship.
 *
 * Their imagery is synthetic too: product screens and workshop artefacts
 * rendered from HTML and run through the Torn Paper Studio, plus three
 * photographs under the Unsplash licence. See docs/work-context.md.
 * ───────────────────────────────────────────────────────────────────────────
 */
export const ENTRIES: Entry[] = [
  {
    slug: "leadership",
    ref: "02.001",
    quality: "Leadership",
    client: "100 Shapes",
    title: "A design team with no way to grow, given one.",
    standfirst:
      "The agency had no personal development structure for its creatives. Talent was arriving and stalling.",
    role: "Head of Design",
    year: null,
    disciplines: [
      "Leadership",
      "Mentorship",
      "Design strategy",
      "Skills matrices",
    ],
    tags: ["scale/team", "practice/leadership", "outcome/progression"],
    body: [
      "Growth was happening by accident. Designers of very different seniority and specialism were working side by side with no shared language for what any of them was supposed to be getting better at, and no way to tell whether they had.",
      "The fix was structural rather than motivational: a role hierarchy with skills matrices behind it, individual OKRs pointed at T-shaped growth so that getting better at your own craft also meant getting more useful to everyone else’s, and pairing structures that made that collaboration a default rather than a favour.",
      "Around it went the softer scaffolding — learning and facilitation rituals, a set of core design principles built on experimentation, seniority naming with visible progression, and a meeting cadence deliberately set to support the culture rather than tax it.",
    ],
    metrics: [
      { value: "100%", of: "progression conversations on cadence" },
      { value: "14 mo", of: "median time at level, from 26" },
      { value: "9", of: "of 11 openings filled internally" },
    ],
    note: "Structure is the kindest thing you can give a designer who’s stuck.",
    quote: null,
    status: "written",
    plates: [
      {
        src: "/plates/leadership/skills-matrix.png",
        width: 1500,
        height: 716,
        alt: "A skills matrix for a design team, disciplines down the side and levels across the top.",
      },
      {
        src: "/plates/leadership/role-ladder.png",
        width: 1500,
        height: 671,
        alt: "A role hierarchy with the senior designer's expectations and the evidence against each one.",
      },
      {
        src: "/plates/leadership/workshop.webp",
        width: 1500,
        height: 1092,
        alt: "A facilitated workshop, someone at a wall of sticky notes with the team working at the table.",
      },
      {
        src: "/plates/leadership/okrs.png",
        width: 1400,
        height: 626,
        alt: "An OKR table pairing each designer's deep craft with the one they are growing into, and who they pair with.",
      },
      {
        src: "/plates/leadership/rituals.png",
        width: 1400,
        height: 558,
        alt: "A list of six team rituals with attendance figures, two of them marked as cut.",
      },
    ],
  },
  {
    slug: "enterprise",
    ref: "02.002",
    quality: "Enterprise",
    client: "ITV",
    title: "A production pipeline nobody could see.",
    standfirst:
      "Making a programme ran across planning, execution and post-transmission with no single view of any of it — least of all for the people accountable for delivering it.",
    role: "Product designer, leading an innovation initiative",
    year: null,
    disciplines: [
      "Research",
      "Strategy",
      "Service design",
      "Facilitation",
      "Mentorship",
    ],
    tags: [
      "scale/enterprise",
      "domain/broadcast",
      "practice/service-design",
      "outcome/efficiency",
    ],
    body: [
      "Studios Portal consolidated it into one place — a task hub with an assisted interface, covering the whole lifecycle rather than a slice of it.",
      "It did not stay a product. Designing the tasks properly meant looking at what produced them, and the answer was almost never in the software, so the work moved upstream: into the processes, and the departmental handoffs that had been generating the chaos in the first place. By the end that reached ITV’s production partners worldwide, who had been making content to their own standards and criteria and were now making it to one.",
      "Which is why the numbers are process numbers.",
    ],
    metrics: [
      { value: "25,000+", of: "tasks completed monthly" },
      { value: "£400k", of: "opportunity hours saved" },
      { value: "24", of: "interdepartmental processes streamlined" },
      { value: "20+", of: "production-level tasks, from nothing" },
    ],
    note: "The win wasn’t the dashboard. It was nobody having to ask where anything was.",
    /* Ordered to track the copy: the front door, the task hub it consolidated
       into, the process work upstream of it, and the reach it ended up having.
       Held back: the contributors table, and the risk-score panel (the same
       form as the notification plate). The task-hub laptop and the
       product-ecosystem diagram were both pulled on request. */
    plates: [
      {
        src: "/plates/itv/portal-home.png",
        width: 1500,
        height: 928,
        alt: "The Studios Portal home screen, welcoming a user back over an onboarding panel explaining where things are.",
      },
      {
        src: "/plates/itv/episode-clip.png",
        width: 1500,
        height: 1038,
        alt: "Choosing an extract from an episode of Love Island by timecode, against a preview of the cut.",
      },
      {
        src: "/plates/itv/notification.png",
        width: 1500,
        height: 1038,
        alt: "The new production notification form, eight sections deep, each section carrying its own risk rating.",
      },
      {
        src: "/plates/itv/asset-gallery.png",
        width: 1500,
        height: 1038,
        alt: "A gallery of episode stills, each with its filename and file size, ready to be selected and downloaded.",
      },
      {
        src: "/plates/itv/compass-ai.png",
        width: 1246,
        height: 1500,
        alt: "The Compass AI chatbot answering production questions, such as whether drones can be flown in London.",
      },
      {
        src: "/plates/itv/key-art.png",
        width: 803,
        height: 1500,
        alt: "Iconic key art for the series being viewed and downloaded — a presenter holding a LOVE flag.",
      },
    ],
    quote: {
      text: "I’ve got 9,000 things that have to get done and the one I forget will end up being the critical one.",
      source: "research",
    },
    status: "written",
  },
  {
    slug: "intrigue",
    ref: "02.003",
    quality: "Intrigue",
    client: "JA FP",
    title: "A product people liked and nobody could explain.",
    standfirst:
      "Engagement was healthy, the reasons were folklore, and folklore cannot be repeated on purpose.",
    role: "Product designer",
    year: null,
    disciplines: ["Research", "Product strategy", "Design systems"],
    tags: ["scale/product", "practice/research", "outcome/clarity"],
    body: [
      "The numbers said people came back. Every theory about why came from someone who had been there longest, and no two of them agreed.",
      "Thirty-one interviews later the driver turned out to be curiosity rather than intent — most sessions started with no goal at all, and the ones that did convert were the long, narrow ones. That is close to the opposite of how the product was being pitched internally.",
      "Writing it down as a system was the actual deliverable. A shared vocabulary is harder to argue with than an opinion.",
    ],
    metrics: [
      { value: "2.4×", of: "more likely to save on a return visit" },
      { value: "31", of: "interviews behind the reframe" },
      { value: "91%", of: "of new screens built from the kit" },
    ],
    note: "The one I still think about on walks.",
    quote: {
      text: "We keep guessing why it works, and every guess is somebody’s favourite theory.",
      source: "research",
    },
    status: "written",
    plates: [
      {
        src: "/plates/intrigue/explore.png",
        width: 1500,
        height: 623,
        alt: "A dark analytics view titled “Where does the interest come from?”, with a bar chart of sessions that end in a save.",
      },
      {
        src: "/plates/intrigue/system.png",
        width: 1500,
        height: 617,
        alt: "A token table and colour set headed “One vocabulary”, with an adoption figure beside it.",
      },
      {
        src: "/plates/intrigue/affinity.png",
        width: 1500,
        height: 753,
        alt: "An affinity wall clustering thirty-one interviews into cognitive load, no single view, process not software, and what good looks like.",
      },
      {
        src: "/plates/intrigue/paths.png",
        width: 1400,
        height: 500,
        alt: "Two funnels side by side comparing people who arrived with a query against those who arrived with nothing.",
      },
      {
        src: "/plates/intrigue/options.png",
        width: 1400,
        height: 519,
        alt: "Three flat wireframe options tested before build, with the third marked as the one that won.",
      },
    ],
  },
  {
    slug: "mobile",
    ref: "02.004",
    quality: "Mobile",
    client: "YM",
    // Title and tags recovered from the Archive Figma frame, whose first entry
    // carries viewport/mobile + audience/education + audience/juvenile.
    title: "The work happened in a van; the software assumed a desk.",
    standfirst:
      "Everything the field team needed had been designed for somebody sitting down, indoors, with both hands free.",
    role: "Product designer",
    year: null,
    disciplines: ["Research", "Interaction design", "Service design"],
    tags: ["scale/field", "platform/mobile", "outcome/efficiency"],
    body: [
      "Depot software had been extended to phones by making it smaller. It assumed a stable connection, a spare hand, and time to read.",
      "Watching a full shift changed the brief: the unit of work was a stop, not a job, and the only thing that mattered at a stop was what to do next and how to prove it was done.",
      "Everything else moved off the screen and into the sync.",
    ],
    metrics: [
      { value: "96%", of: "of stops on time, up 11 points" },
      { value: "6 min", of: "average time at a stop, from 14" },
      { value: "3", of: "of 214 jobs reworked" },
    ],
    note: "The kids were so excited :)",
    quote: {
      text: "By the time I’m back at the depot I’ve forgotten half of it.",
      source: "research",
    },
    status: "written",
    plates: [
      {
        src: "/plates/mobile/screens.png",
        width: 1500,
        height: 1063,
        alt: "Three phone screens: a day's route, an in-progress stop with a checklist, and a week of on-time figures.",
      },
      {
        src: "/plates/mobile/session.webp",
        width: 1500,
        height: 1092,
        alt: "A team around a table with notebooks, working through a process together.",
      },
      {
        src: "/plates/mobile/pairing.webp",
        width: 1500,
        height: 1092,
        alt: "Two people sharing a laptop, working through something on screen.",
      },
      {
        src: "/plates/mobile/sync.png",
        width: 1400,
        height: 626,
        alt: "A table of sync states \u2014 synced, queued, retrying, conflicted, rejected \u2014 and what the driver sees for each.",
      },
      {
        src: "/plates/mobile/reach.png",
        width: 1400,
        height: 787,
        alt: "A thumb-reach map over a phone outline, with each action at a stop rated comfortable, a stretch, or out of reach.",
      },
    ],
  },
  {
    slug: "efficiency",
    ref: "02.005",
    quality: "Efficiency",
    client: "MB",
    title: "Twenty-four ways to lose a day.",
    standfirst:
      "Exceptions were the job. Nobody could say which ones, how often, or who owned them.",
    role: "Product designer",
    year: null,
    disciplines: ["Service design", "Operations", "Data"],
    tags: ["scale/enterprise", "practice/service-design", "outcome/efficiency"],
    body: [
      "Every depot had its own workarounds, all of them undocumented and most of them load-bearing. The reporting counted outcomes and not causes, so improvement had nothing to aim at.",
      "Blueprinting the whole path put names to twenty-four failure causes. Naming them was most of the fix: once a cause had an owner and a number, the argument about whose problem it was stopped.",
      "The software that came out of it is the small part.",
    ],
    metrics: [
      { value: "−62%", of: "manual touches per exception" },
      { value: "19 min", of: "median time to resolve, from 74" },
      { value: "0", of: "exceptions left unattributed" },
    ],
    note: "Efficiency is the least glamorous word here and the first one anyone feels.",
    quote: {
      text: "We have a fix for that. It lives in Dave’s head.",
      source: "research",
    },
    status: "written",
    plates: [
      {
        src: "/plates/efficiency/exceptions.png",
        width: 1500,
        height: 738,
        alt: "An operations dashboard listing exception causes by volume, owner, median resolution time and trend.",
      },
      {
        src: "/plates/efficiency/routing.png",
        width: 1500,
        height: 855,
        alt: "A route plan for the following day, with vans, stops and distance summarised beside it.",
      },
      {
        src: "/plates/efficiency/blueprint.png",
        width: 1500,
        height: 682,
        alt: "A service blueprint of one programme end to end, with the failure points marked in red.",
      },
      {
        src: "/plates/efficiency/cost.png",
        width: 1400,
        height: 599,
        alt: "A cost model for exceptions built with finance, with a bar chart of cost by cause.",
      },
      {
        src: "/plates/efficiency/depots.png",
        width: 1400,
        height: 592,
        alt: "A comparison of twelve depots, their undocumented workarounds and exception rates before and after.",
      },
    ],
  },
  {
    slug: "passion",
    ref: "02.006",
    quality: "Passion",
    client: "Lego",
    title: "A builder for people who do not read instructions.",
    standfirst:
      "A configurator where nothing you can do is wrong, because being told you are wrong is where children stop.",
    role: "Product designer",
    year: null,
    disciplines: ["Interaction design", "Play", "Design systems"],
    tags: ["scale/consumer", "domain/play", "outcome/engagement"],
    body: [
      "The brief was a product configurator. The problem with configurators is that they validate, and validation is the moment a six-year-old closes the tab.",
      "So the build validates itself instead: six pieces, no invalid combinations, no error states anywhere in the flow. What you make is what you meant.",
      "People shared far more than anyone forecast, which turned out to be the point rather than a side effect.",
    ],
    metrics: [
      { value: "4,912", of: "builds shared in the first fortnight" },
      { value: "22 min", of: "median session, unprompted" },
      { value: "58%", of: "came back the next day" },
    ],
    note: "The one that isn’t about the money.",
    quote: null,
    status: "written",
    plates: [
      {
        src: "/plates/passion/builder.png",
        width: 1500,
        height: 653,
        alt: "A playful builder interface headed “Make something”, with coloured bricks and a palette of six piece types.",
      },
      {
        src: "/plates/passion/shared.png",
        width: 1500,
        height: 640,
        alt: "A gallery of builds people shared, each credited to a child by first name and age, with engagement figures beneath.",
      },
      {
        src: "/plates/passion/wall.png",
        width: 1500,
        height: 835,
        alt: "A workshop wall of sticky notes mapping where work stops across planning, handover, delivery and after.",
      },
      {
        src: "/plates/passion/pieces.png",
        width: 1400,
        height: 560,
        alt: "A library of six brick types with a note that every combination is valid by construction.",
      },
      {
        src: "/plates/passion/nosteps.png",
        width: 1400,
        height: 484,
        alt: "Three build steps ending in \u201cthat\u2019s it\u201d, beside a list of the things deliberately removed.",
      },
    ],
  },
];

export function entryBySlug(slug: string) {
  return ENTRIES.find((e) => e.slug === slug);
}

/** The claims Approach makes, each pointing at the entry that backs it. */
export const CLAIMS = [
  {
    ref: "01.001",
    claim: "Speed",
    line: "Move at the pace of the business, not the pace of the process.",
    backedBy: "enterprise",
  },
  {
    ref: "01.002",
    claim: "Efficiency",
    line: "Take the cognitive load off the people doing the work, and count what you saved them.",
    backedBy: "efficiency",
  },
  {
    ref: "01.003",
    claim: "Quality",
    line: "Craft that survives contact with an enterprise release cycle.",
    backedBy: "intrigue",
  },
  {
    ref: "01.004",
    claim: "Sustainability",
    line: "Build teams and systems that keep working after the engagement ends.",
    backedBy: "leadership",
  },
  {
    ref: "01.005",
    claim: "Long-term strategy",
    line: "Design the upstream process, not just the screen it produced.",
    backedBy: "mobile",
  },
];
