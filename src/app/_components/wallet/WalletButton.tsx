"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { createClient } from "@/utils/supabase/client";

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    async function handleWalletConnection() {
      if (connected && publicKey) {
        const walletAddress = publicKey.toBase58();
        
        // Set wallet address in cookie
        document.cookie = `wallet_address=${walletAddress}; path=/; max-age=604800; secure; samesite=strict`;
        
        // Check if user profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single();

        const redirect = searchParams.get('redirect');
        
        if (!profile) {
          // New user - redirect to profile completion
          router.push('/onboarding');
        } else if (redirect) {
          // Existing user with redirect
          router.push(redirect);
        } else {
          // Existing user - redirect to dashboard
          router.push('/dashboard');
        }
      } else {
        // Clear cookie when wallet disconnects
        document.cookie = 'wallet_address=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
    }

    handleWalletConnection();
  }, [connected, publicKey, router, searchParams, supabase]);

  return <WalletMultiButton className="wallet-adapter-button" />;
} 