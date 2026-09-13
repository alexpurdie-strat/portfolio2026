"use client";

import Link from "next/link";
import { useTransitionTo } from "@/components/page-transition";

/*
 * A link that raises the drawer on its way.
 *
 * Still a real <a> underneath, so it opens in a new tab on a modified click,
 * shows its destination in the status bar, and works with JavaScript disabled.
 * The transition is an enhancement on top of a link, not a replacement for one.
 */
export function StampLink({
  href,
  slug,
  className,
  children,
}: {
  href: string;
  /** Which client stamp rides up on the drawer. */
  slug?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const go = useTransitionTo();
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        /* Leave every click the browser has its own meaning for alone. */
        if (
          e.defaultPrevented ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }
        e.preventDefault();
        go(href, slug);
      }}
    >
      {children}
    </Link>
  );
}
