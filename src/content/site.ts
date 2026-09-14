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

  tagline: "Platform strategy and product design leader",
  email: "alexpurdieux@gmail.com",
  phone: "704.409.7838",
  linkedin: "https://www.linkedin.com/in/alexpurdieux/",
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

    /* Implemented from Figma: Portfolio Moodboard, 113:2772 ("contact
       concept"). The title is split because the two halves are set in two
       colors, which is the whole gesture and cannot be done with one string —
       the same two-voice treatment the home page statement uses. */
    titleLead: "Let’s",
    titleTail: "Chat",

    /* Alex's own line from the frame. The joke is the point: it is the only
       place on the site where he sounds like a person rather than a practice,
       and a contact page is exactly where that belongs. */
    phoneNote:
      "Feel free to text or call me with any questions, except those about car maintenance… very limited understanding there.",

    /* Three labeled channels, in the frame's order. The label is interface
       text; the value is editorial, set in the accent. */
    labels: {
      phone: "PHONE",
      email: "EMAIL",
      linkedin: "LINKEDIN",
    },

    portrait: {
      src: "/contact/portrait.jpg",
      alt: "Alex as a toddler, grinning at the camera in a white sweater, another child just in frame at the edge.",
      /* Figma 113:2996. The frame types it without the apostrophe in
         "wouldn't"; set here with one, because every other contraction on the
         site has one and the odd one out reads as a typo rather than as a
         voice. */
      caption: "I mean who wouldn’t want to chat with this guy?",
    },
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
  /* Every nav link the site will eventually have, and whether its page is
     written. Nothing renders this directly — `SITE.nav` below is the filtered
     list, so a component that maps the nav cannot accidentally ship a link to
     an unwritten page. Three components render this nav and I had gated two.
     Flip `ready` as each page is finished. */
  navAll: [
    { label: "Approach", href: "/approach", ready: false },
    /* Points at /archive, not /work. The archive concept is the page that got
       built; /work is the older index and is not what this link means. */
    { label: "Archive", href: "/archive", ready: true },
    { label: "About", href: "/about", ready: false },
    { label: "Contact", href: "/contact", ready: true },
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

/*
 * What the nav actually renders: only links whose page exists. Derived rather
 * than filtered at each call site, because there are three call sites and the
 * one that is forgotten is the one that ships.
 */
export const NAV = SITE.navAll.filter((item) => item.ready);
