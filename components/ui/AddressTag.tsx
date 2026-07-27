type AddressTagProps = {
  address: string;
  label?: string;
  className?: string;
};

function truncate(address: string) {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function AddressTag({ address, label, className = "" }: AddressTagProps) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 font-mono text-xs text-muted ${className}`}>
      {label ? <span className="uppercase tracking-wider text-[10px]">{label}</span> : null}
      <span className="text-graphite/80">{truncate(address)}</span>
    </span>
  );
}
