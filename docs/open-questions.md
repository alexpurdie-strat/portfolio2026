# Open questions

What the site is waiting on. `npm run check` fails the production build while
any of it is outstanding; `npm run check:draft` passes so work can continue.

## Blocking — only Alex can answer

- [ ] **JA pilot data.** Session completion, site-staff or volunteer feedback,
      parent download requests, support issues versus the old platform. One
      number moves the case study from *shipped* to *shipped and worked*.
- [ ] **How you run a critique.** Three sentences. The job posting names
      "lead critique, feedback, and review processes" as a responsibility and
      there is currently nothing against it. → **Ask Alex for this.**
- [ ] **Accessibility specifics.** Alex: "present everywhere." The two places
      it can be shown concretely are the Eli Lilly grant requirements on JA and
      the ITV design system governance. Each needs one named standard and one
      thing it changed.
- [ ] **Which AI use was true on JA.** The intake names three: RFP into a
      dashboard and brief, tagging and collating interview footage, service
      blueprints made legible. The first two sound like this project.
- [ ] **Current role and availability** — one line for the home page.
- [ ] **ITV metrics** — confirm 25,000+ / £400k / 24 / 20+ and their sources.
      They came off the old site and an unverified metric is the framework's
      first red flag.
- [ ] **ITV: what went wrong,** the rejected alternative, and something loved
      and killed. Four years; there is a real one.
- [ ] **Is Studios Portal still in production?** Years-in-use is a strong
      substitute metric.

## Naming, from the Figma frames

- [ ] **The nav says Approach / Archive / About / Contact.** The brief's IA
      calls it Work plus a Library. "Archive" currently points at `/work`,
      which is a label and a route that disagree. Settle which naming wins
      before anything links to it publicly.
- [ ] **Three disciplines per project**, as `[LIKE] [THIS]` in the frame.
      Placeholders are in `src/app/page.tsx`.

## Deployment

- [x] **Canonical URL.** Set to `https://alexpurdie.co`.
- [ ] **IONOS mailboxes.** The imported MX and SPF records point at IONOS mail.
      Keep them if a `@alexpurdie.co` address is wanted; if not, they route mail
      to a mailbox nobody reads.
- [ ] **Decide what gets locked.** The posting asks for a password on the
      resume. Locking everything makes a recruiter authenticate before seeing
      anything; the usual answer is a public index and locked case studies.

## Licensing

- [ ] **Metric is a Klim test font.** Licensed for evaluation and mockups, not
      a public production site. A retail license swaps the files in
      `src/fonts/` and changes nothing else — the declaration in `fonts.ts`
      and every rule using `--sans` stays as it is. Same applies to Martina
      Plantijn, which is also a test cut.

## Assets

Alex rated these 5/5 and said no rebuilding needed. Every `<Slot>` on the site
carries a brief describing exactly what belongs in it.

- [ ] **The JA QA photographs** — tablets running in a live simulation site.
      The single most important image on the site.
- [ ] JA feature backlog artifact; lock-screen iterations; a strategy artifact
      (emotional map, user flow or heuristic pillars); final UI.
- [ ] ITV: the portal in use, the design system, shipped screens.

## Not yet written

- [ ] 100 Shapes as featured #3 — largely writable from intake §6 already.
- [ ] Your Move as featured #4.
- [ ] Library index, About timeline, Contact, Colophon.
- [ ] Two essays: *Traditional UX, AI in UX, agentic UX* and *A tool, not a vessel*.
