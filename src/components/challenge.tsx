/*
 * The brief a stream of work was given, set apart from the telling of it.
 *
 * Borrowed from the old Studios Portal and Home Depot pages, where each stream
 * opened with its own framing before any narrative. On a case study covering
 * three unrelated streams it does the job a single framing strip cannot: it
 * says what this particular piece was asked to do, so the reader is never
 * guessing which problem a paragraph belongs to.
 */
export function Challenge({ children }: { children: React.ReactNode }) {
  return (
    <div className="challenge">
      <p className="label challenge__label">The brief</p>
      <p className="challenge__text">{children}</p>
    </div>
  );
}
