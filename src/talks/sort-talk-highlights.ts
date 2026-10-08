/**
Select representative talks in curated order, with stable IDs for ties.
*/
export function sortTalkHighlights<
  T extends {id: string; data: {highlightOrder?: number}},
>(entries: T[]): T[] {
  return entries
    .filter(({data}) => data.highlightOrder !== undefined)
    .toSorted((left, right) => {
      const difference = left.data.highlightOrder! - right.data.highlightOrder!;
      return difference === 0
        ? left.id < right.id
          ? -1
          : Number(left.id > right.id)
        : difference;
    });
}
