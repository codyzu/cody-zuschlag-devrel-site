export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col mb-3">
      <div>
        <h1 className="display-5 fw-bold lh-1">{title}</h1>
      </div>
      {subtitle && <div className="lead">{subtitle}</div>}
    </div>
  );
}
