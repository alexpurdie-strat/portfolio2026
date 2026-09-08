# 003 — Give motion the same token treatment as type and colour

- **Status**: DONE
- **Commit**: b188b9b
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files, ~30 lines

## Problem

`src/app/globals.css` defines tokens in `:root` for colour, type scale, weight,
leading and the grid. It defines none for motion. Every curve and duration in
the codebase is a literal typed at the call site, and several are typed more
than once:

```css
/* src/app/globals.css — current, all 13 sites */
302:   transition: font-variation-settings 260ms cubic-bezier(0.22, 0.61, 0.36, 1);
413:     transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1),
414:     translate 420ms cubic-bezier(0.22, 0.61, 0.36, 1);
465:   transition: opacity 380ms ease;
543:   transition: opacity 380ms ease;
1109:    transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1),
1597:  transition: font-variation-settings 260ms cubic-bezier(0.22, 0.61, 0.36, 1);
1895:  transition: transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1);
1934:  transition: opacity 380ms ease;
2037:  transition: clip-path 320ms cubic-bezier(0.33, 0.1, 0.25, 1);
2091:  transition: --ink 520ms cubic-bezier(0.4, 0, 0.2, 1);
2152:    animation: sheet-laid 860ms cubic-bezier(0.5, 0.02, 0.25, 1);
2164:  transition: font-variation-settings 260ms cubic-bezier(0.22, 0.61, 0.36, 1);
```

`cubic-bezier(0.22, 0.61, 0.36, 1)` appears seven times; the exact pair
`260ms cubic-bezier(0.22, 0.61, 0.36, 1)` is hand-typed three times (302, 1597,
2164) and `380ms ease` three times (465, 543, 1934).

This matters more here than in a typical codebase, because
`src/components/design-system.tsx` publishes a `MOTION` table of durations and
easings and the project's `CLAUDE.md` names `/design-system` as *"the authority
on style."* Today that table is prose describing numbers that live, unnamed, in
thirteen other places. The next value added will be a fourteenth literal.

## Target

Named tokens in `:root`, and every call site referencing them. **No value
changes.** Each token is exactly the literal it replaces, so the site animates
identically before and after — this is a naming change, not a feel change.

```css
/* target — src/app/globals.css, in :root, after the existing --leading-* tokens */
  /* Motion. The design system's 00.008 table is the prose form of these.
     Named after what they are for, not what they are made of. */
  --ease-settle: cubic-bezier(0.22, 0.61, 0.36, 1);
  --ease-unfurl: cubic-bezier(0.5, 0.02, 0.25, 1);
  --ease-ink: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-stroke: cubic-bezier(0.33, 0.1, 0.25, 1);

  --dur-lift: 240ms;
  --dur-weight: 260ms;
  --dur-underline: 320ms;
  --dur-annotation: 380ms;
  --dur-parallax: 420ms;
  --dur-ink: 520ms;
  --dur-resolve: 620ms;
  --dur-unfurl: 860ms;
```

Every site becomes, for example:

```css
/* target — 302, 1597, 2164 */
  transition: font-variation-settings var(--dur-weight) var(--ease-settle);

/* target — 465, 543, 1934 */
  transition: opacity var(--dur-annotation) ease;

/* target — 2152 */
    animation: sheet-laid var(--dur-unfurl) var(--ease-unfurl);
```

## Repo conventions to follow

- Tokens live in the single `:root` block at the top of `src/app/globals.css`,
  each group introduced by a block comment saying what the group is for.
  Exemplar: the `--text-*` scale, whose comment explains the anchor size, and
  `--grid-*` directly below it.
- Token names describe role, not implementation — the file already has
  `--accent-amber-wash` and `--wght-numeral`, not `--yellow-2` or `--w700`.
  Follow that: `--ease-unfurl`, not `--ease-4`.
- The design system's motion table is a hand-written array at
  `src/components/design-system.tsx` (`const MOTION = [...]`). Its second and
  third columns are the duration and easing strings.

## Steps

1. `src/app/globals.css` — add the motion token block shown in Target to the
   existing `:root`, immediately after the `--leading-*` declarations.
2. Replace all thirteen literal sites listed in Problem with the token forms.
   Work from the highest line number downward so earlier line numbers stay
   valid. The mapping is exactly:
   - `260ms cubic-bezier(0.22, 0.61, 0.36, 1)` → `var(--dur-weight) var(--ease-settle)`
   - `620ms cubic-bezier(0.22, 0.61, 0.36, 1)` → `var(--dur-resolve) var(--ease-settle)`
   - `420ms cubic-bezier(0.22, 0.61, 0.36, 1)` → `var(--dur-parallax) var(--ease-settle)`
   - `240ms cubic-bezier(0.22, 0.61, 0.36, 1)` → `var(--dur-lift) var(--ease-settle)`
   - `380ms ease` → `var(--dur-annotation) ease`
   - `320ms cubic-bezier(0.33, 0.1, 0.25, 1)` → `var(--dur-underline) var(--ease-stroke)`
   - `520ms cubic-bezier(0.4, 0, 0.2, 1)` → `var(--dur-ink) var(--ease-ink)`
   - `860ms cubic-bezier(0.5, 0.02, 0.25, 1)` → `var(--dur-unfurl) var(--ease-unfurl)`
   - `240ms ease` (the `filter` half of the two-property transition at 1109-1110)
     → `var(--dur-lift) ease`
3. `src/components/design-system.tsx` — in the `MOTION` array, append the token
   name to each row's easing cell so the published table names the token as well
   as the value, e.g. `"cubic-bezier(.22,.61,.36,1)"` becomes
   `"--ease-settle · cubic-bezier(.22,.61,.36,1)"`. Do not change any number.

## Boundaries

- Do NOT change a single numeric value or curve. If a swap would alter any
  duration or control point, it is wrong — stop and report.
- Do NOT introduce curves from any external recommendation. In particular do
  not replace `cubic-bezier(0.22, 0.61, 0.36, 1)` with a stronger ease-out;
  that is a feel change and belongs in its own plan with its own feel check.
- Do NOT touch the `@keyframes sheet-laid` body or any `transition: none`
  declaration inside a `prefers-reduced-motion` block.
- Do NOT add dependencies.
- If the code at the cited lines does not match, STOP and report.

## Execution note

Two corrections found while executing:

1. The inventory above missed `transition-delay: 180ms` (the annotation delay).
   It was tokenised as `--delay-annotation: 180ms` for consistency; leaving it
   would have left a lone magic number the plan existed to remove.
2. The mechanical check `grep -nE "[0-9]+ms"` as written cannot pass — several
   block comments legitimately quote durations in prose. The corrected check is
   in Verification below.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npx eslint src --quiet` exit clean.
  Then confirm the swap was value-preserving:
  `grep -cE "cubic-bezier" src/app/globals.css` must return `4` — the four token
  definitions and nothing else. `grep -nE "[0-9]+ms" src/app/globals.css` must
  return only the eight `--dur-*` definitions.
- **Feel check**: every animation must be indistinguishable from before.
  - Hard-reload `/` and confirm the header unfurl looks unchanged.
  - Hover a nav link and confirm the underline inks at the same speed.
  - Hover an archive row and confirm the shelf mark rides weight as before.
  - Scroll `/` and confirm the sheets tear and the notes stroke on unchanged.
  - In DevTools set Animations playback to 10% and compare the header unfurl
    against a stashed build if any doubt remains.
- **Done when**: only four `cubic-bezier` literals exist in the stylesheet, all
  inside `:root`, and no visual behaviour has changed.
