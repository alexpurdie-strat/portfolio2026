import type { Metadata } from "next";
import { Stage } from "@/components/stage";
import { SITE } from "@/content/site";
import { WORK } from "@/content/work";

export const metadata: Metadata = {
  title: SITE.meta.title,
  description: SITE.meta.description,
};

/* TODO(alex): three disciplines per project, as the frame shows them. */
const DISCIPLINES: Record<string, string[]> = {
  "ja-finance-park": ["Strategy", "Product", "Service design"],
  "itv-studios-portal": ["Systems", "Design systems", "Service design"],
};

export default function Home() {
  return (
    <>
      {/* No footer here. The board is fixed and covers the full viewport, so
          anything after it is unreachable — and neither frame has one. The
          footer stays on the interior pages. */}
      <Stage entries={WORK.map((w) => w.meta)} disciplines={DISCIPLINES} />
    </>
  );
}
