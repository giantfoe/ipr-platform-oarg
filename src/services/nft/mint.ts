import { Metaplex, bundlrStorage, keypairIdentity } from "@metaplex-foundation/js"
import { Connection, PublicKey, Keypair } from "@solana/web3.js"

interface NFTMetadata {
  name: string
  symbol: string
  description: string
  image: string
  attributes: {
    trait_type: string
    value: string
  }[]
  properties: {
    files: {
      uri: string
      type: string
    }[]
  }
}

export async function generateIPRegistrationImage(applicationData: {
  title: string
  application_type: string
  id: string
}): Promise<string> {
  // For now, return a placeholder image URL
  // In production, you would generate a dynamic image
  return "https://your-api.com/generate-ip-certificate-image"
}

export async function mintIPRegistrationNFT(
  connection: Connection,
  walletAddress: string,
  applicationData: {
    id: string
    title: string
    description: string
    application_type: string
    regions: string[]
    created_at: string
  }
) {
  try {
    // Generate certificate image
    const imageUrl = await generateIPRegistrationImage(applicationData)

    // Initialize Metaplex with admin wallet
    const adminKeypair = Keypair.generate() // In production, use a secure admin wallet
    const metaplex = Metaplex.make(connection)
      .use(bundlrStorage())
      .use(keypairIdentity(adminKeypair))

    // Prepare metadata
    const metadata: NFTMetadata = {
      name: `IP Registration - ${applicationData.title}`,
      symbol: "IPR",
      description: `Official IP Registration Certificate for ${applicationData.title}`,
      image: imageUrl,
      attributes: [
        {
          trait_type: "Type",
          value: applicationData.application_type
        },
        {
          trait_type: "Regions",
          value: applicationData.regions.join(", ")
        },
        {
          trait_type: "Registration ID",
          value: applicationData.id
        },
        {
          trait_type: "Registration Date",
          value: new Date(applicationData.created_at).toISOString().split('T')[0]
        }
      ],
      properties: {
        files: [
          {
            uri: imageUrl,
            type: "image/png"
          }
        ]
      }
    }

    // Upload metadata
    const { uri } = await metaplex.nfts().uploadMetadata(metadata)

    // Create NFT
    const { nft } = await metaplex.nfts().create({
      uri,
      name: metadata.name,
      sellerFeeBasisPoints: 0, // No royalties
      tokenOwner: new PublicKey(walletAddress),
      updateAuthority: adminKeypair, // Admin retains update authority
      symbol: "IPR",
      isMutable: true, // Allow future updates if needed
      maxSupply: 1 // Non-fungible
    })

    return {
      mint: nft.address.toString(),
      metadataUri: uri,
      imageUrl
    }
  } catch (error) {
    console.error("Error minting NFT:", error)
    throw error
  }
} 