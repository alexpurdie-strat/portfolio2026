import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Todo } from "@/components/todo";
import { PRINCIPLES, PRINCIPLES_INTRO } from "@/content/principles";

export const metadata: Metadata = {
  title: "Principles — Alex Purdie",
  description:
    "Named ideas I use with teams and clients, each linked to the work that proves it.",
};

export default function Principles() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page">
        <section className="section">
          <h1 className="page-title measure">{PRINCIPLES_INTRO.title}</h1>
          <p className="lede measure">{PRINCIPLES_INTRO.lede}</p>

          <ol className="principles">
            {PRINCIPLES.map((p, i) => (
              <li key={p.name} className="principle">
                <p className="label principle__num">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="principle__text">
                  <h2 className="principle__name">{p.name}</h2>
                  <p className="principle__body">{p.body}</p>
                  {p.proof ? (
                    <p className="principle__proof">
                      <Link className="tap" href={p.proof.href}>
                        {p.proof.label} <span aria-hidden>→</span>
                      </Link>
                    </p>
                  ) : (
                    <p className="principle__proof">
                      <Todo>
                        Needs its proof — the case study or essay that
                        demonstrates this.
                      </Todo>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
