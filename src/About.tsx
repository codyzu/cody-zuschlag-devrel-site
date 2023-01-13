import logo from './images/logo_white.svg';
import {Link} from './Link';
import Section from './Section';
import SectionTitle from './SectionTitle';

export default function About() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="mb-12 lg:mb-0 px-0 lg:px-3">
          <div className="aspect-video w-full min-h-0 flex flex-col items-center max-h-[400px]">
            <img
              src={logo}
              className="block lg:mx-auto rounded max-w-full h-auto object-cover h-full"
              alt="Bootstrap Themes"
              loading="lazy"
            />
          </div>
        </div>
        <div className="self-start lg:-order-1 flex flex-col">
          <SectionTitle title="About me" />
          <div className="mb-4 text-2xl">International Speaker</div>
          <div className="mb-4 text-2xl">
            Developer Relations Engineer @{' '}
            <Link url="https://nearform.com">NearForm</Link>
          </div>
          <div className="mb-4 text-2xl">
            University Instructor @{' '}
            <Link url="https://www.iut-acy.univ-smb.fr/">IUT Annecy</Link> &amp;{' '}
            <Link url="https://www.tetras.univ-smb.fr/">Tetras</Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
