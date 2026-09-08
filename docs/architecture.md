# Site architecture

Baseline structure, ingested from `Portfolio.drawio.png` on 2026-09-02.
Purpose statements below are the map's own wording, lightly tidied — they are
intent, not copy.

```
Home
├── Approach
├── Archive
│   ├── Leadership   — 100 Shapes
│   ├── Enterprise   — ITV
│   ├── Intrigue     — JA FP
│   ├── Mobile       — YM          (map's Archive note calls this "diversity")
│   ├── Efficiency   — MB          (map's Archive note: "complexity to efficiency")
│   └── Passion      — Lego
├── About
└── Ask
```

## Purpose per page

**Home** — Tell a story. Make the person feel an overarching sense that I am
fresh but exactly what they need.
- Sell style · Sell high points · Sell comfort · Launchpad

**Approach** — Hit at the key needs of an org like Coke. Dive into innovative
practices; sell the idea of: speed, efficiency, quality, sustainability,
long-term strategy.

**Archive** — Back up the claims. Make the archival nature of the site's style
come alive here — the point is that it reads more senior.

**About** — Build a desire to know me more. Present refinement and capacity
without telling too much.

**Ask** — Connection point. Named Ask rather than Contact so all four
top-level destinations share an initial, and because it invites rather than
labels.

## What this implies for the build

- **11 routes.** Five top-level plus six case studies. Built so far: `/`,
  `/archive`, and `/design-system` (not in the map — internal reference).
- **The existing nav already matches** the four top-level destinations:
  Approach / Archive / About / Ask.
- **Archive is an index**, and the page already carries the pattern for it: the
  *numbered entry* component (hanging numeral + standfirst + source block +
  one link) is exactly a case-study row. Currently two entries; the map wants
  six.
- **Each case study is framed by a quality, not a client** — leadership,
  enterprise, intrigue, diversity, efficiency, passion. That is a strong
  editorial constraint worth holding: the quality is the headline and the
  client is the evidence for it. It also gives the Archive its spine, since
  the six qualities together are the argument the Approach page makes abstractly.
- **Approach and Archive are a matched pair.** Approach claims speed,
  efficiency, quality, sustainability, long-term strategy; Archive is
  explicitly there to "back up the claims". The two page's lists should
  probably be wired to each other rather than written independently.

## Open

- `JA FP`, `YM` and `MB` are unresolved initialisms — no matching material on
  the old portfolio and not expanded on the map.
- Three of the six Archive slots (Intrigue, Mobile, Efficiency) have no
  existing written material anywhere I can see. See `work-context.md`.
- The map drops two case studies that do exist and are strong — see the same
  file for why that is worth a second look.
