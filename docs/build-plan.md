# Build Plan — Portfolio v1 with Claude Design + Claude Code

Each session below is one sitting of about 1–3 hours. The prompts are starting points, not scripts. Commit after every session.

---

## Today: apply before the posting closes

1. Update the resume: portfolio link and password at the top, titles and dates cleaned (see the addendum, Section 9), US spelling throughout.
2. Apply with whichever portfolio is stronger right now.
3. Message your advocate. Ask them to flag the application to the design leader, and tell them a refreshed portfolio and a JA one-pager are coming within days.

---

## Session 0 — Set up the repo (30 min)

```
mkdir portfolio && cd portfolio && git init
mkdir -p docs/design qa/screenshots
```

Put these files in `docs/`:
- `intake.md` (your filled intake)
- `intake-addendum.md`
- `framework-v2.md`
- `job-rec.md` (paste the full posting)

Put `CLAUDE.md` at the repo root.

Start Claude Code in the repo.

---

## Session 1 — Plan only, no code

> Read CLAUDE.md and everything in docs/. Don't write any code yet. Give me: (1) a site map with the purpose of each page, (2) the content collection schemas, (3) a list of every TODO(alex) item you can already see — every [CONFIRM] and [NEEDS YOU] in the addendum, grouped by page, and (4) any places where the addendum and the intake disagree.

Answer the TODO list in `docs/answers.md` as you go. This is the fastest way to finish the intake.

---

## Session 2 — Extract the old site into content

> Fetch these pages from my old portfolio. For each case study, create a draft Markdown file in src/content/work/ using the case study skeleton in CLAUDE.md. Keep my original facts, rewrite the copy in the voice rules, and put TODO(alex) wherever the skeleton needs something the old page doesn't have. Also list every image and video on each page with its URL, so we can download the assets.
> - https://alexold.framer.website/works/project-studiosportal
> - https://alexold.framer.website/works/project-100S
> - https://alexold.framer.website/works/project-taxslayer
> - https://alexold.framer.website/works/project-thehomedepot
> - https://alexold.framer.website/about
> - https://alexold.framer.website/blog

Then write the JA Finance Park and Your Move case studies from the intake the same way. JA is the priority; it becomes the forwardable piece.

---

## Session 3 — Visual direction in Claude Design

Do this outside Claude Code.

1. In Claude Design, explore 2–3 directions for:
   - the homepage hero
   - a case study framing strip
   - the library index row
2. Brief: restrained editorial with warmth, generous whitespace, serif display with an italic accent plus a clean sans, one warm accent, nothing like Coca-Cola red.
3. Pick one direction.
4. Save screenshots and chosen token values into `docs/design/`.
5. Note what AI proposed versus what you changed in `docs/colophon-log.md`.

Also paste your earlier concept into Claude Code and ask for a straight critique against the framework before deciding whether any of it carries forward:
- https://alexpurdie-strat.github.io/portfolio2026/
- https://alexpurdie-strat.github.io/portfolio2026/design-system/

---

## Session 4 — Design system and scaffold

> Scaffold an Astro project per CLAUDE.md. Build tokens.css from docs/design/, then a /system page showing the type scale, colors, spacing and these components: FramingStrip, Caption, MarginNote (for AI in the loop), CaseCard, LibraryRow, Quote, MediaFigure (image and looping video with a poster). Add the hygiene check script and npm run check. Screenshot /system at desktop and mobile widths and review it with me.

---

## Session 5 — The JA case study end to end

> Build the case study template and render the JA Finance Park content in it. Treat this as the quality bar for the whole site. Screenshot it, then critique it against the framework's maturity and signature layers. Fix the top three issues.

Add your real assets:
- the product in use on tablets in the simulation (the in-person QA photos)
- flows and emotional maps
- final UI, credited to the Whiteboard design team

---

## Session 6 — Homepage and library

> Build the homepage and /library from the content collections. Homepage order: hero, current role, client list in plain text, four featured cards, library link, principles teaser, contact. Library rows need status icons for open, locked and external. Screenshot and review.

---

## Session 7 — Remaining featured case studies

These are ITV, Your Move and 100 Shapes. Run one per session if needed. Keep the "what went wrong" and "AI in the loop" sections honest.

---

## Session 8 — Principles, About, essays, colophon

- **Principles:** each named idea gets two sentences and a link to its proof.
- **About:** timeline format, with the anti-positioning line.
- **Essay 1:** "Traditional UX, AI in UX, agentic UX". Include a small spec for an AI component inside a design system: states, confidence, sources, human override.
- **Essay 2:** "A tool, not a vessel".
- **Colophon:** built from `docs/colophon-log.md`. What Claude Design and Claude Code did, what you decided, what you threw away, how you checked quality.

Draft essays yourself first, or dictate them. Ask Claude to edit, never to originate. That's your own principle.

---

## Session 9 — QA and launch

> Run npm run check, Lighthouse and an axe accessibility scan on every page. Fix everything. Check every page at 390px. Generate Open Graph images. Then set up deployment to [host] with the custom domain, and host-level password protection only on these pages: [list].

Before launch:
- Export a one-page PDF of the JA case study for your advocate.
- Update the resume and LinkedIn so titles, dates and project names match the site exactly.

---

## Working habits

- **Plan mode first** for anything bigger than a copy fix.
- **Small commits,** so you can always roll back a bad direction.
- **Content lives in Markdown.** Most edits after launch should never touch a component.
- **Screenshots every session.** Neither you nor Claude should judge a layout from code alone.
- **Keep the colophon log going.** It's the evidence the posting asks for, written as you work.
