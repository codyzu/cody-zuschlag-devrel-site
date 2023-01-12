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
      {talks.map((talk) => (
        <Talk key={`${talk.name}-${talk.date}`} talk={talk} />
      ))}
    </Section>
  );
}
