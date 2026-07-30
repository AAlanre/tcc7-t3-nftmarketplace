export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base text-graphite">BLUEPRINT</p>
          <p className="mt-1 font-mono text-[11px] text-muted">
            An on-chain lot catalogue  built on SimpleNFT &amp; NFTMarketplace.
          </p>
        </div>
        <div className="flex gap-6 font-mono text-[11px] uppercase tracking-wider text-muted">
          <span>Contract Ξ 0x71C7…8976</span>
          <span>Testnet: Sepolia</span>
        </div>
      </div>
    </footer>
  );
}