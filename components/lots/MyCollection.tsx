"use client";

import Link from "next/link";
import { useWallet } from "@/components/providers/Walletprovider";
import { EmptyState } from "@/components/ui/EmptyState";

export function MyCollection() {
  const { address, isConnected, connect, isConnecting } = useWallet();

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

  return (
    <EmptyState
      title="My Collection"
      description="Your NFTs will appear here once we connect this page to the smart contract."
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