import {readFileSync, readdirSync} from 'node:fs';
import yaml from 'js-yaml';
import {articleSchema} from '../src/articles/article-schema.ts';
import {sortArticles} from '../src/articles/sort-articles.ts';

const directory = new URL('../src/content/articles/', import.meta.url);
export const entries = readdirSync(directory)
  .filter((name) => name.endsWith('.md'))
  .map((name) => {
    const text = readFileSync(new URL(name, directory), 'utf8');
    const frontmatter = text.match(
      /^---\r?\n(?<data>[\s\S]*?)\r?\n---(?:\r?\n|$)/v,
    );
    if (!frontmatter) {
      throw new Error(`Missing frontmatter: ${name}`);
    }

    return {
      id: name.slice(0, -3),
      data: articleSchema.parse(yaml.load(frontmatter.groups.data)),
    };
  });

export default sortArticles(entries).map(({data}) => data);
