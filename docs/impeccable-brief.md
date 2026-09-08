# Frame for `impeccable critique`

Paste the **Brief** section below as the argument. Run the case study first.

```
impeccable critique src/components/case-study.tsx
```

Live at `http://localhost:3001/archive/enterprise`. Then, separately,
`impeccable critique src/app/page.tsx` (live at `/`) for the hero and the tear
gesture. One target per run — `critique` resolves a single stable surface and
persists a snapshot against it, so two runs give two comparable snapshots
where one run across the whole site gives neither.

`critique` is the right command here because it assesses and then asks. It does
not rewrite. That matters: the value being bought is judgment, not edits.

---

## Why this skill, and why sceptically

Its stated premise is *removing generic AI design*. This site's problem is the
inverse — it is aggressively specific, and the risk runs the other way: that
specificity has curdled into indulgence somewhere and nobody has said so.

So the finding to take seriously is **"this bespoke thing is not earning its
keep."** The finding to discount is **"this is unconventional."** Unconventional
is the brief.

Its real value is that it is the only outside eye on visual craft in this
project. Every decision so far has had the same author and the same judge, which
is exactly the position where taste stops being challenged.

## Brief

> **Mode: Experience**, with a hard constraint from Read.
>
> This is a design portfolio, so the artefacts lead. But a case study is not a
> gallery — a reader has to leave it understanding what the work was, what
> changed, and what part of it was mine. Where spectacle and comprehension
> conflict on this surface, comprehension wins. Judge whether the composition
> serves the argument, not only whether it is striking.
>
> **This is a refinement, not a redesign.** Keep the identity, the copy, the
> material premise and the motion vocabulary. Do not propose a new visual world.
> If the honest verdict is that the world itself is wrong, say that plainly in
> one paragraph and stop there rather than building the replacement.
>
> **The visual authority is `/design-system`**, the living style guide, rendered
> from `src/components/design-system.tsx` and live at `/design-system`. Read it
> before judging anything. It is not a token dump: it states the rules and the
> reasoning behind them — tears are real alpha from photographed sheets, the
> hand sits over everything and is never bound by the layout, light comes
> through a tear once. There is no `DESIGN.md`; this page is the evidence, and
> its absence does not make this greenfield. Where a general heuristic conflicts
> with a stated rule on that page, the page wins — and note the conflict, so the
> rule can be re-examined on purpose rather than eroded by accident.
>
> **The premise, briefly.** A photographed paper desk. Sections are torn sheets
> laid over one another. Case studies are typeset prose in a left column with
> photographed, torn-edged artefacts ("plates") in a right lane. Handwriting
> annotates in the margins. Everything sits at a slight angle, because a hand
> put it there.
>
> **What I want judged, in priority order:**
>
> 1. **Does the plate pile earn its complexity?** It stacks on load, then
>    unfurls down the right lane on first scroll, and cursor proximity shoves
>    plates aside like a finger pushing photos across a desk
>    (`src/components/plate-pile.tsx`, `src/components/paper-motion.tsx`). It is
>    the single most expensive gesture on the site. Is it doing work, or is it a
>    trick I have fallen for because I built it?
> 2. **Is the hierarchy legible at a glance?** Two columns, a torn masthead,
>    metrics, a pull quote, handwriting on top. Under `Cognitive Load`, be
>    specific about whether a reader knows where to start and where to go next.
> 3. **Typography.** Editorial intent, a real typographic scale, and a
>    deliberately restrained palette. Where is the scale muddy, the measure
>    wrong, or the hierarchy carried by decoration instead of type?
> 4. **The line between confident and precious.** This is the question I cannot
>    answer myself. Name the specific elements over that line.
>
> **Known and out of scope — do not spend findings here.** Four of six case
> studies are invented placeholder copy with synthetic imagery (flagged in
> `src/content/work.ts`; real ones are `02.001 Leadership` and
> `02.002 Enterprise` — judge those). The home page has three lorem blocks. The
> Ask page has placeholder contact details. Content is being written separately.
>
> **Verification is already covered**, so weight the report toward judgment
> rather than re-running these: zero console errors across all eight routes,
> `tsc` and `eslint` clean, no own element under 44px at 390px, no horizontal
> overflow, skip link and `aria-current` in place, and a scroll-motion pass that
> holds 60fps. Contradict any of it with a measurement and I will believe you —
> but do not re-report it as unexamined.
>
> Read `.impeccable/critique/ignore.md` first. It lists six deliberate
> decisions, with reasons.

## Reading the result

Sort its findings into three piles before acting on any of them:

**Craft** — a value is off, a rhythm is broken, an edge is unresolved, the scale
is muddy. Take these at face value; this is what the run is for.

**Taste** — it wants something calmer, more conventional, more legible as
"modern portfolio." Weigh these individually and expect to reject most. When one
lands, it will be because it named something I had stopped seeing.

**Premise** — it argues with the material world itself. Reject, but log it. If
the same premise objection arrives twice from independent runs, that is a signal
worth taking seriously.

The genuine failure state is not a harsh report. It is a report that praises the
distinctiveness and finds nothing to fix, which would mean the run bought
nothing.
