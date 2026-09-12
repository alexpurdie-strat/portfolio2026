import { CaseCard } from "@/components/case-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Todo } from "@/components/todo";
import { WORK } from "@/content/work";

export const metadata = { title: "Work — Alex Purdie" };

export default function WorkIndex() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page">
        <section className="section">
          <h1 className="page-title measure">Work.</h1>
          <div className="work__grid">
            {WORK.map((w) => (
              <CaseCard key={w.meta.slug} meta={w.meta} />
            ))}
          </div>
          <p className="work__more">
            <Todo>The library index — 12+ one-line entries with status icons.</Todo>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
