import type { Metadata } from "next";
import Link from "next/link";
import { MarginNote } from "@/components/margin-note";
import { PageMasthead } from "@/components/page-masthead";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Not in the archive — Alexpurdie.co",
  description: "That page is not here.",
};

/**
 * A 404, in the archive's own terms: a reference that does not resolve. It
 * keeps the header and the shelf-mark eyebrow so it reads as part of the same
 * catalogue rather than as an error screen bolted on the side.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page">
        <PageMasthead
          eyebrow="00.000"
          title="Not in the archive."
          standfirst="That reference does not resolve — either it was never filed, or it has been filed somewhere else since."
        />

        <MarginNote tilt={-2.2} nudge={1.5} reach={2.5}>
          Everything worth keeping is in the archive. Try there.
        </MarginNote>

        <p className="page__lede">
          Nothing is lost. The archive is the index of everything that exists
          here, so it is the shortest way back to whatever you were after.
        </p>

        <p className="page__outro">
          <Link className="text-button" href="/archive">
            <span aria-hidden>←</span> Go to the archive
          </Link>
        </p>
      </main>
    </>
  );
}
