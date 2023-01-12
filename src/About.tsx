import logo from './images/logo_white.svg';
import Section from './Section';
import SectionTitle from './SectionTitle';

export default function About() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="mb-5 lg:mb-0 px-0 lg:px-3">
          <div className="ratio ratio-16x9">
            <img
              src={logo}
              className="d-block mx-lg-auto rounded img-fluid"
              alt="Bootstrap Themes"
              loading="lazy"
              style={{objectFit: 'contain'}}
            />
          </div>
        </div>
        <div className="align-self-start lg:-order-1 flex flex-col">
          <SectionTitle title="About me" />
          <div className="mb-1">
            <h5>International Speaker</h5>
          </div>
          <div className="mb-1">
            <h5>
              Developer Relations Engineer @{' '}
              <a href="https://nearform.com" className="text-decoration-none">
                NearForm
              </a>
            </h5>
          </div>
          <div className="mb-1">
            <h5>
              University Instructor @{' '}
              <a
                href="https://www.iut-acy.univ-smb.fr/"
                className="text-decoration-none"
              >
                IUT Annecy
              </a>{' '}
              &amp;{' '}
              <a
                href="https://www.tetras.univ-smb.fr/"
                className="text-decoration-none"
              >
                Tetras
              </a>
            </h5>
          </div>
        </div>
      </div>
    </Section>
  );
}
