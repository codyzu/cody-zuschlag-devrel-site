import {Row, Col} from 'reactstrap';
import {Article as ArticleDef} from './article-type';

interface Props {
  article: ArticleDef;
}

export default function Article({article}: Props) {
  return (
    <Row className="mt-4 ms-xs-3">
      <Col>
        <h5>
          <a className="text-decoration-none" href={article.url}>
            {article.title}
          </a>
        </h5>
      </Col>
      {/* Mimic the padding of the nested grid in the Talks section
          by having margin when it wraps and padding when its on 1 line */}
      <Col xs={12} sm={12} md={3} className="ms-4 ps-3">
        {new Date(article.date).toLocaleDateString()}
      </Col>
    </Row>
  );
}
