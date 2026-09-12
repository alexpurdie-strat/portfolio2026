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

## 2026-09-11 — a background pattern, built and pulled

**What was tried:** an animated topographic contour pattern behind the board.
feTurbulence for the field, a discrete alpha transfer to slice it into contour
lines, two layers drifting at different speeds and scales.

**What it cost:** nothing. Measured at 16.7ms a frame with it on and 16.7ms
with it off, at rest and while scrolling — identical. The reason is that the
filter is baked into a data URI and rasterized once; all the motion after that
is transform on a composited layer. Animating the turbulence itself would have
been the obvious approach and would have cost tens of milliseconds a frame.

**Two things it took to look right:** 48 tonal bands with a line every eighth,
because at 25 the contours came out as blobs rather than lines. And a single
image scaled to cover rather than a tile — feTurbulence does not tile
seamlessly and the repeat seams were plainly visible as straight vertical
edges.

**Why it was pulled:** Alex's call, on looking at it. Worth recording that the
cost question had an answer — free — and the decision was taste, not
performance. The technique is here if a future surface wants it.
