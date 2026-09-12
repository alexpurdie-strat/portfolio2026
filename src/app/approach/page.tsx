import { SiteFooter } from "@/components/site-footer";
import { Todo } from "@/components/todo";

export const metadata = { title: "Approach — Alex Purdie" };

export default function Approach() {
  return (
    <>
      <main id="main" className="page">
        <section className="section measure">
          <h1 className="page-title">Approach.</h1>
          <p>
            <Todo>
              The triple diamond, and how the work actually runs. Not written yet.
            </Todo>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
