import type { Metadata } from "next";

import "./file.css";

export const metadata: Metadata = {
  title: "Lab — the file",
  description: "Mobile variant, back to the surface it sits on.",
  robots: { index: false, follow: false },
};

/*
 * Stripped to the ground it stands on.
 *
 * The folders, the tabs, the handwriting and the contents are all gone from
 * here — and all of them are in git, through d2ebb55, if any of it is worth
 * pulling back. Figma 229:1828 is still the design of record.
 */
export default function FilePage() {
  return <div className="file" />;
}
