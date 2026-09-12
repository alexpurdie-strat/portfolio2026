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

### 2c. Lock the domain against mail spoofing

No mailbox is wanted, and the four inherited IONOS mail records — `MX` x2, the
SPF `TXT`, `autodiscover` and `_dmarc` — have been deleted. Verified gone from
the authoritative nameserver.

That leaves the domain saying nothing about mail, which is the spoofable state:
with no SPF and no DMARC, anyone can send mail claiming to be
`@alexpurdie.co` and receivers have no instruction to stop them. This matters
more than usual for a domain printed on a resume. Add three records:

| Type | Name | Content | Priority |
|---|---|---|---|
| MX | `alexpurdie.co` | `.` | 0 |
| TXT | `alexpurdie.co` | `v=spf1 -all` | — |
| TXT | `_dmarc` | `v=DMARC1; p=reject;` | — |

A null MX (RFC 7505) states the domain accepts no mail; `-all` states no server
may send as it; `p=reject` tells receivers to drop anything failing those
checks. All three are DNS only — there is nothing to proxy.

If an address on the domain is ever wanted, **Cloudflare Email Routing** is free
and is not a mailbox: it forwards `alex@alexpurdie.co` to an existing inbox and
writes its own MX and SPF, replacing the records above. The contact address in
`src/content/site.ts` is a Gmail account; change it only once a test message has
actually arrived.

### 3. Create the project

Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a
repository** → `portfolio2026`.

| Field | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Env var | `NODE_VERSION` = `22` |

Do **not** set `NEXT_PUBLIC_BASE_PATH`. It exists for subdirectory hosting; on
a domain root it must stay unset or every asset path gains a prefix that is not
there.

**`wrangler.jsonc` in the repo is not optional, and it is not really
configuration.** Its job is to exist. With no wrangler config present,
`wrangler deploy` runs its own auto-detection, sees Next.js, assumes a
server-rendered app, and installs the OpenNext adapter — which then looks for
`.next/standalone` and dies, because `output: "export"` never produces one. The
symptom is a build log where `next build` succeeds cleanly and *then* a second
Next build starts and fails. Nothing is wrong with the build; the deploy step
is rebuilding it as a different kind of application.

The config declares a Worker with no `main` — assets and nothing else:

```jsonc
"assets": {
  "directory": "./out",
  "not_found_handling": "404-page"
}
```

`404-page` serves `out/404.html`, which Next exports for exactly this.
`single-page-application` would be wrong here: this is a multi-page static
site, and that setting answers every bad URL with the home page and a 200.

Verify a change to any of this locally before pushing, which costs nothing:

```
npm run build && npx wrangler deploy --dry-run
```

### 4. Attach the domain

Pages project → **Custom domains** → **Set up a custom domain** → `alexpurdie.co`,
then again for `www.alexpurdie.co`. Cloudflare writes the DNS records
itself and issues the certificate. No change needed at IONOS.

### 5. The password

The posting asks for credentials on the resume, and the brief forbids doing
this in the browser — for the obvious reason that a password checked in the
browser is a password printed in the browser. So it runs in the Worker, at the
edge, ahead of the files: a locked page is never sent rather than hidden after
it arrives.

Two secrets. Neither is ever in the repo:

```
npx wrangler secret put SITE_PASSWORD
npx wrangler secret put COOKIE_SECRET
```

The first is the password that goes on the resume. The second signs the cookie
so nobody who guesses its format can forge one — it is never typed by a person,
so make it long. One generated for you, unused, valid to paste:

```
3c96745fdfcb7020f6c59bab1271ff382e40336ca939b7e6132bd7a56f761470
```

Secrets apply to the live Worker immediately and survive every later deploy.
Setting them is what turns the gate on: **with no SITE_PASSWORD the site serves
normally.** That is deliberate. The content here is a portfolio its author
wants read, and the failure mode of a missing secret should not be a stranger
meeting a lock screen. For anything actually confidential that trade would be
the wrong way round.

**Everything is locked by default.** To leave part of it open — a public index
with the work behind the password is the usual shape — add a plain variable in
the dashboard under Settings → Variables:

| Name | Value |
|---|---|
| `PUBLIC_PREFIXES` | `/,/about/,/_next/` |

Comma-separated path prefixes. Leave it unset to lock everything.

Verified locally against `wrangler dev`, all eight cases: a request with no
cookie gets the lock page and none of the site's content; pages and images are
both gated; a wrong password is refused; the right one sets an HttpOnly, Secure,
SameSite=Lax cookie and returns you to the page you asked for; a tampered or
malformed cookie is refused; and `next=https://evil.example` redirects to `/`
rather than off-site.

To change the password later, run `wrangler secret put SITE_PASSWORD` again.
To revoke everyone's existing session, change `COOKIE_SECRET` — every cookie
signed with the old one stops verifying.

Note that `run_worker_first` means the Worker runs on every request, including
images. That is what makes the gate real, and a portfolio does not come close
to the free plan's daily request allowance.

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

## alexpurdie.com

`.co` is the primary. `.com` is owned too and redirects to it, so that nobody
typing the more obvious TLD from memory or from a printed resume lands on an
IONOS parking page.

1. Cloudflare → **Add a site** → `alexpurdie.com` → Free. Delete whatever the
   scan imports; nothing on this domain needs to resolve anywhere.
2. IONOS → the `.com` domain → nameservers → the pair Cloudflare gives.
3. Add two **proxied** DNS records, both pointing at `192.0.2.1` — a reserved
   documentation address from RFC 5737 that nothing routes to:

   | Type | Name | Content | Proxy |
   |---|---|---|---|
   | A | `alexpurdie.com` | `192.0.2.1` | Proxied |
   | A | `www` | `192.0.2.1` | Proxied |

   A redirect rule only runs on traffic that reaches Cloudflare's edge, and
   traffic only reaches the edge if a proxied record exists. The address is
   never connected to — the redirect answers first.

4. **Rules** → **Redirect Rules** → create:

   - When: `Hostname` `equals` `alexpurdie.com` — add an *or* for `www.alexpurdie.com`
   - Then: **Dynamic** redirect, status **301**, preserve query string
   - Expression: `concat("https://alexpurdie.co", http.request.uri.path)`

   Dynamic rather than static so that deep links survive —
   `alexpurdie.com/archive/ja-finance-park/` lands on the case study rather
   than dumping every visitor on the home page.
