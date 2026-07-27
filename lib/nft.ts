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

    // Marketplace listing
    const listing = await marketplace.getListing(
      process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS!,
      tokenId
    );

    // Metadata
    const response = await fetch(tokenURI);
    const metadata = await response.json();

    return {
      id: tokenId,
      tokenId: BigInt(tokenId),

      title: metadata.name ?? `NFT #${tokenId}`,
      description: metadata.description ?? "",
      image: metadata.image ?? "",

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