import cx from 'clsx';
import {useEffect} from 'react';
import coverClasses from './cover.module.css';
import About from './About';
import Socials from './Socials';
import TalkList from './TalkList';
import ArticleList from './ArticleList';
import Location from './Location';
import Tweets from './Tweets';
import Photos from './Photos';

export default function Home() {
  // https://stackoverflow.com/a/72494010
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, []);

  return (
    <div className="font-sans text-primary break-words">
      <div
        className={cx(
          coverClasses.funky,
          'w-screen h-screen overflow-hidden text-center flex justify-center max-w-full bg-black bg-cover-faded bg-top bg-cover',
        )}
      >
        <h1 className="fw-bold inline-flex flex-col items-center self-center text-7xl leading-tight">
          <span>Cody</span>
          <span>Zuschlag</span>
        </h1>
      </div>

      <div className="mt-12 container max-w-screen-xl mx-auto">
        <About />
        <Photos />
        <Socials />
        <TalkList />
        <ArticleList />
        <Location />
        <Tweets />
      </div>
    </div>
  );
}
