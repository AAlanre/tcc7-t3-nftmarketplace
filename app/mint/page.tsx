"use client";

import { useWallet } from "@/components/providers/Walletprovider";
import { MintForm } from "@/components/lots/MintForm";
import { getSimpleNftContract } from "@/lib/contract";
import { ethers } from "ethers";

type MintFormData = {
  title: string;
  description: string;
  metadataUri: string;
};

export default function MintPage() {
  const { address } = useWallet();

  async function handleMint(data: MintFormData) {

    const contract = await getSimpleNftContract();

   if (!address) {
  throw new Error("Wallet not connected");
}

   const tx = await contract.mint(
  address,
  data.metadataUri,
  {
    value: ethers.parseEther("0.01"),
  }
);

    await tx.wait();

    alert("NFT Minted Successfully!");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue">
        New Entry
      </p>

      <h1 className="max-w-2xl font-display text-4xl font-medium text-graphite sm:text-5xl">
        Mint a new lot
      </h1>

      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Minting writes a new token to the SimpleNFT contract and assigns it the
        next lot number in sequence. Once minted, you can list it for sale from
        your collection at any time.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
        <div className="rounded-sm border border-line bg-panel p-6 sm:p-8">
          <MintForm
            mintPriceEth={0.01}
            onMint={handleMint}
          />
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-sm border border-line p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Contract
            </p>

            <p className="mt-2 break-all font-mono text-xs text-graphite/80">
              {process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS}
            </p>
          </div>

          <div className="rounded-sm border border-line p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Network
            </p>

            <p className="mt-2 font-mono text-xs text-graphite/80">
              Sepolia Testnet
            </p>
          </div>

          <div className="rounded-sm border border-blue/30 bg-blue/5 p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-blue">
              Before you mint
            </p>

            <p className="mt-2 text-xs leading-relaxed text-muted">
              Make sure your image is already uploaded to IPFS or a stable host.
              The URL becomes part of the token&apos;s permanent metadata.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}