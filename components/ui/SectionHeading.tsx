type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow ? (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-blue">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-medium text-graphite sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
  );
}