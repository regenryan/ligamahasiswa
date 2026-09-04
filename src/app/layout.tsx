import type { Metadata } from "next";
import {
  Archivo,
  Instrument_Sans,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });
const spaceMono = Space_Mono({ variable: "--font-space-mono", weight: ["400", "700"], subsets: ["latin"] });

const fontVars = [
  archivo.variable,
  instrument.variable,
  spaceMono.variable,
].join(" ");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Liga Mahasiswa Malaysia",
    template: "%s | Liga Mahasiswa Malaysia",
  },
  description:
    "The Malaysian student movement. Abolish AUKU, free the campus. Campaigns, stories, and the fight for student rights.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Liga Mahasiswa Malaysia",
    description:
      "The Malaysian student movement. Abolish AUKU, free the campus.",
    url: siteUrl,
    siteName: "Liga Mahasiswa Malaysia",
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liga Mahasiswa Malaysia",
    description:
      "The Malaysian student movement. Abolish AUKU, free the campus.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

import { AuthProvider } from "@/components/auth-provider";
import { AuthModalProvider } from "@/components/auth-modal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${fontVars}`}
    >
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border-2 focus:border-ink focus:bg-brand focus:px-4 focus:py-2 focus:text-[12px] focus:font-bold focus:uppercase focus:tracking-[0.1em] focus:text-paper"
        >
          Skip to content
        </a>
        <AuthProvider>
          <AuthModalProvider>
            {children}
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
