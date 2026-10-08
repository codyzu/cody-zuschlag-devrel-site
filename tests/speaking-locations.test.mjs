import assert from 'node:assert/strict';
import {test} from 'node:test';
import {speakingLocations} from '../src/map/speaking-locations.ts';
import talks from './read-talks.mjs';

const asOf = new Date('2026-10-08T00:00Z');

test('speaking map groups completed in-person entries by city', () => {
  const cities = speakingLocations(talks, asOf);
  assert.equal(cities.length, 17);
  assert.equal(
    cities.reduce((count, city) => count + city.count, 0),
    34,
  );
  assert.equal(
    cities.find((city) => city.location === 'Kilkenny, Ireland').count,
    14,
  );
  for (const city of cities) {
    assert.ok(city.coordinates[0] >= -90);
    assert.ok(city.coordinates[0] <= 90);
    assert.ok(city.coordinates[1] >= -180);
    assert.ok(city.coordinates[1] <= 180);
  }
});

test('future and virtual entries do not imply a completed speaking visit', () => {
  const fixture = [
    {location: 'Paris, France', region: 'Europe', date: '2026-10-01T12:00Z'},
    {location: 'Paris, France', region: 'Europe', date: '2026-11-01T12:00Z'},
    {location: 'Virtual', region: 'Virtual', date: '2026-10-01T12:00Z'},
  ];
  assert.equal(speakingLocations(fixture, asOf)[0].count, 1);
  assert.equal(
    speakingLocations(fixture, new Date('2026-12-01T00:00Z'))[0].count,
    2,
  );
  assert.throws(
    () =>
      speakingLocations(
        [
          {
            location: 'Unknown city',
            region: 'Europe',
            date: '2026-10-01T12:00Z',
          },
        ],
        asOf,
      ),
    /Add city coordinates/v,
  );
});
