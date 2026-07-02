import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import Link from "next/link";
import { ENV, PREVIEW_MODE } from "@/lib/env";
import { WalletButton } from "@/components/WalletButton";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex", display: "swap" });

export const metadata: Metadata = {
  title: "Orbital Registry - entities settle into stable orbits on confirmation",
  description: "A precise orbital registry on GenLayer. Register a designation with a source; a validator set reads it and the object settles into a stable orbit, returns to draft, or holds.",
};
export const viewport: Viewport = { themeColor: "#050A16", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${inter.variable} ${plex.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Providers>
          <header className="sticky top-0 z-40 border-b border-starlight/10 bg-space/85 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top)" }}>
            <div className="mx-auto flex max-w-wide items-center gap-4 px-4 py-3 sm:px-5 md:px-8">
              <Link href="/" className="font-head text-lg font-semibold text-starlight">Orbital Registry</Link>
              <nav className="ml-auto hidden items-center gap-4 text-sm sm:flex" aria-label="Primary">
                <Link href="/app" className="hover:text-cyan">Register</Link><Link href="/registry" className="hover:text-cyan">Registry</Link><Link href="/system" className="hover:text-cyan">System</Link>
              </nav>
              <WalletButton />
            </div>
          </header>
          <main id="main">{children}</main>
          <footer className="mx-auto max-w-wide px-4 py-8 sm:px-5 md:px-8">
            <div className="flex flex-col gap-1 border-t border-starlight/10 pt-5 text-sm text-muted md:flex-row md:justify-between">
              <span className="font-head font-semibold text-starlight">Orbital Registry <span className="label ml-1">GL-011</span></span>
              <span className="mono flex flex-wrap gap-x-4">{ENV.network} · {PREVIEW_MODE ? "no contract" : ENV.contractAddress} · <a href="https://docs.genlayer.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan">Built on GenLayer</a></span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
