"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Work", href: "/work" },
  { label: "Principles", href: "/principles" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* Client-only for `aria-current`, which cannot be decided on the server. */
export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="site-nav" aria-label="Primary">
      {ITEMS.map((item) => {
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
