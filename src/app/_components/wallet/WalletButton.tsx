 "use client"

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState } from "react"

export function WalletButton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <button className="!bg-[#635BFF] hover:!bg-[#0A2540] !transition-colors !rounded-full !text-sm !font-medium px-8 py-2">
      Connect Wallet
    </button>
  }

  return <WalletMultiButton className="!bg-[#635BFF] hover:!bg-[#0A2540] !transition-colors !rounded-full !text-sm !font-medium" />
}