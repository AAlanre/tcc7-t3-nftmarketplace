type PriceTagProps = {
  price?: bigint;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
};

export function PriceTag({ price, size = "md", className = "" }: PriceTagProps) {
  if (!price) {
    return (
      <span className={`font-mono text-muted ${sizeStyles[size]} ${className}`}>
        — not listed —
      </span>
    );
  }

  return (
    <span className={`font-mono text-blue-bright ${sizeStyles[size]} ${className}`}>
      Ξ {Number(price) / 1e18}
    </span>
  );
}