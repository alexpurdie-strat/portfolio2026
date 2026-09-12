import type { Metadata } from "next";
import Link from "next/link";
import { CaseCard } from "@/components/case-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Todo } from "@/components/todo";
import { SITE } from "@/content/site";
import { FEATURED } from "@/content/work";

export const metadata: Metadata = {
  title: SITE.meta.title,
  description: SITE.meta.description,
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page">
        <section className="section hero">
          {/* The belief is the page's heading, not decoration above one —
              rendered as an h1 because that is what it is. The page had no h1
              at all when this was a paragraph. */}
          <h1 className="hero__belief">{SITE.belief}</h1>
          <p className="lede hero__bio measure">{SITE.bio}</p>
          <p className="hero__now label">
            <Todo>Current role and availability — one line.</Todo>
          </p>
        </section>

        <hr className="rule" />

        {/* Anti-positioning. The framework rates this highly and the site had
            none: stating who you are not for reads as confidence and filters
            the inbound. Alex's own words, cut to about half the length. */}
        <section className="section not-for" aria-labelledby="not-for-heading">
          <h2 id="not-for-heading" className="label section-head">
            {SITE.sections.notFor}
          </h2>
          {SITE.notFor.map((line) => (
            <p key={line.slice(0, 24)} className="not-for__line measure">
              {line}
            </p>
          ))}
        </section>

        <hr className="rule" />

        <section className="section clients" aria-labelledby="clients-heading">
          <h2 id="clients-heading" className="label section-head">
            {SITE.sections.clients}
          </h2>
          <p className="clients__list">{SITE.clients.join(" · ")}</p>
        </section>

        <hr className="rule" />

        <section className="section work" aria-labelledby="work-heading">
          <h2 id="work-heading" className="label section-head">
            {SITE.sections.work}
          </h2>
          <div className="work__grid">
            {FEATURED.map((w) => (
              <CaseCard key={w.meta.slug} meta={w.meta} />
            ))}
          </div>
          <p className="work__more">
            <Todo>
              Three more featured case studies — ITV, Your Move, 100 Shapes —
              plus the library index.
            </Todo>
          </p>
        </section>

        <hr className="rule" />

        <section className="section contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="label section-head">
            {SITE.contact.heading}
          </h2>
          <p className="contact__line measure">
            {SITE.contact.line}{" "}
            <Link className="tap" href="/contact">
              {SITE.contact.linkText}
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
