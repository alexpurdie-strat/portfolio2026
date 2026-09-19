import type { Metadata } from "next";

import { DeskScene } from "@/components/desk/desk-scene";

import "./desk.css";

export const metadata: Metadata = {
  title: "Lab — the desk",
  description:
    "An experimental direction: a desk photographed from above, a cutting mat as the canvas within the canvas, and the work cut out and piled on it.",
  /* A spike, not a page. */
  robots: { index: false, follow: false },
};

/* Implemented from Figma: Portfolio Moodboard, 139:19882 and 166:20249. */
export default function LabPage() {
  return <DeskScene />;
}
