import {Row, Col} from 'reactstrap';
import {type Article as ArticleDef} from './article-type';
import {Link} from './Link';

type Props = {
  article: ArticleDef;
};

export default function Article({article}: Props) {
  return (
    <>
      <div className="text-2xl md:col-span-3">
        <Link url={article.url}>{article.title}</Link>
      </div>
      <div className="pl-3 md:pl-0 pb-3">
        {new Date(article.date).toLocaleDateString()}
      </div>
    </>
  );
}
