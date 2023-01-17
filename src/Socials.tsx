import {Link} from './Link';
import Section from './Section';
import SectionTitle from './SectionTitle';

export default function Socials() {
  return (
    <Section>
      <SectionTitle
        title="Socials"
        subtitle="Reach out to me at these places"
      />
      <div className="gy-2 flex flex-col sm:flex-row gap-x-8 flex-wrap font-medium text-3xl">
        <Link icon="i-lucide-twitter" url="https://twitter.com/codyzus">
          @codyzus
        </Link>
        <Link icon="i-lucide-github" url="https://github.com/codyzu">
          @codyzu
        </Link>
        <Link
          icon="i-lucide-linkedin"
          url="https://www.linkedin.com/in/cody-zuschlag"
        >
          LinkedIn
        </Link>
        <Link icon="i-mingcute-medium-line" url="https://medium.com/@codyzus">
          Medium
        </Link>
        <Link
          icon="i-lucide-newspaper"
          url="https://www.nearform.com/author/cody-zuschlag/"
        >
          Blog
        </Link>
      </div>
    </Section>
  );
}
