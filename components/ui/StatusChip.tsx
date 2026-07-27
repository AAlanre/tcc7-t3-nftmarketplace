import type { ListingStatus } from "@/types/nft";

const statusConfig: Record<ListingStatus, { label: string; className: string }> = {
  listed: {
    label: "Listed",
    className: "border-blue/40 text-blue-bright bg-blue/10",
  },
  sold: {
    label: "Sold",
    className: "border-line text-muted bg-panel-deep",
  },
  unlisted: {
    label: "Not listed",
    className: "border-line text-muted bg-transparent",
  },
};

export function StatusChip({ status }: { status: ListingStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
}