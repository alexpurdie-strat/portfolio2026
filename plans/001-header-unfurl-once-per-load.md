# 001 — Stop the header unfurl re-firing on every client-side navigation

- **Status**: DONE
- **Commit**: b188b9b
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: 2 files, ~15 lines

## Problem

The header's torn sheet plays an 860ms lay-down-and-unfurl animation. It is
documented and intended as a once-per-page-load gesture — `src/components/design-system.tsx`
describes it as *"Once per load, pure CSS."*

It is not once per load. `SiteHeader` is rendered inside each page rather than
in the root layout (`src/app/page.tsx`, `src/app/archive/page.tsx`,
`src/app/archive/[slug]/page.tsx`, `src/app/ask/page.tsx`, `src/app/about/page.tsx`,
`src/app/approach/page.tsx`, `src/app/design-system/page.tsx` — `SiteHeader` is
absent from `src/app/layout.tsx`). Every client-side navigation unmounts and
remounts it, so the CSS animation restarts.

Measured over the Chrome DevTools Protocol on the running dev server: after a
hard load the texture reports `0` running animations; 220ms after clicking a nav
link it reports `sheet-laid, running, currentTime 167`, and again after a second
nav. It fires on every route change.

This matters because navigation is a high-frequency action. The audit bar puts
animation on actions performed tens of times per session in the "remove or
drastically reduce" band, and an 860ms entrance is far past the 300ms UI budget.
A gesture that is charming once per visit becomes a tax on every click.

```css
/* src/app/globals.css:2147-2154 — current */
@media (prefers-reduced-motion: no-preference) {
  .site-header__texture {
    /* Slow off the mark and then away: an eased-out curve put most of the
       swing inside the first two frames, which read as a drop rather than
       as something unfurling. */
    animation: sheet-laid 860ms cubic-bezier(0.5, 0.02, 0.25, 1);
  }
}
```

## Target

The animation plays on the first paint of a document and never again for the
life of that document. Route changes leave the header perfectly still.

Do this by gating the rule on an attribute that is absent at first paint and
set once the animation has finished. Do NOT move `SiteHeader` into the root
layout: it takes a per-route `leak` prop (`<SiteHeader leak />` in
`src/app/ask/page.tsx`) that a server-rendered layout cannot vary by route,
and moving it is a structural change well beyond this fix.

```css
/* target — src/app/globals.css */
@media (prefers-reduced-motion: no-preference) {
  html:not([data-laid]) .site-header__texture {
    animation: sheet-laid 860ms cubic-bezier(0.5, 0.02, 0.25, 1);
  }
}
```

```tsx
/* target — src/components/paper-motion.tsx, module scope, above the component */
/* Survives the remounts that route changes cause, so the header's entrance
   plays once per document and not once per navigation. */
let laid = false;
```

```tsx
/* target — inside the existing useEffect, immediately after
   root.setAttribute("data-motion", ""); */
    if (!laid) {
      laid = true;
      /* after the animation's own 860ms, so removing the matching selector
         cannot cancel it mid-flight */
      window.setTimeout(() => root.setAttribute("data-laid", ""), 1000);
    }
```

## Repo conventions to follow

- Motion that must be script-confirmed is gated on an attribute on `<html>`,
  set from `PaperMotion` and read by an `html[...]` prefix in CSS. Exemplar:
  `src/app/globals.css` — `html[data-motion] .mnote__text { ... }`, set by
  `root.setAttribute("data-motion", "")` in `src/components/paper-motion.tsx`.
- `PaperMotion` is already mounted once in `src/app/layout.tsx` and persists
  across navigation; its `useEffect` re-runs on `pathname` change, which is
  exactly why the guard must live at module scope and not in the effect.
- The effect's cleanup removes `data-motion`. Do NOT remove `data-laid` in
  cleanup — it must persist for the life of the document.

## Steps

1. `src/app/globals.css` — in the `@media (prefers-reduced-motion: no-preference)`
   block at line 2147, change the selector `.site-header__texture` to
   `html:not([data-laid]) .site-header__texture`. Leave the comment and the
   `animation` shorthand exactly as they are.
2. `src/components/paper-motion.tsx` — add `let laid = false;` at module scope,
   directly above `export function PaperMotion() {`, with the comment shown in
   Target.
3. `src/components/paper-motion.tsx` — inside the existing `useEffect`,
   immediately after the line `root.setAttribute("data-motion", "");`, insert
   the `if (!laid) { ... }` block shown in Target.
4. Do not alter the cleanup function.

## Boundaries

- Do NOT move `SiteHeader` into `src/app/layout.tsx`.
- Do NOT remove `<SiteHeader />` from any page, and do NOT change the `leak`
  prop on `src/app/ask/page.tsx`.
- Do NOT change the animation's duration, easing, or keyframes — the timing is
  a deliberate, documented choice.
- Do NOT add dependencies.
- If the code at the cited lines does not match, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npx eslint src --quiet` both exit
  clean with no output.
- **Feel check**: with the dev server running, load `/archive` fresh and confirm
  the header sheet still unfurls once. Then click Approach → About → Ask in the
  nav and confirm the header does not move at all on any of those.
  - In DevTools, run
    `document.querySelector('.site-header__texture').getAnimations().length`
    immediately after a nav click: it must be `0`.
  - Hard-reload any page: it must be `1` briefly, then `0`.
  - In the Rendering panel set `prefers-reduced-motion: reduce`, reload, and
    confirm the header never animates and is correctly positioned.
- **Done when**: a fresh document load animates the header exactly once, and no
  client-side navigation produces any header motion.
