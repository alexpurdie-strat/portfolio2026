import type { Metadata } from "next";
import { DesignSystem } from "@/components/design-system";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Design system — Alexpurdie.co",
  description: "Style, intent and the rules the site is built on.",
};

export default function DesignSystemPage() {
  return (
    <>
      <SiteHeader />
      <DesignSystem />
    </>
  );
}
