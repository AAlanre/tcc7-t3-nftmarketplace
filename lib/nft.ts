import { ethers } from "ethers";
import { getSimpleNftContract, getMarketplaceContract } from "./contract";
import type { NFTItem } from "@/types/nft";

export async function getNFT(tokenId: string): Promise<NFTItem | null> {
  try {
    const nftContract = await getSimpleNftContract();
    const marketplace = await getMarketplaceContract();

    // Owner
    const owner = await nftContract.ownerOf(tokenId);

    // Token URI
    const tokenURI = await nftContract.tokenURI(tokenId);
    console.log("Token URI:", tokenURI);

    // Marketplace listing
    const listing = await marketplace.getListing(
      process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS!,
      tokenId
    );

    // Metadata
    const metadataUrl = tokenURI.startsWith("ipfs://")
  ? tokenURI.replace(
      "ipfs://",
      "https://gateway.pinata.cloud/ipfs/"
    )
  : tokenURI;

const response = await fetch(metadataUrl);
const metadata = await response.json();
console.log("Metadata:", metadata);
console.log("Image URI:", metadata.image);

    return {
      id: tokenId,
      tokenId: BigInt(tokenId),

      title: metadata.name ?? `NFT #${tokenId}`,
      description: metadata.description ?? "",
      image:
  metadata.image?.startsWith("ipfs://")
    ? metadata.image.replace(
        "ipfs://",
        "https://gateway.pinata.cloud/ipfs/"
      )
    : metadata.image ?? "",

      owner,
      seller: listing.seller,

      price: listing.active ? listing.price : undefined,

      status: listing.active ? "listed" : "unlisted",

      tokenURI,

      contractAddress:
        process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS as `0x${string}`,

      mintedAt: undefined,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
   
}
 export async function getOwnedNFTs(owner: string): Promise<NFTItem[]> {
  const nftContract = await getSimpleNftContract();

  const totalMinted = await nftContract.totalMinted();

console.log("Total Minted:", Number(totalMinted));

const ownedNFTs: NFTItem[] = [];

for (let i = 0; i < Number(totalMinted); i++) {
  try {
    const tokenOwner = await nftContract.ownerOf(i);

    if (tokenOwner.toLowerCase() === owner.toLowerCase()) {
  console.log(`NFT #${i} belongs to ${owner}`);

  const nft = await getNFT(i.toString());

  if (nft) {
    ownedNFTs.push(nft);
  }
}
  } catch (error) {
    console.error(`Error checking NFT #${i}`, error);
  }
}

return ownedNFTs;
}
