export function sortArticles<T extends {id: string; data: {order: number}}>(
  entries: T[],
): T[] {
  return entries.toSorted((left, right) => {
    const difference = left.data.order - right.data.order;
    return difference === 0
      ? left.id < right.id
        ? -1
        : Number(left.id > right.id)
      : difference;
  });
}
