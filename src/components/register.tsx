import Link from "next/link";
import { MarginNote } from "@/components/margin-note";

/**
 * The Register: a shelf mark hanging beside a block of content. The site's
 * list primitive — anything enumerable uses this rather than bullets or cards.
 *
 * The mark is a reference, not a counter: it identifies the item wherever it
 * is cited, so it comes from the content rather than from list position.
 */
export function Register({
  mark,
  eyebrow,
  title,
  children,
  href,
  linkLabel = "View details",
  aside,
  note,
}: {
  /** shelf mark, e.g. 02.001 */
  mark: string;
  eyebrow?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  href?: string;
  linkLabel?: string;
  aside?: React.ReactNode;
  note?: string | null;
}) {
  return (
    <li className="register">
      <span className="register__num">{mark}</span>
      <div className="register__body">
        {eyebrow ? <p className="register__eyebrow">{eyebrow}</p> : null}
        <h2 className="register__title">{title}</h2>
        {children}
        {href ? (
          <Link className="register__more text-button" href={href}>
            {linkLabel}{" "}
            <span className="register__arrow" aria-hidden>
              →
            </span>
          </Link>
        ) : null}
      </div>
      {note ? (
        <MarginNote lane="grid" tilt={-2.4} nudge={-0.75}>
          {note}
        </MarginNote>
      ) : null}
      {aside ? <div className="register__aside">{aside}</div> : null}
    </li>
  );
}
