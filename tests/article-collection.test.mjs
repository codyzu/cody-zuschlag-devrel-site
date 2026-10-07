import assert from 'node:assert/strict';
import {test} from 'node:test';
import {articleSchema} from '../src/articles/article-schema.ts';
import {sortArticles} from '../src/articles/sort-articles.ts';

const article = {
  title: 'Example article',
  url: 'https://example.com/article/',
  date: '2026-10-01T11:55Z',
  order: 10,
};

test('article metadata requires titles, web URLs, zoned dates, and positive integer order', () => {
  for (const date of [
    '2026-10-01T11:55Z',
    '2026-10-01T11:55:12.000Z',
    '2026-10-01T11:55:12+02:00',
  ]) {
    assert.equal(articleSchema.parse({...article, date}).date, date);
  }

  for (const invalid of [
    {title: ''},
    {title: ' '.repeat(3)},
    {url: 'not-a-url'},
    {url: 'ftp://example.com/article'},
    {date: '2026-02-30T11:55Z'},
    {date: '2026-10-01'},
    {date: '2026-10-01T11:55'},
    {order: undefined},
    {order: 0},
    {order: -1},
    {order: 1.5},
    {order: '10'},
    {unknown: true},
  ]) {
    assert.equal(
      articleSchema.safeParse({...article, ...invalid}).success,
      false,
    );
  }
});

test('articles use curated order regardless of date, with stable ID ties and no input mutation', () => {
  const entries = [
    {id: 'later', data: {order: 20, date: '2099-01-01T00:00Z'}},
    {id: 'b', data: {order: 10, date: '2026-01-01T00:00Z'}},
    {id: 'a', data: {order: 10, date: '2017-01-01T00:00Z'}},
  ];
  assert.deepEqual(
    sortArticles(entries).map(({id}) => id),
    ['a', 'b', 'later'],
  );
  assert.deepEqual(
    entries.map(({id}) => id),
    ['later', 'b', 'a'],
  );
});
