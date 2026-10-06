export function parseGalleryFilenames(paths: string[]) {
  const orders = new Set<number>();
  return paths
    .map((path) => {
      const filename = path.split('/').at(-1)!;
      const match =
        /^(?<order>\d+)_(?<description>[\da-z]+(?:-[\da-z]+)*)(?:_(?<modifier>big|portrait))?\.(?:jpg|jpeg|png)$/v.exec(
          filename,
        );
      if (!match?.groups) {
        throw new Error(
          `Invalid gallery filename "${filename}". Use number_lowercase-description[_big|_portrait].jpg, .jpeg, or .png.`,
        );
      }

      const order = Number(match.groups.order);
      if (!Number.isSafeInteger(order) || order < 1) {
        throw new Error(
          `Invalid gallery order in "${filename}". Use a positive safe integer.`,
        );
      }

      if (orders.has(order)) {
        throw new Error(`Duplicate gallery order ${order} in "${filename}".`);
      }

      orders.add(order);
      const description = match.groups.description.replaceAll('-', ' ');
      return {
        path,
        order,
        alt: description.charAt(0).toUpperCase() + description.slice(1),
        aspectRatio:
          match.groups.modifier === 'portrait'
            ? ('3/4' as const)
            : ('4/3' as const),
        featured: match.groups.modifier === 'big',
      };
    })
    .toSorted((a, b) => a.order - b.order);
}
