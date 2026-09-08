import type { Metadata } from "next";
import { ArchivePage } from "@/components/archive-page";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Archive — Alexpurdie.co",
  description: "Selected work, filed and tagged.",
};

export default function Archive() {
  return (
    <>
      <SiteHeader />
      <ArchivePage />
    </>
  );
}
