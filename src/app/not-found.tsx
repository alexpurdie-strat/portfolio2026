import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page">
        <section className="section measure">
          <p className="label">404</p>
          <h1 className="page-title">Not here.</h1>
          <p>
            That page doesn’t exist. Try{" "}
            <Link className="tap" href="/work">
              the work
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
