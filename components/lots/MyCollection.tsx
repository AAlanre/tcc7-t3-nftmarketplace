"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LotCard } from "@/components/lots/LotCard";
import { ListingActions } from "@/components/lots/ListingAction";

import {
  listNFT,
  buyNFT,
  cancelListing,
  updateListingPrice,
} from "@/lib/marketplace";

import { useWallet } from "@/components/providers/Walletprovider";
import { EmptyState } from "@/components/ui/EmptyState";

import { getOwnedNFTs } from "@/lib/nft";
import type { NFTItem } from "@/types/nft";

export function MyCollection() {
  const { address, isConnected, connect, isConnecting } = useWallet();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

 async function loadNFTs() {
  if (!address) return;

  try {
    setLoading(true);

    const ownedNFTs = await getOwnedNFTs(address);

    setNfts(ownedNFTs);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  loadNFTs();
}, [address]);
  if (!isConnected || !address) {
    return (
      <EmptyState
        title="Connect your wallet"
        description="Connect your wallet to view the NFTs you own."
        action={
          <button
            type="button"
            onClick={() => connect()}
            disabled={isConnecting}
            className="inline-flex items-center rounded-full bg-blue px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-blue-bright disabled:opacity-60"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        }
      />
    );
  }

  if (loading) {
  return (
    <p className="text-center py-10">
      Loading your NFTs...
    </p>
  );
}

  

  if (nfts.length > 0) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {nfts.map((nft) => (
        <div
          key={nft.id}
          className="flex flex-col gap-4"
        >
          <LotCard lot={nft} />

          <ListingActions
            lot={nft}
            onList={async (lot, price) => {
  await listNFT(lot.tokenId, price);
  await loadNFTs();
}}
            onBuy={async (lot) => {
  await buyNFT(lot.tokenId, lot.price!);
  await loadNFTs();
}}
            onCancelListing={async (lot) => {
  await cancelListing(lot.tokenId);
  await loadNFTs();
}}
            onUpdatePrice={async (lot, price) => {
  await updateListingPrice(lot.tokenId, price);
  await loadNFTs();
}}
          />
        </div>
      ))}
    </div>
  );
}

return (
  <EmptyState
    title="My Collection"
    description="You don't own any NFTs yet."
    action={
      <Link
        href="/mint"
        className="inline-flex items-center rounded-full bg-blue px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-blue-bright"
      >
        Mint an NFT
      </Link>
    }
  />
);

}