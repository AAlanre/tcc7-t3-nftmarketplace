import { formatEther } from "ethers";
import Link from "next/link";
import { LotGrid } from "@/components/lots/lotGrid";
import type { NFTItem } from "@/types/nft";

const lots: NFTItem[] = [];

function marketStats(lots: NFTItem[]) {
  const listed = lots.filter((lot) => lot.status === "listed");
  const prices = listed
  .filter((lot) => lot.price !== undefined)
  .map((lot) => Number(formatEther(lot.price!)));

  const floor = prices.length ? Math.min(...prices) : 0;

  const volume = lots
  .filter((lot) => lot.status === "sold")
  .reduce(
    (sum, lot) => sum + (lot.price ? Number(formatEther(lot.price)) : 0),
    0
  );

  return {
    total: lots.length,
    listedCount: listed.length,
    floor,
    volume,
  };
}

export default function HomePage() {
  const stats = marketStats(lots);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line py-16 sm:py-24">
        <div className="blueprint-grid pointer-events-none absolute inset-0 -z-10" />

        <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue">
          NFT Marketplace
        </p>

        <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.1] text-graphite sm:text-6xl">
          An on-chain catalogue of authenticated lots.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
          Every piece here is minted, numbered, and sold through a fixed-price
          contract. Connect your wallet to mint, list, or collect NFTs.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/mint"
            className="inline-flex items-center rounded-full bg-blue px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-blue-bright"
          >
            Mint NFT
          </Link>

          <a
            href="#catalogue"
            className="inline-flex items-center rounded-full border border-line px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider text-graphite transition-colors hover:border-blue/50"
          >
            Browse Catalogue
          </a>
        </div>

        {/* Stats */}
        <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Total NFTs
            </dt>
            <dd className="mt-1 font-display text-2xl text-graphite">
              {stats.total}
            </dd>
          </div>

          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Listed
            </dt>
            <dd className="mt-1 font-display text-2xl text-graphite">
              {stats.listedCount}
            </dd>
          </div>

          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Floor Price
            </dt>
            <dd className="mt-1 font-display text-2xl text-blue-bright">
              Ξ {stats.floor.toFixed(2)}
            </dd>
          </div>

          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Volume
            </dt>
            <dd className="mt-1 font-display text-2xl text-blue-bright">
              Ξ {stats.volume.toFixed(2)}
            </dd>
          </div>
        </dl>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="py-16">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-2xl text-graphite">
            NFT Catalogue
          </h2>
        </div>

        <LotGrid lots={lots} />
      </section>
    </div>
  );
}