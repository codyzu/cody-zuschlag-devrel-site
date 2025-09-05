import logo from './images/logo-xen-reverse.svg';
import {Link} from './Link';
import Section from './Section';
import SectionTitle from './SectionTitle';

export default function About() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="mb-12 lg:mb-0 px-0 lg:px-3 flex flex-col justify-center">
          <a
            href="https://xenproject.org"
            className="aspect-video w-full min-h-0 flex flex-col items-center max-h-[400px]"
          >
            <img
              src={logo}
              className="block lg:mx-auto rounded max-w-full h-auto object-fill h-full"
              alt="NearForm logo"
              loading="lazy"
            />
          </a>
        </div>
        <div className="self-start lg:-order-1 flex flex-col gap-4">
          <SectionTitle title="About me" />
          <div className="text-2xl">International Speaker</div>
          <div className="text-2xl">
            Community Manager @{' '}
            <Link url="https://xenproject.org">
              Xen Project (Linux Foundation)
            </Link>
          </div>
          <div className="text-2xl">
            University Instructor @{' '}
            <Link url="https://www.iut-acy.univ-smb.fr/">IUT Annecy</Link> &amp;{' '}
            <Link url="https://www.tetras.univ-smb.fr/">Tetras</Link>
          </div>
          <div className="text-secondary text-justify">
            <strong>
              Cody is a software engineering consultant, developer relations
              engineer, FINOS ambassador, and university instructor with a
              passion for learning and sharing technology.
            </strong>{' '}
            He teaches a university web development course and enjoys connecting
            with developers of all experience levels. Since 2022, he's spoken at
            international conferences like React Summit, Open Source Summit
            Europe, and NodeConf EU, where he's also helped host
            community-driven events. Cody currently serves as Community Manager
            for the Xen Project, helping grow and support the global community
            behind one of the world's most widely used open-source hypervisors.
            His passion lies in building the software systems of the future
            using the best open technologies.
          </div>
        </div>
      </div>
    </Section>
  );
}
