import type { Metadata } from "next";
import { WalletProvider } from '@/app/_providers/WalletProvider'
import { AuthProvider } from '@/app/_providers/AuthProvider'
import { ThemeProvider } from '@/app/_providers/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { NavbarWrapper } from './_components/layout/NavbarWrapper'
import { AdminDetector } from './_components/AdminDetector'
import ClientOnly from '@/app/_components/ClientOnly'
import "./globals.css"
import { FirebaseProvider } from '@/lib/firebase/context'
import { ToastProvider } from "@/components/ui/toast"

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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <FirebaseProvider>
          <ThemeProvider>
            <WalletProvider>
              <AuthProvider>
                <ClientOnly>
                  <NavbarWrapper />
                  <main className="pt-16">
                    {children}
                  </main>
                  <AdminDetector />
                  <Toaster />
                </ClientOnly>
              </AuthProvider>
            </WalletProvider>
          </ThemeProvider>
        </FirebaseProvider>
        <ToastProvider />
      </body>
    </html>
  )
}