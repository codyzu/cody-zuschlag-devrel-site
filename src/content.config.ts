import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {articleSchema} from './articles/article-schema.ts';
import {talkSchema} from './talks/talk-schema.ts';

export const collections = {
  articles: defineCollection({
    loader: glob({pattern: '*.md', base: './src/content/articles'}),
    schema: articleSchema,
  }),
  talks: defineCollection({
    loader: glob({pattern: '*.md', base: './src/content/talks'}),
    schema: talkSchema,
  }),
};
