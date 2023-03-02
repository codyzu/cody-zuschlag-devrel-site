import cx from 'clsx';
import {type Picture} from 'imagetools-core';
import Section from './Section';
import SectionTitle from './SectionTitle';

const formats = ['avif', 'webp', 'jpeg'];

const picturesSmall = import.meta.glob<Picture>(
  [
    './gallery/*.{jpg,jpeg,png}',
    '!./gallery/*_big.{jpg,jpeg,png}',
    '!./gallery/*_portrait.{jpg,jpeg,png}',
  ],
  {
    query: {
      format: 'avif;webp;jpeg',
      width: '600;800',
      aspect: '4:3',
      picture: true,
      // Source: true,
      // srcset: true,
    },
    import: 'default',
    eager: true,
  },
);

const picturesBig = import.meta.glob<Picture>(
  './gallery/*_big.{jpg,jpeg,png}',
  {
    query: {
      format: 'avif;webp;jpeg',
      width: '600;800;1000',
      aspect: '4:3',
      picture: true,
      // Source: true,
      // srcset: true,
    },
    import: 'default',
    eager: true,
  },
);

const picturesPortrait = import.meta.glob<Picture>(
  './gallery/*_portrait.{jpg,jpeg,png}',
  {
    query: {
      format: 'avif;webp;jpeg',
      width: '600;800',
      aspect: '3:4',
      // Aspect: '0.75',
      picture: true,
      // Source: true,
      // srcset: true,
    },
    import: 'default',
    eager: true,
  },
);

type ParsedImage = {
  big: boolean;
  portrait: boolean;
  fallback: string;
  srcSets: Record<string, string>;
};

// Inspiration for loading images
// https://www.builder.io/blog/fast-images
// https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images

const allImportEntries = Object.entries(picturesSmall).concat(
  Object.entries(picturesBig),
  Object.entries(picturesPortrait),
);

const entries: Array<[string, ParsedImage]> = allImportEntries.map(
  ([key, picture]) => {
    // Parse everything between the last slash and the first dot
    const filename: string = key.split('/').at(-1)!.split('.')[0];

    // Check for _big and _portrait postfixes (these will get different css)
    const big = filename.endsWith('_big');
    const portrait = filename.endsWith('_portrait');

    return [
      filename,
      {
        big,
        portrait,

        // Build the props we'll use with the img and picture tags
        fallback: picture.fallback.src,
        srcSets: Object.fromEntries(
          formats.map((format) => [
            format,
            picture.sources[format]
              .map((source) => `${source.src} ${source.w}w`)
              .join(', '),
          ]),
        ),
      },
    ];
  },
);

// Sort the pictures alphanumerically
const sortedEntries: Array<[string, ParsedImage]> = entries.sort(([a], [b]) => {
  const nameA = a.toUpperCase();
  const nameB = b.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }

  if (nameA > nameB) {
    return 1;
  }

  // Names must be equal
  return 0;
});

const pictures = Object.fromEntries(sortedEntries);

function ResponsiveImage({
  name,
  picture,
}: {
  name: string;
  picture: ParsedImage;
}) {
  const imgStyles: Record<string, string> = {};
  if (picture.portrait) {
    imgStyles.height = '100%';
  } else {
    imgStyles.width = '100%';
  }

  return (
    <picture
      className={cx(
        'w-full h-full',
        picture.portrait ? 'aspect-[3/4]' : 'aspect-[4/3]',
        picture.big && 'sm:col-span-2 sm:row-span-2',
        picture.portrait && 'row-span-2',
      )}
    >
      {formats.map((format) => (
        <source
          srcSet={picture.srcSets[format]}
          type={`image/${format}`}
          key={format}
        />
      ))}
      <img
        src={picture.fallback}
        style={imgStyles}
        className={cx('rounded-xl object-cover')}
        loading="lazy"
        decoding="async"
        alt={`Gallery image: ${name}`}
      />
    </picture>
  );
}

export default function Photos() {
  return (
    <Section>
      <SectionTitle
        title="Photo gallery"
        subtitle="Small collection of presentation highlights"
      />
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {Object.entries(pictures).map(([key, p]) => (
          <ResponsiveImage name={key} key={key} picture={p} />
        ))}
      </div>
    </Section>
  );
}
