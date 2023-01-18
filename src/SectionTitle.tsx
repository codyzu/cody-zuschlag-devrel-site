export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="fw-bold text-5xl">{title}</div>
      {subtitle && <div className="text-secondary text-xl">{subtitle}</div>}
    </div>
  );
}
