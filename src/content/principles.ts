/*
 * Named ideas.
 *
 * Novelty spend number one, and the Charlie Deets move: each idea links to the
 * case study or essay that proves it, so a principle is never left as an
 * assertion. An idea with no proof yet says so rather than borrowing credit
 * from the ones that have it.
 *
 * All ten are Alex's own vocabulary, taken from the intake verbatim where
 * possible — the naming is the point, so the words are his.
 */

export type Principle = {
  name: string;
  /** Two sentences. The idea, then what it is for. */
  body: string;
  /** The work that demonstrates it, or null while that work is unwritten. */
  proof: { label: string; href: string } | null;
};

const JA = { label: "JA Finance Park", href: "/work/ja-finance-park" };

export const PRINCIPLES: Principle[] = [
  {
    name: "A backlog, not a shopping list",
    body: "An RFP arrives as a list of features to build. Reframed as a prioritized backlog of grouped feature sets, it stops being a question of which ones and becomes a question of what the product actually needs first.",
    proof: JA,
  },
  {
    name: "Ask why, not what",
    body: "Asking stakeholders what they want on a screen gets you answers you then argue with. Asking why surfaces the need underneath it, and the argument does not need to happen.",
    proof: JA,
  },
  {
    name: "Empower the expertise in the room",
    body: "People support a change they can see their own hand in. That applies to clients, and it applies just as much to the team you have joined.",
    proof: JA,
  },
  {
    name: "The triple diamond",
    body: "An alignment diamond before discovery. Most of the value I add sits there — understanding what a client is actually trying to do, before anyone decides what to find out.",
    proof: null,
  },
  {
    name: "Archetypes over personas",
    body: "An archetype is the strategic container you put around the work to be done. One archetype focuses a product in a way six demographic segments never will.",
    proof: null,
  },
  {
    name: "MVP is the smallest thing that teaches the most",
    body: "Not the smallest thing you can ship. The smallest thing that uncovers the biggest learning, which is a different and more useful question.",
    proof: JA,
  },
  {
    name: "Biggest value, lowest effort",
    body: "The economic trade-off behind every prioritization call. It sometimes comes out sounding like why are we doing this, which is why it has to be delivered carefully.",
    proof: JA,
  },
  {
    name: "Rudder, not river",
    body: "You do not lead people by forcing them straight across a moving current. You steer slightly upstream and let them arrive where they were going anyway.",
    proof: null,
  },
  {
    name: "Collation, cultivation, creation",
    body: "How I run a workshop. Gather what is already known, grow the thinking on top of it, and only then make something.",
    proof: null,
  },
  {
    name: "AI is a tool, not a vessel",
    body: "AI can enhance delivery and it can never replace the thinking. It cannot replace a designer — only the perception of the value a designer offers.",
    proof: null,
  },
];
