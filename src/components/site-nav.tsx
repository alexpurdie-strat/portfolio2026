"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE } from "@/content/site";

/* Client-only for `aria-current`, which cannot be decided on the server. */
export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="site-nav" aria-label="Primary">
      {SITE.nav.map((item) => {
        const here =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            className="site-nav__link tap"
            href={item.href}
            aria-current={here ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
