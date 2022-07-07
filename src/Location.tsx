import {lazy, Suspense} from 'react';
import {Row, Col} from 'reactstrap';
import cx from 'clsx';
import heroClasses from './hero.module.css';

const Map = lazy(async () => import('./Map'));

export default function Location() {
  return (
    <Row
      className={cx(
        'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
        heroClasses.whiteShadow,
      )}
    >
      <Col lg={6} className="mb-3 mb-lg-0">
        <div className="w-100" style={{height: '315px'}}>
          <Suspense>
            <Map />
          </Suspense>
        </div>
      </Col>
      <Col className="align-self-start">
        <Row>
          <Col>
            <h1 className="display-5 fw-bold lh-1">Based from</h1>
          </Col>
        </Row>
        <Row>
          <Col className="lead">Annecy, France</Col>
        </Row>
      </Col>
    </Row>
  );
}
