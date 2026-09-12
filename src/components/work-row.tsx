import Link from "next/link";
import type { WorkMeta } from "@/content/work";

/*
 * A work row — Figma 64:175 and the isolated details component, 70:247.
 *
 * Image on columns 1–9, details on 10–12. The details are bottom-aligned to the
 * image rather than top-aligned: in the frame the block starts at y=423 against
 * an image that starts at 101, and "Learn More" lands exactly on the image's
 * bottom edge. That alignment is what keeps the details clear of the persistent
 * statement above them.
 */
export function WorkRow({
  meta,
  disciplines,
  lead = false,
}: {
  meta: WorkMeta;
  disciplines: string[];
  /** The first row, whose image grows out of the load-in state. */
  lead?: boolean;
}) {
  return (
    <article className="grid row" data-lead={lead || undefined}>
      <Link className="row__media" href={`/work/${meta.slug}`} tabIndex={-1} aria-hidden>
        <span className="row__block" />
      </Link>

      <div className="row__meta">
        <div className="row__details">
          <p className="row__disciplines ui">
            {disciplines.map((d) => `[${d.toUpperCase()}]`).join(" ")}
          </p>
          <h2 className="row__title">
            <Link href={`/work/${meta.slug}`}>{meta.title}</Link>
          </h2>
          <p className="row__summary">{meta.subtitle}</p>
          <p className="row__cta ui">
            <Link href={`/work/${meta.slug}`}>
              Learn More <span aria-hidden>→</span>
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
