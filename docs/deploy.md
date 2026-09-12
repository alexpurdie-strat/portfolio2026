# Deployment

Cloudflare Pages, building from `main`. The domain is registered at IONOS; the
DNS and the hosting are Cloudflare's. Registrar and host are separate decisions
and this is the split.

---

## One-time setup

### 1. Add the site to Cloudflare

Cloudflare dashboard → **Add a site** → `alexpurdie.co` → **Free** plan.

Cloudflare scans the existing IONOS DNS and shows you what it found. Do not
click straight through — the scan imports records that were pointing at IONOS,
and some of them are wrong now.

### 2. Clean the imported records

**Delete** — these point at the IONOS parking page and would fight with the
records Pages writes later:

| Type | Name | Content |
|---|---|---|
| A | `alexpurdie.co` | `74.208.236.100` |
| AAAA | `alexpurdie.co` | `2607:f1c0:…` |

**Delete or ignore** — `_domainconnect` is IONOS's mechanism for letting
third-party apps write DNS at IONOS. Once the nameservers move, IONOS no longer
holds the DNS, so it does nothing.

**Set to DNS only (grey cloud)** — these are mail records. A proxied record
answers with Cloudflare's IPs, which is correct for web traffic and wrong for
everything else. Proxying `_dmarc` in particular breaks DMARC lookups outright:
the resolver asks for a TXT record and gets a web proxy.

| Type | Name |
|---|---|
| CNAME | `autodiscover` |
| CNAME | `_dmarc` |

**Leave alone** — already DNS only, which is right:

| Type | Name | Why |
|---|---|---|
| MX ×2 | `alexpurdie.co` | IONOS mailboxes |
| TXT | `alexpurdie.co` | SPF |

**Do not add `www`.** Cloudflare warns that it is missing; ignore it. Pages
writes that record itself when you attach the custom domain, and a manual one
would only have to be replaced.

Then **Continue to activation**.

### 2b. Point IONOS at Cloudflare

Activation gives you **two nameservers**:

```
xxxx.ns.cloudflare.com
yyyy.ns.cloudflare.com
```

IONOS → **Domains & SSL** → `alexpurdie.co` → **Nameservers** → *Use custom
nameservers* → paste both → save.

Propagation is usually minutes, occasionally a few hours. Cloudflare emails when
the zone is active. Nothing below works until it is.

### 2c. Email on the domain

No IONOS mailbox is wanted, which leaves the imported mail records pointing at a
service nobody uses. Two ways to finish, and they are not equivalent.

**Forwarding (recommended).** Cloudflare **Email Routing** is free and is not a
mailbox — `alex@alexpurdie.co` lands in an existing inbox. Worth it because the
contact address on the site is currently a Gmail account sitting next to a
custom domain, which reads as a smaller operation than it is.

Delete the IONOS records first — MX ×2, the SPF TXT, `autodiscover`, `_dmarc` —
then Cloudflare dashboard → **Email** → **Email Routing** → add the destination
address and verify it from the confirmation mail. Cloudflare writes its own MX
and SPF. Update `email` in `src/content/site.ts` once a test message arrives,
not before.

**No email at all.** Then the domain should say so, or it can be spoofed by
anyone — a live risk for a domain printed on a resume. Delete the same four
records and add:

| Type | Name | Content | Priority |
|---|---|---|---|
| MX | `alexpurdie.co` | `.` | 0 |
| TXT | `alexpurdie.co` | `v=spf1 -all` | — |
| TXT | `_dmarc` | `v=DMARC1; p=reject;` | — |

A null MX (RFC 7505) states the domain accepts no mail; `-all` states no server
may send as it; `p=reject` tells receivers to drop anything that fails. The
inherited IONOS DMARC record is `p=none`, which asks for nothing.

### 3. Create the Pages project

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
**Connect to Git** → authorize GitHub → pick `portfolio2026`.

Build settings:

| Field | Value |
|---|---|
| Production branch | `main` |
| Framework preset | **None** — the presets add flags this build does not want |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | *(leave blank)* |

Environment variables → add one, for **Production** and **Preview**:

| Name | Value |
|---|---|
| `NODE_VERSION` | `22` |

Do **not** set `NEXT_PUBLIC_BASE_PATH`. It exists for subdirectory hosting; on
a domain root it must stay unset or every asset path gains a prefix that is not
there.

### 4. Attach the domain

Pages project → **Custom domains** → **Set up a custom domain** → `alexpurdie.co`,
then again for `www.alexpurdie.co`. Cloudflare writes the DNS records
itself and issues the certificate. No change needed at IONOS.

### 5. Lock it, if you want it locked

The job posting asks for a password on the resume, so at least one path needs
one.

Cloudflare **Zero Trust** → **Access** → **Applications** → **Add an
application** → **Self-hosted**.

- Application domain: `alexpurdie.co`, or a path like `alexpurdie.co/archive/*`
- Policy → Action **Allow**, Include → **Emails** (list the addresses) or
  **Service Auth** with a one-time PIN

A one-time PIN to a named email is the closest Access gets to "here is the
password", and it is stronger than a shared one. If a literal shared password
is wanted instead, that is Cloudflare **Workers** with basic auth, or a
Netlify site-wide password — both worse, both simpler to explain on a resume.

**Decide what to lock.** Locking everything means a recruiter has to authenticate
before they can see anything, which costs more than it protects. The usual
answer is a public index and locked case studies.

---

## Everyday use

Push to `main`. Cloudflare builds and deploys. Every pull request gets its own
preview URL.

Nothing needs running locally to deploy, and there is no GitHub Actions
workflow any more — it was removed when this took over, because two pipelines
building the same output is two things to keep in step.

## Before the first real deploy

- [ ] `npm run check` must pass. It currently does not, on purpose: there are
      unresolved `TODO(alex)` markers and unfilled `<Slot>` images, and the
      gate exists to stop exactly that shipping. See `docs/open-questions.md`.
- [x] Canonical URL set — `metadataBase` in `src/app/layout.tsx` is
      `https://alexpurdie.co`.

## Files that belong to the host

- `public/_headers` — security headers and cache policy. Cloudflare reads it
  at deploy; it is inert anywhere else.
- `public/.nojekyll` — a GitHub Pages artifact. Harmless on Cloudflare, and
  worth keeping while the Pages URL still exists.

## After activation

Check **SSL/TLS → Overview** reads **Full (strict)**. Pages serves valid HTTPS
on its own, so anything looser is both unnecessary and, on *Flexible*, a
redirect loop waiting to happen.
