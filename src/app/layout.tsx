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
import { InlineScript } from "@/components/inline-script";
import { ModeSwitch } from "@/components/mode-switch";
import { PaperMotion } from "@/components/paper-motion";
import { ReaderShell } from "@/components/reader-shell";
import { MODE_SCRIPT, ModeProvider } from "@/lib/mode";
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
      /* The default the server emits; the inline script below overrides it
         before paint when a visitor has chosen otherwise. */
      data-mode="studio"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${martinaPlantijn.variable} ${blankWeirdos.variable} ${blankWeirdosAlt1.variable} ${blankWeirdosAlt2.variable} ${blankWeirdosAlt3.variable} ${cutiveMono.variable} h-full antialiased`}
    >
      <head>
        {/* Before first paint, so a returning visitor never sees a frame of
            the wrong machine. */}
        <InlineScript html={MODE_SCRIPT} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* First thing in the tab order, invisible until focused. The header
            nav is four links deep on every page. */}
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ModeProvider>
          <PaperFilters />
          <PaperMotion />
          {children}
          {/*
            After the content, not before, and the reason is the tab order.
            These are fixed-position overlays so DOM order does not affect
            where they appear — but rendered first, a keyboard user reached
            the machine's sound switch, crank and mode toggle before they
            reached the site's own navigation. Ambient hardware comes after
            the thing it is housing.

            Purely decorative and CSS-gated otherwise, so it renders in both
            modes and costs nothing in Studio. It holds no content and no
            image assets — all gradients — so there is nothing to lazy-load
            and nothing to pop in when the machine is switched on.
          */}
          <ReaderShell />
          <ModeSwitch />
        </ModeProvider>
        {/* dev-only; NODE_ENV is statically replaced, so it drops out of the
            production bundle entirely */}
        {process.env.NODE_ENV === "development" ? <AgentationToolbar /> : null}
      </body>
    </html>
  );
}
