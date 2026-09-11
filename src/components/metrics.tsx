/*
 * Outcomes, set as outcomes.
 *
 * These were a bulleted list, which is how the strongest facts on a case study
 * end up reading like a changelog. A staff-level reader scans for scale first,
 * so scale gets display type and the explanation gets the small print — the
 * opposite of how a paragraph would weight them.
 */
export function Metrics({
  items,
}: {
  items: { value: string; of: string }[];
}) {
  return (
    <dl className="metrics">
      {items.map((m) => (
        <div key={m.of} className="metric">
          <dt className="metric__value">{m.value}</dt>
          <dd className="metric__of">{m.of}</dd>
        </div>
      ))}
    </dl>
  );
}
