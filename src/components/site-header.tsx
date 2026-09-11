import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

/*
 * Navigation is the one thing every benchmark in the framework keeps
 * conventional. Name on the left, four links on the right, no surprises.
 */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page site-header__inner">
        <Link className="site-header__name tap" href="/">
          Alex Purdie
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
