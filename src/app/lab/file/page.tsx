import type { Metadata } from "next";

import { ExpandingFile } from "@/components/file/expanding-file";

import "./file.css";

export const metadata: Metadata = {
  title: "Lab — the file",
  description:
    "The mobile variant: the desk bundled up and filed away. Four sections, one piece of paper each.",
  robots: { index: false, follow: false },
};

/* Implemented from Figma: Portfolio Moodboard, 229:1828. */
export default function FilePage() {
  return <ExpandingFile />;
}
