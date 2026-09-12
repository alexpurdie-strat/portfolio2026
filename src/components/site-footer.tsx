import Link from "next/link";
import { SITE } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page site-footer__inner">
        <p className="site-footer__line">{SITE.footer.line}</p>
        <p className="site-footer__links">
          {SITE.footer.links.map((l, i) => (
            <span key={l.href}>
              {i > 0 ? <span aria-hidden> · </span> : null}
              <Link className="tap" href={l.href}>
                {l.label}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
