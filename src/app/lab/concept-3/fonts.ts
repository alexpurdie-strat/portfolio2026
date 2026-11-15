import { Archivo, Familjen_Grotesk, Funnel_Display, Funnel_Sans, Martian_Mono } from "next/font/google";

/*
 * Concept 3 type. Chosen from Craftwork's catalogue by eye; Familjen Grotesk
 * was the pick for A and is OFL, so it loads from Google directly. B's
 * catalogue picks (CC Neuhaus Headline, Risset) are paid, so these are the
 * open-source faces closest to them in voice: Archivo on its width axis for
 * the condensed headline, Martian Mono for the source text.
 */
export const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
});

export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

export const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
});

/*
 * 3B's faces, replacing Martina Plantijn (whose files here are Klim test
 * fonts, not licensed for a public site). Funnel Display for the name and
 * titles; Funnel Sans, its text companion, for statements and the italic
 * run, since Display has no italic. Both OFL.
 */
export const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
});

export const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-funnel-sans",
});
