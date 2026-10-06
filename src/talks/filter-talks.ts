export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replaceAll(/\p{Mark}/gv, '')
    .toLowerCase();
}

export type TalkFilterRecord = {
  search: string;
  region: string;
  video: boolean;
  slides: boolean;
};

export type TalkFilters = {
  query: string;
  resources: string[];
  regions: string[];
};

export function isTalkMatch(
  talk: TalkFilterRecord,
  filters: TalkFilters,
): boolean {
  const terms = normalizeSearch(filters.query).split(/\s+/v).filter(Boolean);
  return (
    terms.every((term) => talk.search.includes(term)) &&
    filters.resources.every((resource) =>
      resource === 'video' ? talk.video : talk.slides,
    ) &&
    (filters.regions.length === 0 || filters.regions.includes(talk.region))
  );
}
