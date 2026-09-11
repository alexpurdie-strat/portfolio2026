import type { Metadata } from "next";
import Link from "next/link";
import { CaseCard } from "@/components/case-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Todo } from "@/components/todo";
import { FEATURED } from "@/content/work";

/* Plain text, not a logo wall. Every benchmark in the framework states
   credentials flatly; none of them uses logos. */
const CLIENTS = [
  "The Home Depot",
  "ITV",
  "BBC",
  "NHS",
  "M&S",
  "TED",
  "LEGO",
  "Junior Achievement",
  "AdventHealth",
  "Chick-fil-A",
];

export const metadata: Metadata = {
  title: "Alex Purdie — Product designer and strategist",
  description:
    "Leads teams building platforms where digital systems meet real people doing real work. Junior Achievement, ITV, The Home Depot, NHS.",
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
          <h1 className="hero__belief">
            Giving people what they want and giving them what they need aren’t
            the same thing. I design for the difference.
          </h1>
          <p className="lede hero__bio measure">
            Alex Purdie is a product designer and strategist who leads teams
            building platforms where digital systems meet real people doing real
            work. Formerly Head of Product Design at 100 Shapes in London.
          </p>
          <p className="hero__now label">
            <Todo>Current role and availability — one line.</Todo>
          </p>
        </section>

        <hr className="rule" />

        {/* Anti-positioning. The framework rates this highly and the site had
            none: stating who you are not for reads as confidence and filters
            the inbound. Alex's own words, cut to about half the length. */}
        <section className="section not-for" aria-labelledby="not-for-heading">
          <h2 id="not-for-heading" className="label">
            Who I’m not for
          </h2>
          <p className="not-for__line measure">
            If you want wireframes every Tuesday without the thinking behind
            them, I’m not your designer. If you want research as a masthead
            rather than something that steers, I’m not either.
          </p>
          <p className="not-for__line measure">
            If you want someone to help decide what to build, and then hold the
            bar while it ships — that’s the work I’m for.
          </p>
        </section>

        <hr className="rule" />

        <section className="section clients" aria-labelledby="clients-heading">
          <h2 id="clients-heading" className="label">
            Selected clients
          </h2>
          <p className="clients__list">{CLIENTS.join(" · ")}</p>
        </section>

        <hr className="rule" />

        <section className="section work" aria-labelledby="work-heading">
          <h2 id="work-heading" className="label">
            Selected work
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
          <h2 id="contact-heading" className="label">
            Contact
          </h2>
          <p className="contact__line measure">
            If you want someone to help decide what to build, and then hold the
            bar while it ships,{" "}
            <Link className="tap" href="/contact">
              let’s talk
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
