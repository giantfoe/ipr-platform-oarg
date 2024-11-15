import { createClient } from '@/utils/supabase/client'
import { mintIPRegistrationNFT } from './mint'
import { Connection } from '@solana/web3.js'
import { toast } from '@/components/ui/use-toast'

export async function handleApplicationApproval(
  applicationId: string,
  connection: Connection
) {
  const supabase = createClient()

  try {
    // Get application details with profile info
    const { data: application, error } = await supabase
      .from('ip_applications')
      .select(`
        *,
        profiles (
          full_name,
          wallet_address
        )
      `)
      .eq('id', applicationId)
      .single()

    if (error) throw error

    // Only proceed if status is approved and no NFT exists yet
    if (application.status !== 'approved' || application.nft_mint) {
      return
    }

    // Mint NFT
    const nftData = await mintIPRegistrationNFT(
      connection,
      application.wallet_address,
      application
    )

    // Store NFT data in database
    const { error: updateError } = await supabase
      .from('ip_applications')
      .update({
        nft_mint: nftData.mint,
        nft_metadata_uri: nftData.metadataUri,
        nft_image_url: nftData.imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)

    if (updateError) throw updateError

    // Show success message
    toast({
      title: "NFT Minted Successfully",
      description: `IP Registration Certificate NFT has been minted to ${application.profiles.full_name}'s wallet.`,
    })

    return nftData
  } catch (error) {
    console.error("Error handling application approval:", error)
    toast({
      title: "Error Minting NFT",
      description: "There was an error minting the NFT. Please try again.",
      variant: "destructive",
    })
    throw error
  }
} 