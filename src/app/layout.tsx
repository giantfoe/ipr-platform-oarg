import type { Metadata } from "next";
import { WalletProvider } from '@/app/_providers/WalletProvider'
import { AuthProvider } from '@/app/_providers/AuthProvider'
import { Toaster } from '@/components/ui/toaster'
import "./globals.css"
import dynamic from 'next/dynamic'

// Dynamically import the Navbar component
const Navbar = dynamic(
  () => import('./_components/layout/navbar'),
  { ssr: false }
)

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
    <html lang="en">
      <body>
        <WalletProvider>
          <AuthProvider>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
            <Toaster />
          </AuthProvider>
        </WalletProvider>
      </body>
    </html>
  )
}