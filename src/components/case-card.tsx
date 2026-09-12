import Link from "next/link";
import type { WorkMeta } from "@/content/work";

/*
 * A featured case study on the index.
 *
 * Subtitle is verb-plus-outcome, so a reader who only scans the cards still
 * collects four outcomes rather than four project names.
 */
export function CaseCard({ meta }: { meta: WorkMeta }) {
  return (
    <article className="case-card">
      <p className="label">
        {meta.client} · {meta.years}
      </p>
      <h3 className="case-card__title">
        <Link className="case-card__link" href={`/work/${meta.slug}`}>
          {meta.title}
        </Link>
      </h3>
      <p className="case-card__subtitle">{meta.subtitle}</p>
    </article>
  );
}
