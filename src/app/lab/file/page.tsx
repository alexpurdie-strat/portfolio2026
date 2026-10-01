import type { Metadata } from "next";

import { Folder } from "@/components/file/folder";

import "./file.css";

export const metadata: Metadata = {
  title: "Lab — the file",
  description: "Mobile variant: a manila folder that opens.",
  robots: { index: false, follow: false },
};

/* Implemented from Figma: Portfolio Moodboard, 229:1828. */
export default function FilePage() {
  return (
    <div className="file">
      <Folder />
    </div>
  );
}
