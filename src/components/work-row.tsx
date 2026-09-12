import Link from "next/link";
import type { WorkMeta } from "@/content/work";

/*
 * A work row — Figma 64:175.
 *
 * Image on columns 1–9, metadata on 10–12. The metadata column is a flex column
 * with the call to action pushed to the bottom, because in the frame "Learn
 * More" sits on the image's bottom edge rather than following the description.
 * That alignment is the whole reason the row reads as one object.
 */
export function WorkRow({
  meta,
  disciplines,
  children,
}: {
  meta: WorkMeta;
  /** Rendered as [LIKE] [THIS], per the frame. */
  disciplines: string[];
  /** Anything that belongs above the metadata — the statement, on row one. */
  children?: React.ReactNode;
}) {
  return (
    <article className="grid row">
      <Link className="row__media" href={`/work/${meta.slug}`} aria-hidden tabIndex={-1}>
        <span className="row__block" />
      </Link>

      <div className="row__meta">
        {children}
        <div className="row__body">
          <p className="row__disciplines ui">
            {disciplines.map((d) => `[${d.toUpperCase()}]`).join(" ")}
          </p>
          <h2 className="row__title">
            <Link href={`/work/${meta.slug}`}>{meta.title}</Link>
          </h2>
          <p className="row__summary">{meta.subtitle}</p>
        </div>
        <p className="row__cta ui">
          <Link href={`/work/${meta.slug}`}>
            Learn More <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </article>
  );
}
