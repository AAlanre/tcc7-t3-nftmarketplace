"use client";

import { useWallet } from "@/components/providers/Walletprovider";

function truncate(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletConnectButton() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={disconnect}
        className="group inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 font-mono text-xs text-graphite transition-colors hover:border-blue/50"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-blue-bright" />
        {truncate(address)}
        <span className="hidden text-muted group-hover:inline">Disconnect</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => connect()}
      disabled={isConnecting}
      className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2 font-mono text-xs font-medium text-paper transition-colors hover:bg-blue-bright disabled:opacity-60"
    >
      {isConnecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
