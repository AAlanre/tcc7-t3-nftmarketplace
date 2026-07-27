import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEther } from "ethers";

import { getNFT } from "@/lib/nft";
import { AddressTag } from "@/components/ui/AddressTag";
import { StatusChip } from "@/components/ui/StatusChip";
import { PriceTag } from "@/components/ui/PriceTag";
import { ListingActions } from "@/components/lots/ListingAction";

export default async function NFTDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lot = await getNFT(id);

  if (!lot) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-graphite"
      >
        ← Back to Catalogue
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* NFT Image */}
        <div className="reg-marks relative aspect-square w-full overflow-hidden rounded-sm border border-line bg-panel-deep">
          <Image
            src={lot.image}
            alt={lot.title}
            fill
            priority
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover"
          />

          <div className="absolute left-4 top-4 rounded-full border border-blue/40 bg-paper/80 px-3 py-1 font-mono text-xs uppercase tracking-wider text-blue-bright backdrop-blur-sm">
            Token #{lot.tokenId.toString()}
          </div>
        </div>

        {/* NFT Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <StatusChip status={lot.status} />

            <span className="font-mono text-xs text-muted">
              Token #{lot.tokenId.toString().padStart(4, "0")}
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-graphite">
            {lot.title}
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-muted">
            {lot.description}
          </p>

          <div className="mt-8">
           <PriceTag
  price={lot.price}
  size="lg"
/>
          </div>

          <div className="mt-6">
            <ListingActions lot={lot} />
          </div>

          {/* Provenance */}
          <div className="mt-12 border-t border-line pt-6">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-blue">
              Provenance
            </p>

            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  Contract
                </dt>

                <dd className="mt-1">
                  <AddressTag address={lot.contractAddress} />
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  Owner
                </dt>

                <dd className="mt-1">
                  <AddressTag address={lot.owner} />
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  Token ID
                </dt>

                <dd className="mt-1 font-mono text-xs text-graphite/80">
                  {lot.tokenId.toString()}
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  Minted
                </dt>

                <dd className="mt-1 font-mono text-xs text-graphite/80">
                  {lot.mintedAt
                    ? new Date(lot.mintedAt * 1000).toLocaleString()
                    : "Unknown"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}