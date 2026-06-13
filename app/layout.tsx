import type { Metadata } from "next";
import { Sofia_Sans } from "next/font/google";
import "./globals.css";
import { GlobalHeader } from "./components/GlobalHeader";

const sofiaSans = Sofia_Sans({
  variable: "--font-sofia-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FeedLoop Dashboard",
  description: "B2B SaaS platform providing a lightweight, privacy-focused feedback widget.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sofiaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-putty text-ink font-sans pt-32">
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}
