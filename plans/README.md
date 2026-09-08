# Animation plans

Produced by the `improve-animations` audit at commit `b188b9b`. Each plan is
self-contained: it names its own files, quotes the current code, and states the
exact target values. None of them require reading this file or each other.

| # | Title | Severity | Category | Status |
| --- | --- | --- | --- | --- |
| [001](001-header-unfurl-once-per-load.md) | Stop the header unfurl re-firing on every client-side navigation | HIGH | Purpose & frequency | DONE |
| [002](002-scope-per-frame-custom-properties.md) | Stop writing per-frame custom properties on the document root | HIGH | Performance | DONE |
| [003](003-motion-tokens.md) | Give motion the same token treatment as type and colour | MEDIUM | Cohesion & tokens | DONE |

## Recommended order

**001 → 002 → 003.**

001 and 002 are defects: the first is a documented intention the code does not
honour, the second is a named performance anti-pattern. Both are contained and
independently verifiable. 003 is preventative — it stops the next values added
from becoming a fourteenth and fifteenth literal — but it touches thirteen
lines across the stylesheet, so it is easier to review once the two behavioural
fixes have landed and settled.

## Outcome

All three executed and verified at commit `b188b9b`.

- **001** — fresh load reports `sheet-laid running` at 300ms with `data-laid`
  still absent, settles to identity by 1.7s, and both client-side navigations
  report zero animations.
- **002** — `document.documentElement.getAttribute('style')` is `null` during
  scroll and pointer movement. `--lag` reads `-7.50px` on a note; `--ptr-x`
  reads `0.870` on a cutout. Both behaviours unchanged.
- **003** — four `cubic-bezier` literals remain, all in `:root`. Computed
  transitions are byte-identical to before tokenisation.

Seven routes sweep with no console output.

## Dependencies

- **001 and 002 both edit `src/components/paper-motion.tsx`** but in different
  regions: 001 adds a module-scope flag and a block at the top of the effect,
  002 rewrites the writes inside `tick()` and the cleanup. They do not overlap.
  If both are executed by separate agents, land 001 first and let 002 rebase.
- **003 is independent of both** in behaviour, but it rewrites the same
  `animation:` line that 001 re-selects. Run 003 last and its line will already
  be inside the `html:not([data-laid])` rule — the plan's mapping still applies
  unchanged.

## Findings deliberately not planned

From the same audit, vetted and confirmed, but left for a later decision:

- **Hover motion is not gated on `(hover: hover) and (pointer: fine)`**
  (`globals.css:1113, 1601, 2167, 2172`). Touch devices fire a false hover on
  tap. The codebase already uses `@media (hover: none)` at lines 631 and 864, so
  the newer hover motion is inconsistent with its own conventions. MEDIUM.
- **The inked underline runs 320ms on nav hover** (`globals.css:2037`). Nav is a
  high-frequency hover target where the bar calls for drastically reduced
  motion; roughly 180ms would keep the eight-gesture stroke shape while making
  the feedback prompt. MEDIUM — but it is a taste call on a signature detail,
  so it wants a human decision rather than a plan.
- **`--rip` repaints a full-bleed mask every scroll frame.** Inherent to the
  tear effect and possibly fine, but the repaint area is large and this cannot
  be judged from source. Measure frame times while scrolling `/` before writing
  any plan. MEDIUM.
- **Reduced motion removes the plate hover affordance rather than its motion**
  (`globals.css:2106` sets `--lift: 0; filter: none`). Reduced motion should be
  gentler, not absent. LOW.

## Not a finding

`sheet-laid` uses `cubic-bezier(0.5, 0.02, 0.25, 1)`, a slow-start curve on an
entrance, which the bar would normally flag. It is a deliberate, documented
choice — an eased-out curve put the whole swing into the first two frames and
read as a drop rather than an unfurl. Recorded here so a later audit does not
re-open it.
