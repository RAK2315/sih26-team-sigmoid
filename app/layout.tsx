import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Cormorant_Garamond, IBM_Plex_Mono, IBM_Plex_Sans, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import OfflineBanner from "./offline-banner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const notoDeva = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600"],
  variable: "--font-noto-deva",
});

export const metadata: Metadata = {
  title: "VIRASAT",
  description: "Stand where it happened.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plexSans.variable} ${plexMono.variable} ${notoDeva.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-ink-faint/40 px-6">
          <Link href="/" className="font-display text-xl tracking-wide text-ink">
            VIRASAT
          </Link>
          <nav className="flex gap-6 text-sm text-ink-muted">
            <Link href="/vision" className="hover:text-madder">
              Why
            </Link>
            <Link href="/explore" className="hover:text-madder">
              Explore
            </Link>
            <Link href="/discover" className="hover:text-madder">
              Discover
            </Link>
            <Link href="/authority" className="hover:text-madder">
              Authority
            </Link>
          </nav>
        </header>
        <OfflineBanner />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
