import assert from 'node:assert/strict';
import {test} from 'node:test';
import {talkSchema} from '../src/talks/talk-schema.ts';
import {sortTalks} from '../src/talks/sort-talks.ts';
import {sortTalkHighlights} from '../src/talks/sort-talk-highlights.ts';
import {formatTalkDate} from '../src/talks/format-talk-date.ts';

const talk = {
  conference: 'Example conference',
  name: 'Example talk',
  date: '2026-10-01T11:55Z',
  location: 'Virtual',
  region: 'Virtual',
  recordingStatus: 'unavailable',
};

test('scheduled dates use the event timestamp and UTC without promising a recording', () => {
  const date = '2026-12-08T09:00:00+09:00';
  const event = Date.parse(date);
  assert.equal(
    formatTalkDate(date, event - 1),
    'Scheduled for 8 December 2026',
  );
  assert.equal(formatTalkDate(date, event), '8 December 2026');
  assert.equal(formatTalkDate(date, event + 1), '8 December 2026');
  assert.equal(
    formatTalkDate('2026-01-01T00:30:00+02:00', 0),
    'Scheduled for 31 December 2025',
  );
});

test('talk metadata validates dates, regions, URLs, and all recording states', () => {
  for (const recordingStatus of [
    'unpublished',
    'unavailable',
    'not-recorded',
  ]) {
    assert.equal(
      talkSchema.parse({...talk, recordingStatus}).recordingStatus,
      recordingStatus,
    );
    assert.equal(
      talkSchema.safeParse({
        ...talk,
        recordingStatus,
        video: 'https://example.com/video',
      }).success,
      false,
    );
  }

  assert.equal(
    talkSchema.safeParse({...talk, recordingStatus: 'available'}).success,
    false,
  );
  assert.equal(
    talkSchema.safeParse({...talk, recordingStatus: undefined}).success,
    false,
  );
  assert.equal(
    talkSchema.safeParse({...talk, recordingStatus: 'expected'}).success,
    false,
  );
  assert.equal(
    talkSchema.parse({
      ...talk,
      recordingStatus: 'available',
      video: 'https://example.com/video',
    }).video,
    'https://example.com/video',
  );

  for (const invalid of [
    {date: '2026-02-30T11:55Z'},
    {date: '2026-10-01T11:55'},
    {region: 'Antarctica'},
    {video: 'not-a-url'},
    {video: 'none'},
    {slides: 'none'},
    {conference: ''},
    {slide: 'https://example.com/slides'},
    {thumbnail: '../../images/talks/example.png'},
    {thumbnail: '', thumbnailAlt: 'Title slide'},
    {thumbnail: '../../images/talks/example.png', thumbnailAlt: '  '},
  ]) {
    assert.equal(talkSchema.safeParse({...talk, ...invalid}).success, false);
  }

  assert.equal(
    talkSchema.safeParse({
      ...talk,
      thumbnail: '../../images/talks/example.png',
      thumbnailAlt: 'Title slide with the Xen mascot',
    }).success,
    true,
  );
});

test('highlight selection requires a description and a positive integer order', () => {
  assert.equal(talkSchema.safeParse(talk).success, true);
  assert.equal(
    talkSchema.safeParse({
      ...talk,
      highlightOrder: 1,
      description: 'A subject.',
    }).success,
    true,
  );
  for (const invalid of [
    {highlightOrder: 1},
    {highlightOrder: 1, description: ''},
    {highlightOrder: 1, description: '  '},
    {highlightOrder: 0, description: 'A subject.'},
    {highlightOrder: -1, description: 'A subject.'},
    {highlightOrder: 1.5, description: 'A subject.'},
    {highlightOrder: '1', description: 'A subject.'},
  ]) {
    assert.equal(talkSchema.safeParse({...talk, ...invalid}).success, false);
  }
});

test('highlights use curated order and ID ties without changing the archive', () => {
  const entries = [
    {id: 'unselected', data: {}},
    {id: 'b', data: {highlightOrder: 20}},
    {id: 'last', data: {highlightOrder: 30}},
    {id: 'first', data: {highlightOrder: 10}},
    {id: 'a', data: {highlightOrder: 20}},
  ];
  assert.deepEqual(
    sortTalkHighlights(entries).map(({id}) => id),
    ['first', 'a', 'b', 'last'],
  );
  assert.equal(entries.length, 5);
  assert.equal(entries[0].id, 'unselected');
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
