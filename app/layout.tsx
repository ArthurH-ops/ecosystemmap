import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vienna Startup Ecosystem Map',
  description:
    'Interaktive Karte und Netzwerk-Visualisierung des Wiener Startup-Ökosystems. Entdecke Startups, VCs, Inkubatoren und mehr.',
  keywords: [
    'Vienna',
    'Wien',
    'Startup',
    'Ecosystem',
    'Map',
    'Network',
    'VC',
    'Incubator',
    'Austria',
  ],
  authors: [{ name: 'Vienna Ecosystem' }],
  openGraph: {
    title: 'Vienna Startup Ecosystem Map',
    description:
      'Interaktive Visualisierung des Wiener Startup-Ökosystems',
    type: 'website',
    locale: 'de_AT',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
