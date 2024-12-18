"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { truncateAddress } from "@/lib/utils";

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!connected) {
    return (
      <button
        onClick={() => setIsDropdownOpen(true)}
        className="rounded-md bg-gradient-to-r from-[#1B4B73] to-[#118A4E] px-6 py-2.5 text-[15px] font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16m-7 6h7" 
          />
        </svg>
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="rounded-md bg-white/90 backdrop-blur-sm px-6 py-2.5 text-[15px] font-semibold text-gray-900 shadow-lg hover:shadow-xl ring-1 ring-gray-200 hover:bg-white transition-all duration-300 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-green-500" />
        {truncateAddress(publicKey?.toBase58())}
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white/90 backdrop-blur-sm shadow-lg ring-1 ring-gray-200 py-1 z-50">
          <button
            onClick={() => {
              navigator.clipboard.writeText(publicKey?.toBase58() || '')
              setIsDropdownOpen(false)
            }}
            className="w-full px-4 py-2 text-left text-[15px] text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            Copy Address
          </button>
          <button
            onClick={() => {
              disconnect()
              setIsDropdownOpen(false)
            }}
            className="w-full px-4 py-2 text-left text-[15px] text-red-600 hover:bg-gray-50 transition-colors duration-150"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}