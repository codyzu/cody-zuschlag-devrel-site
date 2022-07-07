import {Container, Row, Col, Badge, Table} from 'reactstrap';
import cx from 'clsx';
import {FaTwitter, FaGithub, FaMedium, FaLinkedin} from 'react-icons/fa';
import {MdOutlineArticle} from 'react-icons/md';
import ReactMap, {Marker} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import logo from './nearform.svg';
import classes from './home.module.css';
import 'maplibre-gl/dist/maplibre-gl.css';

const annecy = {longitude: 6.133, latitude: 45.916};

export default function Home() {
  return (
    <>
      <div
        className={cx(
          'vw-100 vh-100 overflow-hidden text-center d-flex justify-content-center mw-100',
          classes.funky,
          classes.hero,
        )}
      >
        <h1 className="fw-bold d-inline-flex flex-column align-items-center align-self-center">
          <span>Cody</span>
          <span>Zuschlag</span>
        </h1>
      </div>

      <Container className="mt-5">
        <Row
          className={cx(
            'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
            classes.whiteShadow,
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
            <h2 className="display-5 fw-bold lh-1 mb-3">About me</h2>
            <h5>International Speaker</h5>
            <h5>
              Developer Relations Engineer @{' '}
              <a href="https://nearform.com" className="text-decoration-none">
                NearForm
              </a>
            </h5>
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

        <Row
          className={cx(
            'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
            classes.whiteShadow,
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

        <Row
          className={cx(
            'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
            classes.whiteShadow,
          )}
        >
          <Col className="align-self-start">
            <h1 className="display-5 fw-bold lh-1 mb-3">My Talks</h1>
            <p className="lead">
              All of my previous and planned future speaking experience
            </p>
            <Table responsive>
              <thead>
                <tr>
                  <th>Conference</th>
                  <th>Talk</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Video</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">ReactSummit</th>
                  <td>Modern Full-Stack</td>
                  <td>Amsterdam, Netherlands</td>
                  <td>{new Date('2022-06-17').toLocaleDateString()}</td>
                  <td>
                    <Badge pill color="secondary">
                      Coming soon
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Caribbean Developers Conference</th>
                  <td>Design Tokens</td>
                  <td>Dominican Republic</td>
                  <td>{new Date('2022-11-03').toLocaleDateString()}</td>
                  <td>
                    <Badge pill color="secondary">
                      Coming soon
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row
          className={cx(
            'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
            classes.whiteShadow,
          )}
        >
          <Col lg={6} className="mb-3 mb-lg-0">
            <div className="ratio ratio-16x9">
              <div>
                <ReactMap
                  mapLib={maplibregl}
                  initialViewState={{
                    ...annecy,
                    zoom: 8,
                  }}
                  mapStyle="https://api.maptiler.com/maps/basic/style.json?key=qlckteTnKEl9ZBax9Thw"
                >
                  <Marker {...annecy} anchor="bottom" />
                </ReactMap>
              </div>
            </div>
          </Col>
          <Col className="align-self-start">
            <h1 className="display-5 fw-bold lh-1 mb-3">Based from</h1>
            <p className="lead">Annecy, France</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
