import {Row, Col} from 'reactstrap';
import cx from 'clsx';
import heroClasses from './hero.module.css';
import Article from './Article';
import articles from './articles';

export default function ArticleList() {
  return (
    <Row
      id="Articles"
      className={cx(
        'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
        heroClasses.whiteShadow,
      )}
    >
      <Col className="align-self-start">
        <Row>
          <Col>
            <h1 className="display-5 fw-bold lh-1">Articles and blog posts</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="lead">A curated list of written content</Col>
        </Row>
        {articles.map((article) => (
          <Article key={article.date} article={article} />
        ))}
      </Col>
    </Row>
  );
}
