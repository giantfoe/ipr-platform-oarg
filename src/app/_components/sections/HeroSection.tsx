"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { WalletButton } from "../WalletButton";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const { connected } = useWallet();
  const router = useRouter();
  const [showWalletButton, setShowWalletButton] = useState(false);

  const handleStartNowClick = () => {
    setShowWalletButton(true);
  };

  return (
    <div className="relative min-h-[600px] overflow-hidden">
      {/* Enhanced gradient background with Sierra Leone colors */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(27, 75, 115, 0.08) 0%,    /* OARG Blue */
              rgba(255, 255, 255, 0.95) 35%,  /* White */
              rgba(17, 138, 78, 0.08) 70%,    /* SL Green */
              rgba(27, 75, 115, 0.08) 100%    /* OARG Blue */
            ),
            radial-gradient(
              circle at top right,
              rgba(17, 138, 78, 0.12) 0%,     /* SL Green */
              transparent 50%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(27, 75, 115, 0.12) 0%,     /* OARG Blue */
              transparent 50%
            )
          `
        }}
      />

      {/* Decorative accent elements */}
      <div className="absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#118A4E]/20 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 w-96 h-96 translate-y-1/2 -translate-x-1/2">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1B4B73]/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center space-y-8">
          {/* OARG Logo */}
          <div className="flex justify-center">
            <Image
              src="/images/oarg-logo.png"
              alt="OARG Logo"
              width={180}
              height={180}
              className="mb-6"
              priority
            />
          </div>

          {/* Main Title with enhanced styling */}
          <div>
            <h1 className="text-[23px] sm:text-[31px] md:text-[39px] font-bold text-[#1B4B73]">
              Office of the Administrator and
              <span className="block mt-2 bg-gradient-to-r from-[#1B4B73] via-[#118A4E] to-[#1B4B73] bg-clip-text text-transparent">
                Registrar General
              </span>
            </h1>
            <p className="mt-6 text-[15px] text-gray-700 max-w-3xl mx-auto font-medium">
              Sierra Leone's Official Platform for Business and Intellectual Property Registration
            </p>
          </div>

          {/* Updated CTA Button */}
          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              href="/applications/new"
              className="rounded-md bg-gradient-to-r from-[#1B4B73] to-[#118A4E] px-8 py-3 text-[15px] font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start New Application
            </Link>
            <Link
              href="/about"
              className="rounded-md bg-white/90 backdrop-blur-sm px-8 py-3 text-[15px] font-semibold text-gray-900 shadow-lg hover:shadow-xl ring-1 ring-gray-200 hover:bg-white transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this to your global CSS file
const styles = `
@keyframes gradientFlow {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}
` 