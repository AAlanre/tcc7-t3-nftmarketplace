"use client";

import { useMemo, useState } from "react";
import type { NFTItem, ListingStatus } from "@/types/nft";
import { LotCard } from "@/components/lots/LotCard";
import { EmptyState } from "@/components/ui/EmptyState";

type FilterValue = "all" | ListingStatus;
type SortValue = "lot-asc" | "price-asc" | "price-desc";

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "listed", label: "Listed" },
  { value: "sold", label: "Sold" },
  { value: "unlisted", label: "Unlisted" },
];

const sorts: { value: SortValue; label: string }[] = [
  { value: "lot-asc", label: "Lot number" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function LotGrid({ lots }: { lots: NFTItem[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sort, setSort] = useState<SortValue>("lot-asc");

  const visibleLots = useMemo(() => {
    const filtered =
      filter === "all" ? lots : lots.filter((lot) => lot.status === filter);

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "lot-asc") {
  return Number(a.tokenId - b.tokenId);
}
     const priceA = Number(a.price ?? 0n);
const priceB = Number(b.price ?? 0n);

return sort === "price-asc"
  ? priceA - priceB
  : priceB - priceA;
    });

    return sorted;
  }, [lots, filter, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                filter === item.value
                  ? "border-blue bg-blue/10 text-blue-bright"
                  : "border-line text-muted hover:border-blue/40 hover:text-graphite"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 font-mono text-xs text-muted">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortValue)}
            className="rounded-sm border border-line bg-panel px-2 py-1.5 text-graphite focus:border-blue"
          >
            {sorts.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visibleLots.length === 0 ? (
        <EmptyState
          title="No lots match that filter"
          description="Try a different status filter, or check back once new lots are listed."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleLots.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>
      )}
    </div>
  );
}