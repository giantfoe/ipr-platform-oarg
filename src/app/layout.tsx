import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(
      "h-full",
      geistSans.variable,
      geistMono.variable,
    )}>
      <body className="min-h-screen bg-background antialiased font-sans">
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Add your header/navigation component here */}
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t bg-background">
            {/* Add your footer component here */}
          </footer>
        </div>
      </body>
    </html>
  );
}