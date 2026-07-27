import Image from "next/image";
import Link from "next/link";

import type { NFTItem } from "@/types/nft";
import { PriceTag } from "@/components/ui/PriceTag";
import { StatusChip } from "@/components/ui/StatusChip";

export function LotCard({ lot }: { lot: NFTItem }) {
  return (
    <Link
      href={`/nft/${lot.id}`}
      className="lot-card-hover group relative flex flex-col overflow-hidden rounded-sm border border-line bg-panel"
    >
      {/* NFT Image */}
      <div className="reg-marks relative aspect-square w-full overflow-hidden bg-panel-deep">
        <Image
          src={lot.image}
          alt={lot.title}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute left-3 top-3 rounded-full border border-blue/40 bg-paper/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-blue-bright backdrop-blur-sm">
          NFT #{lot.tokenId.toString()}
        </div>

        <div className="absolute right-3 top-3">
          <StatusChip status={lot.status} />
        </div>
      </div>

      {/* Perforated ticket seam */}
      <div className="ticket-seam mx-4">
        <span className="ticket-notch ticket-notch-left" />
        <span className="ticket-notch ticket-notch-right" />
      </div>

      {/* NFT Details */}
      <div className="flex flex-col gap-2 px-4 py-4">
        <h3 className="font-display text-lg leading-snug text-graphite">
          {lot.title}
        </h3>

        <p className="line-clamp-2 text-sm text-muted">
          {lot.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <PriceTag price={lot.price} />

          <span className="font-mono text-xs text-muted">
            #{lot.tokenId.toString().padStart(4, "0")}
          </span>
        </div>
      </div>
    </Link>
  );
}