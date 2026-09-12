import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Todo } from "@/components/todo";

export const metadata = { title: "About — Alex Purdie" };

export default function About() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page">
        <section className="section measure">
          <h1 className="page-title">About.</h1>
          <p className="lede">
            <Todo>
              Timeline format: the career spine plus life, with the
              anti-positioning line.
            </Todo>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
