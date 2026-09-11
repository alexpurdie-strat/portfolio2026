import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page site-footer__inner">
        <p className="site-footer__line">
          Alex Purdie — product designer and strategist.
        </p>
        <p className="site-footer__links">
          <Link className="tap" href="/contact">
            Get in touch
          </Link>
          <span aria-hidden> · </span>
          <Link className="tap" href="/colophon">
            How this site was built
          </Link>
        </p>
      </div>
    </footer>
  );
}
