import {readFileSync, readdirSync} from 'node:fs';
import yaml from 'js-yaml';
import {talkSchema} from '../src/talks/talk-schema.ts';
import {sortTalks} from '../src/talks/sort-talks.ts';

const directory = new URL('../src/content/talks/', import.meta.url);
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
      data: talkSchema.parse(yaml.load(frontmatter.groups.data)),
    };
  });

export default sortTalks(entries).map(({data}) => data);
