import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { martinaPlantijn, metric } from "./fonts";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  /* Open Graph URLs resolve against this. Without it they resolve relative and
     break the moment the site is shared anywhere. */
  metadataBase: new URL("https://alexpurdie.co"),
  title: "Alex Purdie — Product designer and strategist",
  description:
    "Product designer and strategist leading teams that build platforms where digital systems meet real people doing real work.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Alex Purdie",
    locale: "en_US",
    url: "/",
    title: "Alex Purdie — Product designer and strategist",
    description:
      "Product designer and strategist leading teams that build platforms where digital systems meet real people doing real work.",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
  /* Without this the env(safe-area-inset-*) padding computes to zero. */
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${martinaPlantijn.variable} ${metric.variable}`}
    >
      <body>
        {/* First thing in the tab order, invisible until focused. */}
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
