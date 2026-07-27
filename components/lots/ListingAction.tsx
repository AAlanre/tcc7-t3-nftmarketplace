"use client";

import { useState } from "react";
import type { NFTItem } from "@/types/nft";
import { useWallet } from "@/components/providers/Walletprovider";

type ListingActionsProps = {
  lot: NFTItem;

  /**
   * These will later call the NFTMarketplace contract.
   */
  onBuy?: (lot: NFTItem) => Promise<void>;

  onList?: (
    lot: NFTItem,
    priceEth: number
  ) => Promise<void>;

  onCancelListing?: (
    lot: NFTItem
  ) => Promise<void>;

  onUpdatePrice?: (
    lot: NFTItem,
    priceEth: number
  ) => Promise<void>;
};

const simulate = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 800));

export function ListingActions({
  lot,
  onBuy = async () => simulate(),
  onList = async () => simulate(),
  onCancelListing = async () => simulate(),
  onUpdatePrice = async () => simulate(),
}: ListingActionsProps) {
  const { address, isConnected, connect } = useWallet();

  const [pending, setPending] = useState(false);

  const [priceInput, setPriceInput] = useState(
    lot.price ? (Number(lot.price) / 1e18).toString() : ""
  );

  const [message, setMessage] = useState<string | null>(null);

  const isOwner =
    isConnected &&
    address?.toLowerCase() === lot.owner.toLowerCase();

  async function run(
    action: () => Promise<void>,
    successMessage: string
  ) {
    if (!isConnected) {
      await connect();
      return;
    }

    setPending(true);
    setMessage(null);

    try {
      await action();
      setMessage(successMessage);
    } catch (error) {
      console.error(error);
      setMessage("Transaction failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (lot.status === "sold") {
    return (
      <div className="rounded-sm border border-line bg-panel px-5 py-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          This lot has sold
        </p>
      </div>
    );
  }

  // Owner view
  if (isOwner) {
    if (lot.status === "listed") {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="w-full rounded-sm border border-line bg-panel px-4 py-3 font-mono text-sm text-graphite focus:border-blue"
            />

            <button
              type="button"
              disabled={pending || !priceInput}
              onClick={() =>
                run(
                  () =>
                    onUpdatePrice(
                      lot,
                      Number(priceInput)
                    ),
                  "Price updated."
                )
              }
              className="whitespace-nowrap rounded-sm border border-line px-4 py-3 font-mono text-xs uppercase tracking-wider text-graphite transition-colors hover:border-blue/50 disabled:opacity-60"
            >
              Update Price
            </button>
          </div>

          <button
            type="button"
            disabled={pending}
            onClick={() =>
              run(
                () => onCancelListing(lot),
                "Listing cancelled."
              )
            }
            className="rounded-full border border-danger/40 px-6 py-3 font-mono text-xs uppercase tracking-wider text-danger transition-colors hover:bg-danger/10 disabled:opacity-60"
          >
            {pending ? "Cancelling…" : "Cancel Listing"}
          </button>

          {message && (
            <p className="font-mono text-xs text-blue-bright">
              {message}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Price in ETH"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className="w-full rounded-sm border border-line bg-panel px-4 py-3 font-mono text-sm text-graphite placeholder:text-muted/60 focus:border-blue"
          />

          <button
            type="button"
            disabled={pending || !priceInput}
            onClick={() =>
              run(
                () =>
                  onList(
                    lot,
                    Number(priceInput)
                  ),
                "Lot listed for sale."
              )
            }
            className="whitespace-nowrap rounded-full bg-blue px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-blue-bright disabled:opacity-60"
          >
            {pending ? "Listing…" : "List for Sale"}
          </button>
        </div>

        {message && (
          <p className="font-mono text-xs text-blue-bright">
            {message}
          </p>
        )}
      </div>
    );
  }

  // Buyer view
  if (lot.status === "listed") {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(
              () => onBuy(lot),
              "Purchase complete."
            )
          }
          className="inline-flex items-center justify-center rounded-full bg-blue px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-blue-bright disabled:opacity-60"
        >
          {!isConnected
            ? "Connect Wallet to Buy"
            : pending
            ? "Processing…"
            : `Buy Now — Ξ ${
                lot.price ? Number(lot.price) / 1e18 : 0
              }`}
        </button>

        {message && (
          <p className="font-mono text-xs text-blue-bright">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-line bg-panel px-5 py-4">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">
        Not currently listed for sale
      </p>
    </div>
  );
}