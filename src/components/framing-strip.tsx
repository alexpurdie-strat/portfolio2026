import { Todo } from "@/components/todo";

/*
 * The opening of every case study.
 *
 * Phil Lee's move, and the strongest single pattern in the benchmark set: the
 * challenge as a question, the product in one sentence, then the facts. A
 * reader who stops here still knows what the problem was, what got built, and
 * what was mine.
 */
/* A fact can be missing. When it is, it has to read as missing rather than as
   a value that happens to start with the word TODO. */
function Value({ value }: { value: React.ReactNode }) {
  if (typeof value === "string" && value.startsWith("TODO(alex)")) {
    return <Todo>{value.replace(/^TODO\(alex\):\s*/, "")}</Todo>;
  }
  return <>{value}</>;
}

export function FramingStrip({
  challenge,
  product,
  facts,
}: {
  challenge: string;
  product: string;
  facts: { label: string; value: React.ReactNode }[];
}) {
  return (
    <section className="framing" aria-label="Project summary">
      <div className="framing__question measure">
        <h2 className="framing__challenge">{challenge}</h2>
        <p className="framing__product">{product}</p>
      </div>
      <dl className="framing__facts">
        {facts.map((f) => (
          <div key={f.label} className="framing__fact">
            <dt className="label">{f.label}</dt>
            <dd>
              <Value value={f.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
