import {Row, Col} from 'reactstrap';
import cx from 'clsx';
import ReactMap, {Marker} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import heroClasses from './hero.module.css';
import 'maplibre-gl/dist/maplibre-gl.css';

const annecy = {longitude: 6.133, latitude: 45.916};

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
  );
}
