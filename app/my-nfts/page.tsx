import { MyCollection } from "@/components/lots/MyCollection";

export default function MyNftsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue">
        Your Holdings
      </p>
      <h1 className="max-w-2xl font-display text-4xl font-medium text-graphite sm:text-5xl">
        My Collection
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Everything minted or purchased under your connected wallet, plus
        anything you currently have listed for sale.
      </p>

      <div className="mt-14">
        <MyCollection />
      </div>
    </div>
  );
}