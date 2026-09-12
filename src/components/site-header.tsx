import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SITE } from "@/content/site";

/*
 * Navigation is the one thing every benchmark in the framework keeps
 * conventional. Name on the left, four links on the right, no surprises.
 */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page site-header__inner">
        <Link className="site-header__name tap" href="/">
          {SITE.name}
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
