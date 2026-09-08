# Deliberate decisions — not defects

Findings matching these are dropped silently. Everything here is a decision that
was made on purpose, with a reason, and re-litigating it costs a finding slot
that should go to something actionable. The list is deliberately short: it covers
choices a generic quality checker reliably misreads, not everything inconvenient.

The authority on all of it is the live style guide at `/design-system`
(`src/components/design-system.tsx`). Where an outside heuristic and that page
disagree, that page wins — see `docs/impeccable-brief.md`.

---

**Desktop-first media queries.** `src/app/globals.css` is one ~2900-line
stylesheet whose base layer is the wide canvas, with `max-width` queries
stepping down. Mobile-first is the better default and this is not it. Inverting
it is a rewrite of every rule in the file, not a fix, and the measured mobile
result is already correct. Flag a specific breakpoint that misbehaves; do not
flag the direction of the cascade.

**Rotation off the grid.** Margin notes, torn plates, collage cutouts and the
plate pile all sit at small angles (roughly 0.5°–6°) and do not align to the
12-column grid or to each other. This is the whole premise — objects on a desk,
placed by hand. Alignment tooling reads it as sloppy; it is the opposite.
`getBoundingClientRect()` on a rotated element also returns its *bounding box*,
not its size, so width and aspect-ratio measurements taken that way are wrong
by construction. Measure `offsetWidth`/`offsetHeight` here.

**One light theme.** `color-scheme: light` is set and there is no dark mode.
The site is a photographed paper desk. Paper does not have a dark mode, and an
inverted palette would break the material premise the entire design rests on.
Do not propose a dark theme or report its absence.

**Material texture.** Paper grain, the dust and light layers on `body::before`
/ `body::after`, and the alpha-cut torn edges are load-bearing, not decoration
to be simplified away. Every torn edge is real alpha from a photographed sheet —
never a `clip-path` zig-zag. A finding that these add visual noise is a finding
against the design, not against its execution. Cost is fair game: if a texture
layer measurably costs frames, say so with the number.

**The code-seam device.** Client and source names render as
`<class="company">ITV>` — a deliberate visual seam between the paper world and
the markup underneath (`src/components/archive-page.tsx`,
`src/components/case-study.tsx`). It is already paired for assistive tech: the
literal string is `aria-hidden` and carries `translate="no"`, alongside an
`.sr-only` span that announces "Client: ITV". Resolved; do not re-report as a
screen-reader or i18n problem.
