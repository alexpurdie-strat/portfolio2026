/*
 * A visible gap — in development only.
 *
 * The content rule is never to invent a fact, so where something is missing it
 * says so rather than reading as finished. But a gap is a note to the author,
 * not to a recruiter, so it is shown while writing and rendered to nothing in
 * the build that ships.
 *
 * Nothing is deleted: the text stays in the source, and `npm run check` still
 * counts every one and refuses a production pass while any remain. Hidden is
 * not the same as resolved, and the gate is what keeps the difference.
 */
const SHOW = process.env.NODE_ENV !== "production";

export function Todo({
  children,
  section,
}: {
  children: React.ReactNode;
  /*
   * Set when a section has nothing in it but this note. The heading comes with
   * it, because a heading standing over nothing reads as a bug rather than as
   * a section still being written.
   */
  section?: string;
}) {
  if (!SHOW) return null;
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
