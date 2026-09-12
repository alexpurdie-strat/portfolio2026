/*
 * A visible gap.
 *
 * The content rule is never to invent a fact. Where something is missing, it
 * says so on the page in development and fails the build in production — which
 * is the only version of a TODO that cannot quietly ship.
 */
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span className="todo" role="note">
      <span className="label todo__tag">TODO(alex)</span> {children}
    </span>
  );
}
