import {Row, Col, Table, Badge} from 'reactstrap';
import cx from 'clsx';
import heroClasses from './hero.module.css';

export default function Talks() {
  return (
    <Row
      className={cx(
        'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
        heroClasses.whiteShadow,
      )}
    >
      <Col className="align-self-start">
        <Row className="mb-3">
          <Col>
            <h1 className="display-5 fw-bold lh-1">Speaking engagements</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="lead">
              All of my previous and planned future speaking experience
            </p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h5>ReactSummit</h5>
          </Col>
        </Row>
        <Row className="ms-3" xs={1} sm={2} md={4}>
          <Col>Modern Full-Stack</Col>
          <Col>{new Date('2022-06-17').toLocaleDateString()}</Col>
          <Col>Amsterdam, Netherlands</Col>
          <Col>
            <Badge pill color="secondary">
              Video coming soon
            </Badge>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h5>Caribbean Developers Conference</h5>
          </Col>
        </Row>
        <Row className="ms-3" xs={1} sm={2} md={4}>
          <Col>Design Tokens</Col>
          <Col>{new Date('2022-11-03').toLocaleDateString()}</Col>
          <Col>Dominican Republic</Col>
          <Col>
            <Badge pill color="secondary">
              Video coming soon
            </Badge>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
