export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="self-start fw-bold text-5xl bg-clip-text text-transparent leading-tight bg-gradient-title">
        {title}
      </div>
      {subtitle && <div className="text-secondary text-xl">{subtitle}</div>}
    </div>
  );
}
