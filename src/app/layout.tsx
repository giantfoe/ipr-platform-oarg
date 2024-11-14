import type { Metadata } from "next";
import { WalletProvider } from '@/app/_providers/WalletProvider'
import { AuthProvider } from '@/app/_providers/AuthProvider'
import { ThemeProvider } from '@/app/_providers/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { NavbarWrapper } from './_components/layout/NavbarWrapper'
import { AdminDetector } from './_components/AdminDetector'
import "./globals.css"

export const metadata: Metadata = {
  title: "IP Register - Modern IP Registration Platform",
  description: "Modern intellectual property registration platform for African market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="light">
          <WalletProvider>
            <AuthProvider>
              <NavbarWrapper />
              <main className="pt-16">
                {children}
              </main>
              <AdminDetector />
              <Toaster />
            </AuthProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}