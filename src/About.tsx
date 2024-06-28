import logo from './images/logo_white.svg';
import {Link} from './Link';
import Section from './Section';
import SectionTitle from './SectionTitle';

export default function About() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="mb-12 lg:mb-0 px-0 lg:px-3">
          <a
            href="https://nearform.com"
            className="aspect-video w-full min-h-0 flex flex-col items-center max-h-[400px]"
          >
            <img
              src={logo}
              className="block lg:mx-auto rounded max-w-full h-auto object-cover h-full"
              alt="NearForm logo"
              loading="lazy"
            />
          </a>
        </div>
        <div className="self-start lg:-order-1 flex flex-col gap-4">
          <SectionTitle title="About me" />
          <div className="text-2xl">International Speaker</div>
          <div className="text-2xl">
            Developer Relations Community Lead @{' '}
            <Link url="https://nearform.com">Nearform</Link>
          </div>
          <div className="text-2xl">
            University Instructor @{' '}
            <Link url="https://www.iut-acy.univ-smb.fr/">IUT Annecy</Link> &amp;{' '}
            <Link url="https://www.tetras.univ-smb.fr/">Tetras</Link>
          </div>
          <div className="text-secondary text-justify">
            Cody is a software engineer consultant, developer relations
            engineer, and university instructor with a passion for learning and
            sharing technology. He teaches a university web development course
            and loves interacting with developers of all experience levels. He
            started speaking internationally in 2022 at React Summit and
            NodeConf EU as well as hosting some of the events connected to
            NodeConf EU. His current passion is building full-stack and
            decentralized applications using all OSS technologies.
          </div>
        </div>
      </div>
    </Section>
  );
}
