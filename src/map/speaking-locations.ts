// Approximate city centres, not conference venues. Keys match talk frontmatter.
const cityCoordinates: Partial<Record<string, [number, number]>> = {
  'Amsterdam, Netherlands': [52.3676, 4.9041],
  'Athens, Greece': [37.9838, 23.7275],
  'Barcelona, Spain': [41.3874, 2.1686],
  'Berlin, Germany': [52.52, 13.405],
  'Grenoble, France': [45.1885, 5.7245],
  'Kilkenny, Ireland': [52.6541, -7.2448],
  'Lisbon, Portugal': [38.7223, -9.1393],
  'London, England': [51.5074, -0.1278],
  'Munich, Germany': [48.1351, 11.582],
  'Oakland, CA, USA': [37.8044, -122.2712],
  'Paris, France': [48.8566, 2.3522],
  'Porto, Portugal': [41.1579, -8.6291],
  'Salt Lake City, Utah, USA': [40.7608, -111.891],
  'San Jose, California, USA': [37.3382, -121.8863],
  'Stockholm, Sweden': [59.3293, 18.0686],
  'Tokyo, Japan': [35.6762, 139.6503],
  'Turin, Italy': [45.0703, 7.6869],
};

export const home = {
  location: 'Annecy, France',
  coordinates: [45.916, 6.133] as [number, number],
};

export type SpeakingLocation = {
  location: string;
  coordinates: [number, number];
  count: number;
};

type Talk = {location: string; region: string; date: string};

export function speakingLocations(talks: Talk[], asOf = new Date()) {
  const locations = new Map<string, SpeakingLocation>();
  for (const talk of talks) {
    if (talk.region === 'Virtual' || new Date(talk.date) > asOf) {
      continue;
    }

    const coordinates = cityCoordinates[talk.location];
    if (!coordinates) {
      throw new Error(`Add city coordinates for ${talk.location}`);
    }

    const existing = locations.get(talk.location);
    if (existing) {
      existing.count++;
    } else {
      locations.set(talk.location, {
        location: talk.location,
        coordinates,
        count: 1,
      });
    }
  }

  return locations
    .values()
    .toArray()
    .toSorted((a, b) => a.location.localeCompare(b.location, 'en'));
}
