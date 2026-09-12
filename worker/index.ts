/*
 * The gate.
 *
 * The brief requires host-level protection and forbids a client-side one, for
 * the obvious reason: a password checked in the browser is a password printed
 * in the browser. This runs in the Worker, at the edge, before a single byte
 * of the site is served — a locked page is never sent, not hidden after
 * arrival.
 *
 * Deliberately fails OPEN. If SITE_PASSWORD is unset the site serves normally,
 * because the content here is a portfolio its author wants read, and the
 * failure mode of a missing secret should not be a stranger meeting a lock
 * screen with no way past it. That trade would be wrong for anything actually
 * confidential.
 */

interface Env {
  /* Bound in wrangler.jsonc. Serves the static export. */
  ASSETS: { fetch(request: Request): Promise<Response> };
  /* `wrangler secret put SITE_PASSWORD` — never in the repo. */
  SITE_PASSWORD?: string;
  /* `wrangler secret put COOKIE_SECRET` — signs the cookie so it cannot be
     forged by anyone who knows the format. */
  COOKIE_SECRET?: string;
  /* Comma-separated path prefixes served without the gate. Unset locks all. */
  PUBLIC_PREFIXES?: string;
}

const COOKIE = "ap_access";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const enc = new TextEncoder();

async function sign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/*
 * A password read off a resume arrives in a dozen shapes. If it is a URL, one
 * reader types the protocol, another adds www, a third lands a trailing slash,
 * and a phone capitalises the first letter on its own. None of those are wrong
 * answers, and a gate that treats them as wrong turns a formality into a
 * closed door.
 *
 * Both sides go through this, so the stored secret can be written however it
 * reads best on the page.
 */
function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

/* Compares in time that does not depend on where the strings first differ. A
   naive === leaks the answer one character at a time to anyone patient. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

async function hasValidTicket(request: Request, env: Env): Promise<boolean> {
  const raw = readCookie(request, COOKIE);
  if (!raw || !env.COOKIE_SECRET) return false;
  const [expiry, mac] = raw.split(".");
  if (!expiry || !mac) return false;
  if (Number(expiry) < Date.now()) return false;
  return safeEqual(mac, await sign(env.COOKIE_SECRET, expiry));
}

function isPublic(pathname: string, env: Env): boolean {
  const prefixes = (env.PUBLIC_PREFIXES ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return prefixes.some((p) => pathname === p || pathname.startsWith(p));
}

/* System faces only. The site's own fonts live behind the gate, and letting
   them through to dress this page would mean serving assets to someone who has
   not answered yet. */
function lockPage(error: boolean, next: string): Response {
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Alex Purdie</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100svh; display: grid; place-items: center;
    padding: 24px; background: #f8f5f2; color: #0d1b1e;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  main { width: 100%; max-width: 27rem; }
  h1 {
    font-family: "Iowan Old Style", Georgia, serif; font-weight: 700;
    font-size: clamp(2.4rem, 8vw, 3.5rem); line-height: 1.02;
    letter-spacing: -0.03em; margin: 0 0 0.6rem;
  }
  h1 em { font-style: italic; font-weight: 400; }
  p.lede { margin: 0 0 2rem; font-size: 1rem; line-height: 1.5; opacity: 0.72; }
  label { display: block; font-size: 0.8rem; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 0.55rem; opacity: 0.66; }
  .row { display: flex; gap: 10px; }
  input {
    flex: 1 1 auto; min-width: 0; font: inherit;
    /* 16px floor: anything smaller makes Safari zoom the viewport on focus. */
    font-size: max(16px, 1rem);
    padding: 0.8rem 0.9rem; border-radius: 2px; color: inherit;
    background: #fff; border: 1px solid rgba(13,27,30,0.22);
  }
  input:focus-visible { outline: 2px solid #0d1b1e; outline-offset: 2px; }
  button {
    font: inherit; font-size: max(16px, 1rem); cursor: pointer;
    padding: 0.8rem 1.3rem; border: 0; border-radius: 2px;
    background: #0d1b1e; color: #f8f5f2;
    transition: background 160ms cubic-bezier(0.22,0.61,0.36,1);
  }
  button:hover { background: #d65d3b; }
  button:focus-visible { outline: 2px solid #0d1b1e; outline-offset: 2px; }
  .err { margin: 1rem 0 0; font-size: 0.92rem; color: #a8341a; }
  @media (prefers-reduced-motion: reduce) { button { transition: none; } }
</style>
</head><body>
<main>
  <h1>Alex <em>Purdie</em></h1>
  <p class="lede">This portfolio is password protected. The password is on my resume &mdash; if you have that in front of you, you already have this.</p>
  <form method="POST">
    <input type="hidden" name="next" value="${next.replace(/"/g, "&quot;")}">
    <label for="pw">Password</label>
    <div class="row">
      <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
      <button type="submit">Enter</button>
    </div>
    ${error ? '<p class="err" role="alert">That password did not work. Try again.</p>' : ""}
  </form>
</main>
</body></html>`;
  return new Response(html, {
    status: error ? 401 : 401,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      /* Never let a lock page be framed or sniffed. */
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    /* No password configured: the gate is not in use. */
    if (!env.SITE_PASSWORD || !env.COOKIE_SECRET) {
      return env.ASSETS.fetch(request);
    }

    if (isPublic(url.pathname, env) || (await hasValidTicket(request, env))) {
      return env.ASSETS.fetch(request);
    }

    if (request.method === "POST") {
      const form = await request.formData();
      const supplied = String(form.get("password") ?? "");
      const next = String(form.get("next") ?? "/") || "/";
      /* Only same-origin paths, so the form cannot be used as an open redirect. */
      const target = next.startsWith("/") && !next.startsWith("//") ? next : "/";

      if (safeEqual(normalize(supplied), normalize(env.SITE_PASSWORD))) {
        const expiry = String(Date.now() + MAX_AGE * 1000);
        const ticket = `${expiry}.${await sign(env.COOKIE_SECRET, expiry)}`;
        return new Response(null, {
          status: 303,
          headers: {
            Location: target,
            "Set-Cookie": `${COOKIE}=${ticket}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
            "Cache-Control": "no-store",
          },
        });
      }
      /* A wrong password costs a beat. Not rate limiting, but it makes a
         guessing loop expensive enough to notice. */
      await new Promise((r) => setTimeout(r, 700));
      return lockPage(true, target);
    }

    return lockPage(false, url.pathname + url.search);
  },
};
