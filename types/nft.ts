export type ListingStatus = "listed" | "sold" | "unlisted";

export interface NFTItem {
  id: string;
  tokenId: bigint;

  title: string;
  description: string;
  image: string;

  owner: `0x${string}`;
  seller?: `0x${string}`;

  price?: bigint;

  status: ListingStatus;

  tokenURI: string;

  contractAddress: `0x${string}`;

  mintedAt?: number;
}