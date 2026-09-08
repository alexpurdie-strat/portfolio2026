import type { Metadata } from "next";
import { MarginNote } from "@/components/margin-note";
import { PageMasthead } from "@/components/page-masthead";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Ask — Alexpurdie.co",
  description: "Get in touch.",
};

export default function Ask() {
  return (
    <>
      <SiteHeader leak />
      <main id="main" className="page">
        <PageMasthead eyebrow="Connection point" title="Ask." />

        <p className="page__lede">
          Happiest talking about work that is stuck rather than work that is
          finished. If you have a process nobody can explain any more, or a team
          that has outgrown the way it grows, that is the interesting end.
        </p>

        <MarginNote tilt={-1.8} nudge={0.5} reach={2.5}>
          Best conversations start with something that isn’t working yet.
        </MarginNote>

        <ul className="facts">
          <li className="facts__row">
            <span className="facts__what">
              <a className="text-button" href="mailto:hello@alexpurdie.co">
                hello@alexpurdie.co
              </a>
            </span>
            <span className="facts__meta">Email — placeholder</span>
          </li>
          <li className="facts__row">
            <span className="facts__what">
              <a className="text-button" href="#">
                LinkedIn
              </a>
            </span>
            <span className="facts__meta">Placeholder</span>
          </li>
          <li className="facts__row">
            <span className="facts__what">London, UK</span>
            <span className="facts__meta">GMT / BST</span>
          </li>
        </ul>
      </main>
    </>
  );
}
