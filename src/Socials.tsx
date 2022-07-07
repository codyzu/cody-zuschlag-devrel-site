import {Row, Col, Container} from 'reactstrap';
import {FaTwitter, FaGithub, FaMedium, FaLinkedin} from 'react-icons/fa';
import {MdOutlineArticle} from 'react-icons/md';
import cx from 'clsx';
import heroClasses from './hero.module.css';

export default function Socials() {
  return (
    <Row
      className={cx(
        'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
        heroClasses.whiteShadow,
      )}
    >
      <Col className="align-self-start">
        <h1 className="display-5 fw-bold lh-1 mb-3">Socials</h1>
        <p className="lead">Find me at these places</p>
        <Container fluid>
          <Row className="justify-content-center gx-5">
            <Col xs="auto">
              <span className="h4">
                <a
                  href="https://twitter.com/codyzus"
                  className="text-decoration-none"
                >
                  <FaTwitter /> @codyzus
                </a>
              </span>
            </Col>
            <Col xs="auto">
              <h4>
                <a
                  href="https://github.com/codyzu"
                  className="text-decoration-none"
                >
                  <FaGithub /> @codyzu
                </a>
              </h4>
            </Col>
            <Col xs="auto" className="align-middle">
              <h4>
                <a
                  href="https://www.linkedin.com/in/cody-zuschlag"
                  className="text-decoration-none"
                >
                  <FaLinkedin /> LinkedIn
                </a>
              </h4>
            </Col>
            <Col xs="auto">
              <h4>
                <a
                  href="https://medium.com/@codyzus"
                  className="text-decoration-none"
                >
                  <FaMedium /> Medium
                </a>
              </h4>
            </Col>
            <Col xs="auto">
              <h4>
                <a
                  href="https://www.nearform.com/author/cody-zuschlag/"
                  className="text-decoration-none"
                >
                  <MdOutlineArticle /> Blog
                </a>
              </h4>
            </Col>
          </Row>
        </Container>
      </Col>
    </Row>
  );
}
