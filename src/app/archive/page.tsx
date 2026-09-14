import type { Metadata } from "next";

import { ArchiveWall } from "@/components/archive-wall";
import { PageMast } from "@/components/page-mast";

export const metadata: Metadata = {
  title: "Archive — Alex Purdie",
  description:
    "Twenty years of client marks, and what the work behind each one was. The Home Depot, ITV, Junior Achievement, the LEGO Foundation, TED, the BBC, the NHS.",
  alternates: { canonical: "/archive" },
};

/* Implemented from Figma: Portfolio Moodboard, 111:3227 ("Archive concept"). */
export default function ArchivePage() {
  return (
    <main id="main" className="archive-page">
      <PageMast />

      <h1 className="archive-title">Archive</h1>

      <ArchiveWall />
    </main>
  );
}
