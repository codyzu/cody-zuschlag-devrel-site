/**
Newest first, with stable IDs resolving identical timestamps.
*/
export function sortTalks<T extends {id: string; data: {date: string}}>(
  entries: T[],
): T[] {
  return entries.toSorted((left, right) => {
    const difference = Date.parse(right.data.date) - Date.parse(left.data.date);
    return difference === 0
      ? left.id < right.id
        ? -1
        : Number(left.id > right.id)
      : difference;
  });
}
