import type { Metadata } from "next";
import { Stage } from "@/components/stage";
import { SITE } from "@/content/site";
import { isMarker, TODOS_VISIBLE } from "@/components/todo";
import { WORK } from "@/content/work";

export const metadata: Metadata = {
  title: SITE.meta.title,
  description: SITE.meta.description,
};

/* TODO(alex): confirm three disciplines per project, as the frame shows them. */
const DISCIPLINES: Record<string, string[]> = {
  "ja-finance-park": ["Strategy", "Product", "Service design"],
  "itv-studios-portal": ["Systems", "Design systems", "Governance"],
  "your-move": ["Strategy", "Prototyping", "Research"],
  "100-shapes": ["Leadership", "Practice", "Hiring"],
  "home-depot": ["Enterprise", "Service design", "Research"],
};

export default function Home() {
  return (
    <>
      {/* No footer here. The board is fixed and covers the full viewport, so
          anything after it is unreachable — and neither frame has one. The
          footer stays on the interior pages. */}
      <Stage
        entries={WORK.map((w) =>
          /* Stage is a client component, so anything handed to it is
             serialized into the HTML whether or not it is rendered. A marker
             the page never shows still ships in the payload. */
          TODOS_VISIBLE
            ? w.meta
            : Object.fromEntries(
                Object.entries(w.meta).filter(([, v]) => !isMarker(v)),
              ) as typeof w.meta,
        )}
        disciplines={DISCIPLINES}
      />
    </>
  );
}
