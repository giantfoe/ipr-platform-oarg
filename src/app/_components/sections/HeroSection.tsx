"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import WalletButton with no SSR
const WalletButton = dynamic(
  () => import("../WalletButton").then(mod => mod.WalletButton),
  { ssr: false }
);

export function HeroSection() {
  const { connected } = useWallet();
  const router = useRouter();
  const [showWalletButton, setShowWalletButton] = useState(false);

  const handleRegisterClick = () => {
    if (connected) {
      router.push('/dashboard');
    } else {
      setShowWalletButton(true);
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#0A2540] to-[#2A4E6E] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Secure Your Intellectual Property
          </h1>
          <p className="text-xl sm:text-2xl mb-12 text-gray-200">
            Register and protect your innovations with ease
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            {showWalletButton ? (
              <div className="flex flex-col items-center gap-4">
                <WalletButton />
                <p className="text-sm text-gray-300">
                  Connect your wallet to continue registration
                </p>
              </div>
            ) : (
              <button
                onClick={handleRegisterClick}
                className="btn-primary group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-white px-8 py-3 font-medium text-[#0A2540] transition duration-300 ease-out hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#0A2540] to-[#2A4E6E] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-10"></span>
                <span className="relative">START NOW</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 