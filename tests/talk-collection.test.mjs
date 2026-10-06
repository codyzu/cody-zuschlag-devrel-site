import assert from 'node:assert/strict';
import {test} from 'node:test';
import {talkSchema} from '../src/talks/talk-schema.ts';
import {sortTalks} from '../src/talks/sort-talks.ts';

const talk = {
  conference: 'Example conference',
  name: 'Example talk',
  date: '2026-10-01T11:55Z',
  location: 'Virtual',
  region: 'Virtual',
};

test('talk metadata validates dates, regions, URLs, and all recording states', () => {
  for (const video of [undefined, 'none', 'https://example.com/video']) {
    assert.equal(talkSchema.parse({...talk, video}).video, video);
  }

  for (const invalid of [
    {date: '2026-02-30T11:55Z'},
    {date: '2026-10-01T11:55'},
    {region: 'Antarctica'},
    {video: 'not-a-url'},
    {slides: 'none'},
    {conference: ''},
    {slide: 'https://example.com/slides'},
  ]) {
    assert.equal(talkSchema.safeParse({...talk, ...invalid}).success, false);
  }
});

test('talks sort by timestamp, including future talks, with an ID tie-breaker', () => {
  const entries = [
    {id: 'older', data: {date: '2026-01-01T00:30:00+02:00'}},
    {id: 'b', data: {date: '2026-01-01T00:00Z'}},
    {id: 'future', data: {date: '2099-01-01T00:00Z'}},
    {id: 'a', data: {date: '2026-01-01T00:00Z'}},
  ];
  assert.deepEqual(
    sortTalks(entries).map(({id}) => id),
    ['future', 'a', 'b', 'older'],
  );
  assert.equal(entries[0].id, 'older');
});
