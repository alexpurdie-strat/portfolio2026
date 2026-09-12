/*
 * Every word on the site that is not inside a case study.
 *
 * Pulled out of the components deliberately: the visual design is being
 * replaced, and copy that lives inside a component is copy that a redesign can
 * lose. Nothing in here should ever be edited to suit a layout — if a line does
 * not fit, the layout is wrong.
 *
 * Sources are noted per block so a future edit knows whose words these are.
 */

export const SITE = {
  name: "Alex Purdie",
  role: "Product designer and strategist",

  tagline: "Product strategy and Product Design leader",
  email: "alexpurdieux@gmail.com",
  currently: "CURRENTLY @ Whiteboard",
  status: "OPEN FOR WORK",

  /* The headline from the Figma frames, split so the first half can be set in
     bold italic and the second in roman — the two-voice treatment is the whole
     gesture and it cannot be done with one string.

     It comes from intake §1: "I believe people should be empowered to live
     their most unrestrained embodied lives." A third belief line alongside the
     two below; none are lost. */
  statementLead: "Empowering embodied lives",
  statementTail: "on and off screen",

  /* Alex's own belief line, intake §1. He also offered "The canvas is not the
     physical medium, the canvas is people's hearts and minds" and marked it as
     the better one — kept below as the alternate, undecided. */
  belief:
    "Giving people what they want and giving them what they need aren’t the same thing. I design for the difference.",
  beliefAlternate:
    "The canvas is not the physical medium. The canvas is people’s hearts and minds.",

  bio: "Alex Purdie is a product designer and strategist who leads teams building platforms where digital systems meet real people doing real work. Formerly Head of Product Design at 100 Shapes in London.",

  /* Anti-positioning — the Christine Røde move. Alex's words from intake §1,
     cut to about half their original length. */
  notFor: [
    "If you want wireframes every Tuesday without the thinking behind them, I’m not your designer. If you want research as a masthead rather than something that steers, I’m not either.",
    "If you want someone to help decide what to build, and then hold the bar while it ships — that’s the work I’m for.",
  ],

  /* Plain text, never a logo wall. Every benchmark in the framework states
     credentials flatly. */
  clients: [
    "The Home Depot",
    "ITV",
    "BBC",
    "NHS",
    "M&S",
    "TED",
    "LEGO",
    "Junior Achievement",
    "AdventHealth",
    "Chick-fil-A",
  ],

  contact: {
    heading: "Contact",
    line: "If you want someone to help decide what to build, and then hold the bar while it ships,",
    linkText: "let’s talk",
  },

  footer: {
    line: "Alex Purdie — product designer and strategist.",
    links: [
      { label: "Get in touch", href: "/contact" },
      { label: "How this site was built", href: "/colophon" },
    ],
  },

  /* Labels from the Figma frames. "Archive" points at /work for now — the
     brief's IA calls it Work and the design calls it Archive, and that naming
     is logged in docs/open-questions.md rather than guessed at here. */
  /* `ready` gates what the nav renders. The routes exist and build; the pages
     behind them are not written yet, and a nav that promises four pages and
     delivers four drafts is worse than a nav with nothing in it. Flip these
     back to true one at a time as each page is finished. */
  nav: [
    { label: "Approach", href: "/approach", ready: false },
    { label: "Archive", href: "/work", ready: false },
    { label: "About", href: "/about", ready: false },
    { label: "Contact", href: "/contact", ready: false },
  ],

  meta: {
    title: "Alex Purdie — Product designer and strategist",
    description:
      "Leads teams building platforms where digital systems meet real people doing real work. Junior Achievement, ITV, The Home Depot, NHS.",
  },

  sections: {
    clients: "Selected clients",
    work: "Selected work",
    notFor: "Who I’m not for",
  },
} as const;
