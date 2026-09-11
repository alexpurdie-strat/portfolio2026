# CLAUDE.md — Alex Purdie Portfolio

## What this is

A portfolio site for Alex Purdie, a product designer and strategist targeting staff / lead product design roles (first target: Staff Product Designer, The Coca-Cola Company, digital supply chain). The site must persuade a recruiter in 10 seconds, a design leader in 3 minutes, and a product/engineering panel in 15.

The site is also evidence. The role asks for proficiency with Claude Code and Claude Design and for clear examples of AI in the design workflow. How this site is built is part of the portfolio. It gets documented on the colophon page.

## Read before any work

- `docs/intake.md` — Alex's raw intake (source of truth for facts).
- `docs/intake-addendum.md` — extrapolations, positioning, structure, named ideas, draft copy. Items tagged [CONFIRM] or [NEEDS YOU] are unverified.
- `docs/framework-v2.md` — the portfolio analysis framework and benchmark library. Use it to judge quality.
- `docs/job-rec.md` — the target job posting.
- `docs/design/` — visual direction references (screenshots, tokens) once they exist.

## Non-negotiable content rules

1. **Never invent facts.** No made-up metrics, dates, client names, quotes or outcomes. If content is missing, insert a visible `TODO(alex): …` marker and list it in your summary.
2. **Targets are not results.** Launch goals (e.g. Your Move user targets) must be labeled as targets.
3. **Credit honestly.** Use "I" for Alex's own decisions and "we" for team work. Name the disciplines of collaborators (e.g. "final UI by Whiteboard's design team").
4. **US spelling throughout.** London appears as a credential, not as a location.
5. **Anonymize** the security technology client (never name OSL).
6. **Placeholder text never ships.** No lorem ipsum, template headings or dummy links, ever.

## Voice

- Calm, concrete, confident. Short sentences. Plain words.
- Show conviction through decisions, not adjectives. Banned phrases: "paradigm shifter", "passionate about", "mindless drone", "leveraging synergies", "user-centric" as filler.
- Two registers:
  - **Warm and personal** on the About/timeline and Principles pages.
  - **Clear and editorial** in case studies.
- Every case study caption states a decision or a reason, not just a label.

## Information architecture

Two-speed: billboard up front, archive one click down.

- `/` — hero (belief-led positioning), current role, plain-text client list, 4 featured case study cards, link to library, principles teaser, contact.
- `/work/[slug]` — featured case studies.
- `/library` — index table: number, project, client, year, category, status icon (open / locked / external). One-line entries; some link to short pages.
- `/principles` — named ideas, each linking to the case study or essay that proves it.
- `/writing/[slug]` — essays (two at launch).
- `/about` — timeline-style About: career spine plus life, with anti-positioning.
- `/colophon` — how the site was built (Claude Design → Claude Code, what AI did, what Alex did, what failed).
- `/system` — design tokens and components (unlinked or footer-linked).

## Case study skeleton (every featured case study)

1. **Framing strip:** challenge (as a question) · product in one sentence · client, years, team, **my role**.
2. **Hero:** product in context (devices in real settings where possible).
3. **Why it mattered:** business problem and stakes.
4. **The hard part:** the real constraint.
5. **Key decisions:** the most consequential call, the rejected alternative, and something loved and killed.
6. **Where research changed the plan.**
7. **What went wrong,** and what Alex would do differently. Required, not optional.
8. **AI in the loop:** short margin notes on where AI helped, where it didn't, and what was checked. This is the site's signature.
9. **Outcome:** scale, shipping status, renewal, quotes. Metrics only with a stated source.
10. **Credits** and next project.

## Design principles

- **Novelty budget:** spend originality on two things only — named ideas, and the AI-in-the-loop notes. Keep navigation, reading and contact completely familiar.
- **Breathing room:** generous whitespace. The previous site felt crowded; err sparse.
- **Restrained editorial with warmth:** about 60/40. Serif display with an italic accent plus a clean sans (confirm with `docs/design`).
- **Color:** calm neutral base, one warm accent. Nothing that reads as Coca-Cola red.
- **Motion:** purposeful only — respect `prefers-reduced-motion`, and no scroll-jacking.
- **Accessibility:** WCAG 2.2 AA minimum. Semantic HTML, visible focus states, alt text that describes the design decision shown, captions on video, and 4.5:1 text contrast.

## Tech

- **Astro** with content collections. Case studies and essays live in Markdown/MDX in `src/content/`, so copy edits never require touching components.
- **Case study frontmatter schema (enforced):** `title`, `subtitle`, `client`, `years`, `role`, `team`, `platform`, `status` (live / pilot / in development / concept), `featured`, `order`, `locked`, `hero`, `outcomes[]`, `credits[]`.
- **Styling:** CSS custom properties in `src/styles/tokens.css`. No utility-class soup in content components.
- **Performance:** minimal client JS. Images through Astro's image pipeline; video as muted looping MP4/WebM with a poster frame.
- **Hosting:** static. Password protection must be host-level (e.g. Netlify, Vercel or Cloudflare Access), never client-side JavaScript. Default the index and most case studies to public; lock only genuinely sensitive pages.
- **Metadata:** every page has a title, description and Open Graph image. Canonical URLs must use the real custom domain.

## Workflow rules

- **Plan before code.** For any non-trivial task, propose the approach and the file list first and wait for approval.
- **One feature per session.** Commit after each working step, with a clear commit message.
- **Visual QA with Playwright.** After UI changes, capture desktop (1440px) and mobile (390px) screenshots to `qa/screenshots/` and review them before saying a task is done.
- **Run `npm run check` before finishing any task.** The hygiene script it runs must fail the build on:
  - "lorem", "TODO" in production pages (a `--draft` flag allows TODOs locally)
  - images without alt text
  - broken internal links
  - missing meta descriptions
  - UK spellings from a small wordlist
- **Log AI decisions for the colophon.** When AI tooling produces something Alex later changes substantially, note it in `docs/colophon-log.md`. This becomes the colophon's raw material.

## Definition of done (v1)

- 4 featured case studies with no TODOs left in them.
- The library with at least 12 entries.
- Principles, About, two essays, and the colophon.
- Lighthouse 95+ on performance and accessibility.
- A hygiene check that passes.
- Custom domain live.
- One-page PDF of the JA case study exported for advocates.
