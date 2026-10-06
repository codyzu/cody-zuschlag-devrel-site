import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {talkSchema} from './talks/talk-schema.ts';

export const collections = {
  talks: defineCollection({
    loader: glob({pattern: '*.md', base: './src/content/talks'}),
    schema: talkSchema,
  }),
};
