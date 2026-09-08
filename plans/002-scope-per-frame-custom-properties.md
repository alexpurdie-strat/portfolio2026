# 002 — Stop writing per-frame custom properties on the document root

- **Status**: DONE
- **Commit**: b188b9b
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file, ~30 lines

## Problem

`src/components/paper-motion.tsx` runs one `requestAnimationFrame` loop that
writes three custom properties to `document.documentElement` — the `<html>`
element — on every frame that their value changes:

```tsx
/* src/components/paper-motion.tsx:172-180 — current */
          root.style.setProperty("--ptr-x", ptrX.toFixed(3));
          root.style.setProperty("--ptr-y", ptrY.toFixed(3));
          ptrWritten = ptr;
        }
      }

      const next = `${lag.toFixed(2)}px`;
      if (next !== written) {
        root.style.setProperty("--lag", next);
        written = next;
      }
```

`root` is `document.documentElement` (`src/components/paper-motion.tsx:35`).

Custom properties inherit. Writing one on the root invalidates the computed
style of every element in the document, every frame. `--lag` changes on every
scroll frame on every page; `--ptr-x`/`--ptr-y` change on every pointer-move
frame on the home page, which also carries the largest DOM.

The audit bar names this pattern directly: do not drive child transforms via a
custom property on a parent, because it recalculates styles for all children —
set the value on the element that consumes it. The root is the worst possible
parent to choose.

The actual consumers are few:

- `--lag` is read only by `.mnote__inner` (`src/app/globals.css`):
  `transform: translateY(var(--lag, 0px)) rotate(var(--mnote-tilt, -2deg));`
  There are at most about seven of these on a page.
- `--ptr-x` / `--ptr-y` are read only by `.collage__piece` (`src/app/globals.css`):
  `translate: calc(var(--ptr-x, 0) * var(--par, 0) * 1px) calc(var(--ptr-y, 0) * var(--par, 0) * 1px);`
  There are exactly three, and each is an `<img>` with no children.

## Target

Write each property onto the elements that consume it. No per-frame writes to
`document.documentElement` remain. The CSS is unchanged — the same property
names resolve, just from a nearer element.

```tsx
/* target — collected once, next to the existing element lookups */
    const lagging = Array.from(
      document.querySelectorAll<HTMLElement>(".mnote__inner"),
    );
    const pieces = Array.from(
      document.querySelectorAll<HTMLElement>(".collage__piece"),
    );
```

```tsx
/* target — inside tick(), replacing the two root.style.setProperty blocks */
      if (stage) {
        ptrX += (ptrTargetX - ptrX) * 0.08;
        ptrY += (ptrTargetY - ptrY) * 0.08;
        const ptr = `${ptrX.toFixed(3)}|${ptrY.toFixed(3)}`;
        if (ptr !== ptrWritten) {
          for (const piece of pieces) {
            piece.style.setProperty("--ptr-x", ptrX.toFixed(3));
            piece.style.setProperty("--ptr-y", ptrY.toFixed(3));
          }
          ptrWritten = ptr;
        }
      }

      const next = `${lag.toFixed(2)}px`;
      if (next !== written) {
        for (const note of lagging) {
          note.style.setProperty("--lag", next);
        }
        written = next;
      }
```

```tsx
/* target — cleanup: replace the two root.style.removeProperty calls */
      for (const note of lagging) note.style.removeProperty("--lag");
      for (const piece of pieces) {
        piece.style.removeProperty("--ptr-x");
        piece.style.removeProperty("--ptr-y");
      }
```

## Repo conventions to follow

- Element lists are collected once outside `tick()` and reused, never queried
  per frame. Exemplar: `src/components/paper-motion.tsx` — `let pending = Array.from(...)`
  and `let ripping = Array.from(...)`, both collected before the loop starts.
- Per-frame writes are guarded by a string comparison against the last written
  value (`written`, `ptrWritten`) so an unchanged value costs nothing. Keep
  those guards — they now protect a loop over several elements rather than one
  write, which makes them more valuable, not less.
- `--rip` is already written per element (`sheet.style.setProperty("--rip", ...)`
  inside `rip()`). That is the pattern this plan brings the other two in line with.

## Steps

1. `src/components/paper-motion.tsx` — add the `lagging` and `pieces` arrays at
   effect scope, alongside the existing `ripping` array declaration, using the
   code in Target.
2. Replace the `root.style.setProperty("--ptr-x", ...)` / `("--ptr-y", ...)`
   pair inside `tick()` with the `for (const piece of pieces)` loop in Target.
3. Replace the `root.style.setProperty("--lag", next)` call inside `tick()`
   with the `for (const note of lagging)` loop in Target.
4. In the effect's cleanup, replace
   `root.style.removeProperty("--lag")`, `root.style.removeProperty("--ptr-x")`
   and `root.style.removeProperty("--ptr-y")` with the per-element removals in
   Target.
5. Leave `root.setAttribute("data-motion", "")` and its cleanup
   `root.removeAttribute("data-motion")` untouched — an attribute set once is
   not the problem this plan addresses.

## Boundaries

- Do NOT change any CSS. The property names and the rules that read them stay
  exactly as they are.
- Do NOT change the smoothing constants (`0.82`, `0.18`, `0.12`, `0.08`), the
  `MAX` of `9`, the `1.6` multiplier, or the `% 6` frame throttle — this is a
  performance change, not a feel change.
- Do NOT convert the loop to write `style.transform` or `style.translate`
  directly; the CSS composes these properties with per-element values
  (`--mnote-tilt`, `--par`) that JavaScript would have to re-derive.
- Do NOT add dependencies.
- If the code at the cited lines does not match, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npx eslint src --quiet` exit clean.
- **Feel check**: nothing should look any different. That is the success
  condition — confirm it:
  - On `/archive`, scroll briskly and confirm the margin notes still trail the
    page and settle, exactly as before.
  - On `/`, move the pointer across the collage and confirm the three cutouts
    still deflect and ease back.
  - In DevTools, inspect `<html>` while scrolling: its `style` attribute must
    no longer gain `--lag`, `--ptr-x` or `--ptr-y`. Inspect a `.mnote__inner`
    instead and confirm `--lag` appears there.
  - Performance panel: record ~5s of scrolling on `/archive` before and after.
    Recalculate-style time per frame should fall. Note the numbers in the PR.
- **Done when**: `document.documentElement.getAttribute('style')` contains no
  `--lag`/`--ptr-*` during scroll or pointer movement, and both behaviours look
  unchanged.
