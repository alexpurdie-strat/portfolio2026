import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { SITE } from "@/content/site";

/*
 * The masthead the archive and contact frames share: the name on the left, the
 * nav on the right, and nothing else.
 *
 * The moodboard frames also carry the tagline under the name and the email
 * under the nav. Both are gone from these two pages deliberately — the tagline
 * is the home page's introduction and does not need restating once a reader is
 * inside, and on the contact page the email was printed twice within 500px of
 * itself, once as chrome and once as the thing the page is actually for.
 *
 * It is not SiteHeader, which is a single row and hangs off classes that have
 * no CSS; and it is not the board's masthead, which is welded to the home
 * page's scroll collapse. This one is static, because these pages do not
 * collapse anything.
 */
export function PageMast() {
  return (
    <header className="mast">
      <Link className="mast__name" href="/">
        {SITE.name}
      </Link>
      <SiteNav />
    </header>
  );
}
