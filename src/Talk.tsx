import {Row, Col, Badge} from 'reactstrap';
import {FaVideo, FaGithub} from 'react-icons/fa';
import {TbPresentation} from 'react-icons/tb';
import {Talk as TalkDef} from './talk-type';

interface Props {
  talk: TalkDef;
}

export default function Talk({talk}: Props) {
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
          <Row xs={1}>
            <Col>
              {talk.video === 'none' ? null : talk.video ? (
                <a className="text-decoration-none" href={talk.video}>
                  <FaVideo /> Watch now
                </a>
              ) : (
                <Badge pill color="secondary">
                  Video coming soon
                </Badge>
              )}
            </Col>
            {talk.slides && (
              <Col>
                <a className="text-decoration-none" href={talk.slides}>
                  <TbPresentation /> Slides
                </a>
              </Col>
            )}
            {talk.repo && (
              <Col>
                <a className="text-decoration-none" href={talk.repo}>
                  <FaGithub /> GitHub Repo
                </a>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </>
  );
}
