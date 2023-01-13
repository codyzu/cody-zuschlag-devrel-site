export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col mb-4">
      <div className="fw-bold text-5xl mb-4">{title}</div>
      {subtitle && <div className="text-gray text-xl">{subtitle}</div>}
    </div>
  );
}
