ALTER TABLE ip_applications
ADD COLUMN nft_mint text,
ADD COLUMN nft_metadata_uri text;

-- Create index for NFT mint addresses
CREATE INDEX idx_ip_applications_nft_mint ON ip_applications(nft_mint); 