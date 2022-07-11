import {Row, Col} from 'reactstrap';
import cx from 'clsx';
import heroClasses from './hero.module.css';
import logo from './images/logo_white.svg';

export default function About() {
  return (
    <Row
      className={cx(
        'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
        heroClasses.whiteShadow,
      )}
    >
      <Col lg={6} className="mb-3 mb-lg-0">
        <div className="ratio ratio-16x9">
          <img
            src={logo}
            className="d-block mx-lg-auto rounded img-fluid"
            alt="Bootstrap Themes"
            loading="lazy"
            style={{objectFit: 'contain'}}
          />
        </div>
      </Col>
      <Col className="align-self-start">
        <Row xs={1}>
          <Col className="mb-3">
            <h2 className="display-5 fw-bold lh-1">About me</h2>
          </Col>
          <Col className="mb-1">
            <h5>International Speaker</h5>
          </Col>
          <Col className="mb-1">
            <h5>
              Developer Relations Engineer @{' '}
              <a href="https://nearform.com" className="text-decoration-none">
                NearForm
              </a>
            </h5>
          </Col>
          <Col className="mb-1">
            <h5>
              University Instructor @{' '}
              <a
                href="https://www.iut-acy.univ-smb.fr/"
                className="text-decoration-none"
              >
                IUT Annecy
              </a>
            </h5>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
