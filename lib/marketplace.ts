import { ethers } from "ethers";

import {
  getSimpleNftContract,
  getMarketplaceContract,
} from "./contract";

/**
 * Approve the marketplace to transfer an NFT.
 */
export async function approveNFT(tokenId: bigint) {
  const nftContract = await getSimpleNftContract();

  const marketplaceAddress =
    process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

  if (!marketplaceAddress) {
    throw new Error("Marketplace address is not configured.");
  }

  const tx = await nftContract.approve(
    marketplaceAddress,
    tokenId
  );

  await tx.wait();
}

/**
 * List an NFT for sale.
 */
export async function listNFT(
  tokenId: bigint,
  priceEth: number
) {
  await approveNFT(tokenId);

  const marketplace = await getMarketplaceContract();

  const nftAddress =
    process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS;

  if (!nftAddress) {
    throw new Error("NFT contract address is not configured.");
  }

  const tx = await marketplace.listItem(
    nftAddress,
    tokenId,
    ethers.parseEther(priceEth.toString())
  );

  await tx.wait();
}

/**
 * Buy a listed NFT.
 */
export async function buyNFT(
  tokenId: bigint,
  price: bigint
) {
  const marketplace = await getMarketplaceContract();

  const nftAddress =
    process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS;

  if (!nftAddress) {
    throw new Error("NFT contract address is not configured.");
  }

  const tx = await marketplace.buyItem(
    nftAddress,
    tokenId,
    {
      value: price,
    }
  );

  await tx.wait();
}

/**
 * Cancel an active listing.
 */
export async function cancelListing(
  tokenId: bigint
) {
  const marketplace = await getMarketplaceContract();

  const nftAddress =
    process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS;

  if (!nftAddress) {
    throw new Error("NFT contract address is not configured.");
  }

  const tx = await marketplace.cancelListing(
    nftAddress,
    tokenId
  );

  await tx.wait();
}

/**
 * Update listing price.
 */
export async function updateListingPrice(
  tokenId: bigint,
  newPriceEth: number
) {
  const marketplace = await getMarketplaceContract();

  const nftAddress =
    process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS;

  if (!nftAddress) {
    throw new Error("NFT contract address is not configured.");
  }

  const tx = await marketplace.updateListingPrice(
    nftAddress,
    tokenId,
    ethers.parseEther(newPriceEth.toString())
  );

  await tx.wait();
}