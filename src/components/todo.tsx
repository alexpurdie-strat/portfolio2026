/*
 * A gap, kept in the source and off the page.
 *
 * The content rule is never to invent a fact, so where something is missing it
 * says so rather than reading as finished. But a gap is a note to the author,
 * not to a reader, and the site is being shown while it is still being
 * written.
 *
 * Nothing is deleted: every note stays in the .mdx, and `npm run check` still
 * counts them and refuses a production pass while any remain. Hidden is not
 * resolved, and the gate is what keeps the difference.
 *
 * Flip this to true to see them again while writing.
 */
export const TODOS_VISIBLE = false;

/*
 * Facts carry markers too — a `team` nobody has confirmed is stored as the
 * marker text itself, so that it cannot be mistaken for an answer. Anywhere a
 * fact is rendered has to ask this before printing it.
 */
export function isMarker(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("TODO(alex)");
}

export function Todo({
  children,
  section,
}: {
  children: React.ReactNode;
  /*
   * Set when a section has nothing in it but this note, so the heading goes
   * with it. A heading standing over nothing reads as a bug rather than as a
   * section still being written.
   */
  section?: string;
}) {
  if (!TODOS_VISIBLE) return null;
  const note = (
    <span className="todo" role="note">
      <span className="label todo__tag">TODO(alex)</span> {children}
    </span>
  );
  if (!section) return note;
  return (
    <>
      <h2>{section}</h2>
      {note}
    </>
  );
}
