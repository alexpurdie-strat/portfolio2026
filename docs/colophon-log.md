# Colophon log

Raw material for the /colophon page. The brief's rule: when AI tooling produces
something that gets substantially changed afterwards, note it here.

## 2026-09-11 — v2 foundation

**What Claude Code did:** scaffolded the token system, base stylesheet,
component set (FramingStrip, Aside, Figure, Todo, CaseCard), the MDX content
pipeline, the four route stubs and the hygiene gate. Drafted the JA case study
structure from the intake addendum.

**What it got wrong, caught by checking rather than by review:**
- Wrote the home page with no `<h1>` — the belief line was a paragraph.
- Floated the AI-in-the-loop asides out of a full-width container, putting a
  horizontal scrollbar on every case study at 1440px.
- Set metadata type at 11.2px.
- Wrote its own code comments in UK English, which its own spelling check then
  failed the build on.
- Built the hygiene gate so it caught the literal string `TODO(alex)` but not
  the `<Todo>` component that renders one — the gate had a hole in exactly the
  thing it existed to catch.

**What Alex decided:** to drop the previous torn-paper concept entirely after
running it against the framework's novelty-budget and archetype tests.

**Still open:** every fact in the JA case study that isn't in the intake. The
site currently carries 23 visible gaps and refuses to build for production
until they are closed.
