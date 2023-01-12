import Article from './Article';
import articles from './articles';
import Section from './Section';
import SectionTitle from './SectionTitle';

export default function ArticleList() {
  return (
    <Section id="articles">
      <SectionTitle
        title="Articles and blog posts"
        subtitle="A curated list of written content"
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {articles.map((article) => (
          <Article key={`${article.title}-${article.date}`} article={article} />
        ))}
      </div>
    </Section>
  );
}
