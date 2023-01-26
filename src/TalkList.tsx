import Talk from './Talk';
import talks from './talks';
import Section from './Section';
import SectionTitle from './SectionTitle';

export default function Talks() {
  return (
    <Section id="talks">
      <SectionTitle
        title="Speaking engagements and videos"
        subtitle="All of my previous and planned future speaking experience"
      />
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] md:grid-cols-[3fr_auto_1fr_auto] lg:grid-cols-[1fr_auto_auto_auto] gap-y-1 gap-x-4">
        {talks.map((talk) => (
          <Talk key={`${talk.name}-${talk.date}`} talk={talk} />
        ))}
      </div>
    </Section>
  );
}
