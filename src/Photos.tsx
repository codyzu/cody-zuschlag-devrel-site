import {Suspense, lazy, useEffect, useState} from 'react';
import cx from 'clsx';
import uri from 'urijs';
import {type Picture} from 'imagetools-core';
import Section from './Section';
import SectionTitle from './SectionTitle';
// Import photo1 from './images/reactsummit_closeup_2.jpeg';
// import photo2 from './images/reactsummit_closeup_3.jpeg';
// import photo3 from './images/nodeconf_community.jpeg';
// import photo4 from './images/reactsummit_me.jpeg';
// import photo5 from './images/reactsummit_tech_stack.jpeg';
// import photo6 from './images/devfest_alps_why.jpeg';
// import photo7 from './images/reactsummit_unicorns.jpeg';
// import photo8 from './images/devfest_alps_intro.jpeg';

const pictures = import.meta.glob<Picture>('./gallery/*.{jpg,jpeg,png}', {
  // Query: {format: 'webp;avif;jpg', width: '200;400;600;1200', picture: ''},
  query: {
    format: 'webp;avif;jpg',
    width: '225;300;350;640',
    aspect: '4:3',
    picture: true,
    // Source: true,
    // srcset: true,
  },
  import: 'default',
  eager: true,
});

// Inspiration for loading images
// https://www.builder.io/blog/fast-images

console.log('pictures', pictures);

function ResponsiveImage({name, picture}: {name: string; picture: Picture}) {
  const srcsets: Record<string, string> = {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const filename = uri(name).filename() as string;
  const big = filename.startsWith('big');
  const portrait = filename.startsWith('portrait');

  console.log('filename', filename, 'big', big, 'portrait', portrait);
  console.log('sources', picture.sources, 'fallback', picture.fallback);

  for (const format of ['avif', 'webp', 'jpeg']) {
    console.log('source', format, picture.sources[format]);
    srcsets[format] = picture.sources[format]
      .map((source) => `${source.src} ${source.w * 2}w`)
      .join(', ');
  }

  console.log('srcsets', srcsets);

  const imgStyles: Record<string, string> = {
    aspectRatio: portrait ? '3/4' : '4/3',
  };
  if (portrait) {
    imgStyles.height = '100%';
  } else {
    imgStyles.width = '100%';
  }
  // Const imgStyles: Record<string, string> = {
  //   aspectRatio: '4/3',
  // };
  // imgStyles.width = '100%';

  return (
    <picture
      className={cx(
        // 'w-full aspect-[4/3]',
        big && 'sm:col-span-2 sm:row-span-2',
        portrait && 'row-span-2',
      )}
    >
      {Object.entries(srcsets).map(([format, srcset]) => (
        <source srcSet={srcset} type={`image/${format}`} key={format} />
      ))}
      {/* <source
        type="image/avif"
        srcSet={srcsets.avif}
        // Srcset="/image.avif?width=100 100w, /image.avif?width=200 200w, /image.avif?width=400 400w, /image.avif?width=800 800w"
      />
      <source
        type="image/webp"
        srcSet={srcsets.webp}
        // Srcset="/image.webp?width=100 100w, /image.webp?width=200 200w, /image.webp?width=400 400w, /image.webp?width=800 800w"
      /> */}
      <img
        // Src="/image.png"
        // Srcset="/image.png?width=100 100w, /image.png?width=200 200w, /image.png?width=400 400w, /image.png?width=800 800w"
        src={picture.fallback.src}
        srcSet={srcsets.jpeg}
        // Sizes="(max-width: 639.9px) 100vw, (max-width: 767.9px) 50vw, 25vw"
        sizes="(max-width: 400px) 100vw, (max-width: 700px) 50vw, (max-width: 900px) 33vw, 225px"
        // Sizes="(min-width: 1020px) 100px, (min-width: 640px) 320px, 100vw"
        style={imgStyles}
        className={cx(
          'rounded-xl object-cover',
          // Portrait ? 'h-full' : 'w-full',
          // Portrait ? 'aspect-[3/4]' : 'aspect-[4/3]',
        )}
        // ClassName={cx(
        //   'photo',
        //   big && 'col-span-2 row-span-2',
        //   portrait && 'row-span-2',
        // )}
        // Style="width: 100%; aspect-ratio: 16/9"
        loading="lazy"
        decoding="async"
        alt="Builder.io drag and drop interface"
      />
    </picture>
  );
}

export default function Photos() {
  console.log('pictures');
  return (
    <Section>
      <SectionTitle
        title="Photos"
        subtitle="Photo gallery of presentation highlights."
      />
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {Object.entries(pictures).map(([key, p]) => (
          <ResponsiveImage name={key} key={key} picture={p} />
        ))}
        {/* <img className="photo" src={photo2} />
        <img className="photo" src={photo3} />
        <img className="photo sm:row-span-2 sm:col-span-2" src={photo4} />
        <img className="photo" src={photo5} />
        <img className="photo row-span-2 aspect-[3/4]" src={photo6} />
        <img className="photo" src={photo1} />
        <img className="photo" src={photo7} />
        <img className="photo" src={photo8} /> */}
      </div>
    </Section>
  );
}
