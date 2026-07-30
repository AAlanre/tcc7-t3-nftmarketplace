"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useWallet } from "@/components/providers/Walletprovider";
import { EmptyState } from "@/components/ui/EmptyState";

import { getOwnedNFTs } from "@/lib/nft";
import type { NFTItem } from "@/types/nft";

export function MyCollection() {
  const { address, isConnected, connect, isConnecting } = useWallet();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  async function loadNFTs() {
    if (!address) return;

    try {
      setLoading(true);

      const ownedNFTs = await getOwnedNFTs(address);

      console.log("Owned NFTs:", ownedNFTs);

      setNfts(ownedNFTs);
    } catch (error) {
      console.error("Failed to load NFTs:", error);
    } finally {
      setLoading(false);
    }
  }

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

  if (loading) {
  return <p>Loading NFTs...</p>;
}

  if (nfts.length > 0) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <div
          key={nft.id}
          className="rounded border border-line p-4"
        >
          <img
            src={nft.image}
            alt={nft.title}
            className="w-full h-64 object-cover rounded"
          />

          <h3 className="mt-4 font-semibold">
            {nft.title}
          </h3>

          <p className="text-sm text-muted">
            {nft.description}
          </p>
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
  if (nfts.length > 0) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <div
          key={nft.id}
          className="rounded border border-line p-4"
        >
          <img
            src={nft.image}
            alt={nft.title}
            className="w-full h-64 object-cover rounded"
          />

          <h3 className="mt-4 font-semibold">
            {nft.title}
          </h3>

          <p>{nft.description}</p>
        </div>
      ))}
    </div>
  );
}

}