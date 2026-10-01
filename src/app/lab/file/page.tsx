import type { Metadata } from "next";

import { asset } from "@/lib/asset";

import "./file.css";

export const metadata: Metadata = {
  title: "Lab — the file",
  description: "Mobile variant: a manila folder on the table.",
  robots: { index: false, follow: false },
};

/*
 * The folder is the photograph, at its own ratio.
 *
 * It was drawn three times before this — plastic, then brushed metal, then a
 * decent likeness — and every pass cost more than using the picture would
 * have. 499 x 356 in the original, cropped to its own bounds, white ground
 * keyed out, 12KB.
 */
export default function FilePage() {
  return (
    <div className="file">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        aria-hidden
        className="file__folder"
        src={asset("/file/folder-manila.webp")}
        width={998}
        height={712}
      />
    </div>
  );
}
