import type { Metadata, Viewport } from "next";
import { Cutive_Mono, Geist, Geist_Mono } from "next/font/google";
import {
  blankWeirdos,
  blankWeirdosAlt1,
  blankWeirdosAlt2,
  blankWeirdosAlt3,
  martinaPlantijn,
} from "./fonts";
import { AgentationToolbar } from "@/components/agentation-toolbar";
import { PaperFilters } from "@/components/paper-filters";
import { PaperMotion } from "@/components/paper-motion";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Typewriter face for the archive's front-matter tag blocks. */
const cutiveMono = Cutive_Mono({
  variable: "--font-cutive-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alexpurdie.co",
  description: "Portfolio of Alex Purdie.",
};

/* Separate from `metadata` on purpose: this Next version rejects themeColor
   there and warns on every route. */
export const viewport: Viewport = {
  /* the ground, so the browser chrome does not fight the paper */
  themeColor: "#faf7ef",
  /* Without this the `env(safe-area-inset-*)` padding in globals.css computes
     to zero and the notch work does nothing at all. */
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${martinaPlantijn.variable} ${blankWeirdos.variable} ${blankWeirdosAlt1.variable} ${blankWeirdosAlt2.variable} ${blankWeirdosAlt3.variable} ${cutiveMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* First thing in the tab order, invisible until focused. The header
            nav is four links deep on every page. */}
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <PaperFilters />
        <PaperMotion />
        {children}
        {/* dev-only; NODE_ENV is statically replaced, so it drops out of the
            production bundle entirely */}
        {process.env.NODE_ENV === "development" ? <AgentationToolbar /> : null}
      </body>
    </html>
  );
}
