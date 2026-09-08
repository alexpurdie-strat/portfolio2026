"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* Marks match the shelf marks in the content: 01 Approach, 02 Archive. */
const NAV_ITEMS = [
  { mark: "01.", label: "Approach", href: "/approach" },
  { mark: "02.", label: "Archive", href: "/archive" },
  { mark: "03.", label: "About", href: "/about" },
  { mark: "04.", label: "Ask", href: "/ask" },
];

/**
 * Split out of `SiteHeader` purely to get the current path: nothing else in
 * the header needs to be a client component, and `aria-current` cannot be
 * decided on the server.
 *
 * A case study counts as being in the Archive, so 02 stays marked while
 * reading one.
 */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="site-header__nav" aria-label="Primary">
      {NAV_ITEMS.map((item) => {
        const here =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            className="text-button"
            key={item.href}
            href={item.href}
            aria-current={here ? "page" : undefined}
          >
            <span className="site-header__navMark" aria-hidden>
              {item.mark}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
