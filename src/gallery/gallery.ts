import type {ImageMetadata} from 'astro';
import {parseGalleryFilenames} from './gallery-filenames.ts';

// Include uppercase extensions so invalid casing fails validation rather than disappearing.
const images = import.meta.glob<ImageMetadata>(
  './*.{[jJ][pP][gG],[jJ][pP][eE][gG],[pP][nN][gG]}',
  {
    eager: true,
    import: 'default',
  },
);

export const gallery = parseGalleryFilenames(Object.keys(images)).map(
  ({path, ...metadata}) => ({
    ...metadata,
    image: images[path],
  }),
);
