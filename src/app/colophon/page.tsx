import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Todo } from "@/components/todo";

export const metadata = { title: "Colophon — Alex Purdie" };

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page">
        <section className="section measure">
          <h1 className="page-title">Colophon.</h1>
          <p>
            <Todo>This page is not written yet.</Todo>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
