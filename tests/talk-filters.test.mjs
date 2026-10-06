import assert from 'node:assert/strict';
import {test} from 'node:test';
import {isTalkMatch, normalizeSearch} from '../src/talks/filter-talks.ts';
import talks from './read-talks.mjs';

const records = talks.map((talk) => ({
  search: normalizeSearch(
    `${talk.conference} ${talk.name} ${talk.location} ${new Date(talk.date).getUTCFullYear()}`,
  ),
  region: talk.region,
  video: Boolean(talk.video && talk.video !== 'none'),
  slides: Boolean(talk.slides),
}));
const filter = (overrides = {}) =>
  records.filter((talk) =>
    isTalkMatch(talk, {query: '', resources: [], regions: [], ...overrides}),
  );

test('search ignores case and accents, requires every word, and searches all fields', () => {
  assert.equal(normalizeSearch('ÉCOLE München'), 'ecole munchen');
  assert.equal(filter({query: '  MÚNICH  xen 2026  '}).length, 1);
  assert.equal(filter({query: 'deterministic japan 2025'}).length, 1);
  assert.equal(filter({query: 'FLOSS addiction'}).length, 1);
  assert.equal(filter({query: '   \t '}).length, talks.length);
  assert.equal(filter({query: 'no-such-talk'}).length, 0);
  assert.equal(filter({query: 'Orama'}).length, 1);
});

test('resource requirements intersect and selected locations are alternatives', () => {
  const resources = ['video', 'slides'];
  assert.deepEqual(
    filter({resources}),
    records.filter((talk) => talk.video && talk.slides),
  );
  assert.deepEqual(
    filter({regions: ['Europe', 'USA']}),
    records.filter((talk) => ['Europe', 'USA'].includes(talk.region)),
  );
  assert.deepEqual(
    filter({query: '2023', resources, regions: ['Europe', 'USA']}),
    records.filter(
      (talk) =>
        talk.search.includes('2023') &&
        talk.video &&
        talk.slides &&
        ['Europe', 'USA'].includes(talk.region),
    ),
  );
  assert.equal(filter({query: 'berlin', resources: ['video']}).length, 0);
  assert.equal(
    filter({query: 'experience paris', resources: ['video']}).length,
    0,
  );
});

test('Virtual entries are normalized and Japan is explicitly Asia', () => {
  assert.equal(
    talks
      .filter((talk) => talk.location.toLowerCase() === 'virtual')
      .every(
        (talk) => talk.location === 'Virtual' && talk.region === 'Virtual',
      ),
    true,
  );
  assert.equal(filter({query: 'japan', regions: ['Asia']}).length, 1);
  assert.equal(filter({query: 'japan', regions: ['Europe']}).length, 0);
  assert.equal(filter({regions: ['Virtual']}).length, 10);
});
