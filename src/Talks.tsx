import {Row, Col} from 'reactstrap';
import cx from 'clsx';
import heroClasses from './hero.module.css';
import Talk from './Talk';
import talks from './talks';

export default function Talks() {
  console.log(
    new Date('2022-06-17T12:00Z'),
    new Date('2022-06-17T12:00Z').toLocaleDateString(),
  );
  return (
    <Row
      className={cx(
        'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
        heroClasses.whiteShadow,
      )}
    >
      <Col className="align-self-start">
        <Row>
          <Col>
            <h1 className="display-5 fw-bold lh-1">Speaking engagements</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="lead">
            All of my previous and planned future speaking experience
          </Col>
        </Row>
        {talks.map((talk) => (
          <Talk key={talk.date} talk={talk} />
        ))}
      </Col>
    </Row>
  );
}
