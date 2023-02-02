import cx from 'clsx';
import coverClasses from './cover.module.css';

// @ts-expect-error ts doesn't know about the vite plugin syntax
import bgImageAvif from './images/reactsummit_closeup.jpeg?format=avif&width=600;800;1200;1600&srcset=true';
// @ts-expect-error ts doesn't know about the vite plugin syntax
import bgImageWebP from './images/reactsummit_closeup.jpeg?format=webp&width=600;800;1200;1600&srcset=true';
// @ts-expect-error ts doesn't know about the vite plugin syntax
import bgImageJpeg from './images/reactsummit_closeup.jpeg?format=jpeg&width=600;800;1200;1600&srcset=true';
// @ts-expect-error ts doesn't know about the vite plugin syntax
import bgImageFallback from './images/reactsummit_closeup.jpeg?width=12';

console.log('bg', bgImageAvif, bgImageWebP, bgImageJpeg);

export default function Hero() {
  return (
    <div
      className={cx(
        coverClasses.funky,
        'w-screen h-screen overflow-hidden text-center flex justify-center max-w-full bg-black bg-top bg-cover',
      )}
    >
      <picture className="absolute inset-0 w-full h-full object-cover">
        <source srcSet={bgImageAvif as string} type="image/avif" />
        <source srcSet={bgImageWebP as string} type="image/webp" />
        <source srcSet={bgImageJpeg as string} type="image/avif" />
        <img
          src={bgImageFallback as string}
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-expect-error react is not typed for this
          fetchPriority="high"
        />
      </picture>
      <div className="absolute inset-0 w-full h-full bg-hex-00000067" />
      <h1 className="fw-bold inline-flex flex-col items-center self-center text-7xl leading-tight">
        <span>Cody</span>
        <span>Zuschlag</span>
      </h1>
    </div>
  );
}
