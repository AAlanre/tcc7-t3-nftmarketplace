"use client";

import { useState, type FormEvent } from "react";
import { useWallet } from "@/components/providers/Walletprovider";

type MintFormData = {
  title: string;
  description: string;
  metadataUri: string;
};

type MintFormProps = {
  mintPriceEth: number;
  onMint: (data: MintFormData) => Promise<void>;
};
export function MintForm({
  mintPriceEth,
  onMint,
}: MintFormProps) {
  const { isConnected, connect } = useWallet();
  const [status, setStatus] = useState<"idle" | "minting" | "success" | "error">(
    "idle"
  );
  const [form, setForm] = useState<MintFormData>({
  title: "",
  description: "",
  metadataUri: "",
});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConnected) {
      await connect();
      return;
    }

    setStatus("minting");
    try {
      await onMint(form);
      setStatus("success");
     setForm({
  title: "",
  description: "",
  metadataUri: "",
});
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-mono text-xs uppercase tracking-wider text-muted">
          Title
        </label>
        <input
          id="title"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Meridian Fracture"
          className="rounded-sm border border-line bg-panel px-4 py-3 text-graphite placeholder:text-muted/60 focus:border-blue"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-mono text-xs uppercase tracking-wider text-muted">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="A study in generative topology…"
          className="resize-none rounded-sm border border-line bg-panel px-4 py-3 text-graphite placeholder:text-muted/60 focus:border-blue"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="metadataUri" className="font-mono text-xs uppercase tracking-wider text-muted">
          Image URL (IPFS or HTTPS)
        </label>
        <input
          id="metadataUri"
          required
          type="url"
          value={form.metadataUri}
          onChange={(e) =>
  setForm((f) => ({
    ...f,
    metadataUri: e.target.value,
  }))
}
          placeholder="ipfs://…"
          className="rounded-sm border border-line bg-panel px-4 py-3 text-graphite placeholder:text-muted/60 focus:border-blue"
        />
      </div>

      <div className="flex items-center justify-between rounded-sm border border-line bg-panel px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">
          Mint Price
        </span>
        <span className="font-mono text-sm text-blue-bright">
          Ξ {mintPriceEth.toFixed(2)}
        </span>
      </div>

      <button
        type="submit"
        disabled={status === "minting"}
        className="inline-flex items-center justify-center rounded-full bg-blue px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-blue-bright disabled:opacity-60"
      >
        {!isConnected
          ? "Connect Wallet to Mint"
          : status === "minting"
          ? "Minting…"
          : "Mint Lot"}
      </button>

      {status === "success" ? (
        <p className="font-mono text-xs text-blue-bright">
          Minted. Your new lot will appear in “My Collection.”
        </p>
      ) : null}
      {status === "error" ? (
        <p className="font-mono text-xs text-danger">
          Mint failed. Check your wallet and try again.
        </p>
      ) : null}
    </form>
  );
}
