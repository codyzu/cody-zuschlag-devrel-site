import {Row, Col, Badge} from 'reactstrap';
import {FaVideo} from 'react-icons/fa';
import {Talk as TalkDef} from './talk';

interface Props {
  talk: TalkDef;
}

export default function Talk({talk}: Props) {
  console.log(talk);
  return (
    <>
      <Row className="mt-4">
        <Col>
          <h5>{talk.conference}</h5>
        </Col>
      </Row>
      <Row className="ms-3" xs={1} sm={2} md={4}>
        <Col>{talk.name}</Col>
        <Col>{new Date(talk.date).toLocaleDateString()}</Col>
        <Col>{talk.location}</Col>
        <Col>
          {talk.videoLink ? (
            <a className="text-decoration-none" href={talk.videoLink}>
              <FaVideo /> Watch now
            </a>
          ) : (
            <Badge pill color="secondary">
              Video coming soon
            </Badge>
          )}
        </Col>
      </Row>
    </>
  );
}
