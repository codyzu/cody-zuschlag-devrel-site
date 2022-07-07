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
        <div className="ratio ratio-16x9">
          <div>
            <Suspense>
              <Map />
            </Suspense>
          </div>
        </div>
      </Col>
      <Col className="align-self-start">
        <h1 className="display-5 fw-bold lh-1 mb-3">Based from</h1>
        <p className="lead">Annecy, France</p>
      </Col>
    </Row>
  );
}
