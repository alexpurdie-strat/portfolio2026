import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lab — concept 3",
  robots: { index: false, follow: false },
};

export default function Concept3() {
  return (
    <main
      id="main"
      style={{ padding: 40, fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}
    >
      <h1 style={{ fontSize: 16, margin: "0 0 16px" }}>Concept 3</h1>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>
          <Link href="/lab/concept-3/a/">A, the index</Link>: white, one grotesk,
          rows that invert and run their outcomes.
        </li>
        <li>
          <Link href="/lab/concept-3/b/">B, the source</Link>: black, condensed
          and mono, labels that decode from source.
        </li>
      </ul>
    </main>
  );
}
