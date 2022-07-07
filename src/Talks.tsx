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
  );
}
