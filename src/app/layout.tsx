import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientProviders } from "./_components/providers/ClientProviders";
import { Navbar } from "./_components/layout/navbar";
import { Footer } from "./_components/layout/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "IP Register - Modern IP Registration Platform",
  description: "Modern intellectual property registration platform for African market",
  keywords: "IP registration, trademark, patent, copyright, ARIPO, Africa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(
      "h-full scroll-smooth antialiased",
      geistSans.variable,
      geistMono.variable
    )}>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <ClientProviders>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}