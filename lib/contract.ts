import { ethers } from "ethers";

import SimpleNFTABI from "../contracts/out/SimpleNft.sol/SimpleNFT.json";
import MarketplaceABI from "../contracts/out/NFTMarketplace.sol/NFTMarketplace.json";

/* -------------------------------------------------------------------------- */
/*                               READ PROVIDER                                */
/* -------------------------------------------------------------------------- */

function getRpcProvider() {
  const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

  if (!rpcUrl) {
    throw new Error("NEXT_PUBLIC_SEPOLIA_RPC_URL is not set");
  }

  return new ethers.JsonRpcProvider(rpcUrl);
}

/* -------------------------------------------------------------------------- */
/*                              WRITE PROVIDER                                */
/* -------------------------------------------------------------------------- */

async function getBrowserProvider() {
  if (typeof window === "undefined") {
    throw new Error("Must be used in the browser");
  }

  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = await getBrowserProvider();
  return provider.getSigner();
}

/* -------------------------------------------------------------------------- */
/*                           READ-ONLY CONTRACTS                              */
/* -------------------------------------------------------------------------- */

export function getReadOnlySimpleNftContract() {
  const provider = getRpcProvider();

  const address = process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS;

  if (!address) {
    throw new Error("NEXT_PUBLIC_SIMPLE_NFT_ADDRESS is not set");
  }

  return new ethers.Contract(
    address,
    SimpleNFTABI.abi,
    provider
  );
}

export function getReadOnlyMarketplaceContract() {
  const provider = getRpcProvider();

  const address = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

  if (!address) {
    throw new Error("NEXT_PUBLIC_MARKETPLACE_ADDRESS is not set");
  }

  return new ethers.Contract(
    address,
    MarketplaceABI.abi,
    provider
  );
}

/* -------------------------------------------------------------------------- */
/*                         WRITE (METAMASK) CONTRACTS                          */
/* -------------------------------------------------------------------------- */

export async function getSimpleNftContract() {
  const signer = await getSigner();

  const address = process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS;

  if (!address) {
    throw new Error("NEXT_PUBLIC_SIMPLE_NFT_ADDRESS is not set");
  }

  return new ethers.Contract(
    address,
    SimpleNFTABI.abi,
    signer
  );
}

export async function getMarketplaceContract() {
  const signer = await getSigner();

  const address = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

  if (!address) {
    throw new Error("NEXT_PUBLIC_MARKETPLACE_ADDRESS is not set");
  }

  return new ethers.Contract(
    address,
    MarketplaceABI.abi,
    signer
  );
}