"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import dynamic from 'next/dynamic';
import { useEffect } from "react";

// Dynamically import the WalletMultiButton to prevent hydration errors
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

require('@solana/wallet-adapter-react-ui/styles.css');

export function WalletButton() {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      document.cookie = `wallet_address=${walletAddress}; path=/; max-age=604800; secure; samesite=strict`;
    } else {
      document.cookie = 'wallet_address=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
  }, [connected, publicKey]);

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButtonDynamic />
    </div>
  );
}