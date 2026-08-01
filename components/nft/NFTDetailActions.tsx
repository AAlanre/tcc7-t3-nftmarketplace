"use client";

import { ListingActions } from "@/components/lots/ListingAction";

import {
  listNFT,
  buyNFT,
  cancelListing,
  updateListingPrice,
} from "@/lib/marketplace";

import type { NFTItem } from "@/types/nft";

export function NFTDetailActions({
  lot,
}: {
  lot: NFTItem;
}) {
  return (
    <ListingActions
      lot={lot}
      onList={(lot, price) =>
        listNFT(lot.tokenId, price)
      }
      onBuy={(lot) =>
        buyNFT(lot.tokenId, lot.price!)
      }
      onCancelListing={(lot) =>
        cancelListing(lot.tokenId)
      }
      onUpdatePrice={(lot, price) =>
        updateListingPrice(
          lot.tokenId,
          price
        )
      }
    />
  );
}