# Deployment

Cloudflare Pages, building from `main`. The domain is registered at IONOS; the
DNS and the hosting are Cloudflare's. Registrar and host are separate decisions
and this is the split.

---

## One-time setup

### 1. Add the site to Cloudflare

Cloudflare dashboard → **Add a site** → enter the domain → pick the **Free**
plan. It scans the existing DNS and then gives you **two nameservers**, like:

```
xxxx.ns.cloudflare.com
yyyy.ns.cloudflare.com
```

Copy both.

### 2. Point IONOS at them

IONOS → **Domains & SSL** → the domain → **Nameservers** → *Use custom
nameservers* → paste the two Cloudflare ones → save.

Propagation is usually minutes, occasionally a few hours. Cloudflare emails
when it is active. Nothing below works until it is.

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

Pages project → **Custom domains** → **Set up a custom domain** → the apex
(`example.com`), then again for `www`. Cloudflare writes the DNS records
itself and issues the certificate. No change needed at IONOS.

### 5. Lock it, if you want it locked

The job posting asks for a password on the resume, so at least one path needs
one.

Cloudflare **Zero Trust** → **Access** → **Applications** → **Add an
application** → **Self-hosted**.

- Application domain: the domain, or a path like `example.com/work/*`
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
- [ ] Set the canonical URL. `src/content/site.ts` has the metadata block;
      it needs `metadataBase` in `src/app/layout.tsx` pointing at the real
      domain, or Open Graph URLs resolve relative and break when shared.

## Files that belong to the host

- `public/_headers` — security headers and cache policy. Cloudflare reads it
  at deploy; it is inert anywhere else.
- `public/.nojekyll` — a GitHub Pages artifact. Harmless on Cloudflare, and
  worth keeping while the Pages URL still exists.
