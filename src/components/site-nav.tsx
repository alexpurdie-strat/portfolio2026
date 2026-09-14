"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV } from "@/content/site";

/*
 * The top-right nav. Slash-separated, 22px either side of the slash, exactly as
 * every frame in the moodboard draws it.
 *
 * It used to render a `.site-nav` class that has no CSS anywhere in the
 * project, so on the pages that mounted it the links came out as unstyled
 * serif body text. It now renders the same `.nav` markup the board and the
 * interior pages already use, which is where the 22px gap and the hover rule
 * actually live.
 *
 * What appears here is decided in one place — `SITE.navAll`'s `ready` flags,
 * filtered into `NAV`. Two are true: Archive and Contact. The other two pages
 * are not written, and a nav that links to an unwritten page is a worse
 * artifact than a short nav.
 *
 * Client-only for `aria-current`, which cannot be decided on the server.
 */
export function SiteNav({ fixed = false }: { fixed?: boolean }) {
  const pathname = usePathname();
  /* No empty landmark. A <nav> that announces itself and then contains nothing
     is worse than no nav at all. */
  if (NAV.length === 0) return null;
  return (
    <nav className={`nav${fixed ? " nav--fixed" : ""}`} aria-label="Primary">
      {NAV.map((item, i) => (
        <span key={item.href} className="nav__item">
          {i > 0 ? (
            <span className="nav__slash" aria-hidden>
              /
            </span>
          ) : null}
          <Link
            href={item.href}
            aria-current={
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "page"
                : undefined
            }
          >
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
