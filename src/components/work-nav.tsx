"use client";

import Link from "next/link";
import { NAV } from "@/content/site";

/* The collapsed masthead from the board, on every interior page — so the
   wordmark and nav sit where a reader has already learned to find them. */
export function WorkNav() {
  return (
    <div className="fixed-layer">
      {/* A ground for the header. Without it the wordmark and nav sit
          directly on whatever image is passing underneath. */}
      <span className="bar" aria-hidden />
      <Link className="mark mark--small" href="/">
        <span className="mark__italic">Alex</span> Purdie
      </Link>
      {NAV.length > 0 ? (
      <nav className="nav nav--fixed" aria-label="Primary">
        {NAV.map((item, i) => (
          <span key={item.href} className="nav__item">
            {i > 0 ? (
              <span className="nav__slash" aria-hidden>
                /
              </span>
            ) : null}
            <Link href={item.href}>{item.label}</Link>
          </span>
        ))}
      </nav>
      ) : null}
    </div>
  );
}
