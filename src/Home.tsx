import cx from 'clsx';
import {useEffect} from 'react';
import coverClasses from './cover.module.css';
import About from './About';
import Socials from './Socials';
import TalkList from './TalkList';
import ArticleList from './ArticleList';
import Location from './Location';
import Tweets from './Tweets';

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
    <>
      <div
        className={cx(
          coverClasses.funky,
          // CoverClasses.hero,
          "vw-100 vh-100 overflow-hidden text-center d-flex justify-content-center mw-100 bg-black cover top bg-[url('./images/background.jpeg')]",
        )}
      >
        <h1 className="fw-bold d-inline-flex flex-column align-items-center align-self-center">
          <span>Cody</span>
          <span>Zuschlag</span>
        </h1>
      </div>

      <div className="mt-5 container max-w-screen-xl mx-auto">
        <About />
        <Socials />
        <TalkList />
        <ArticleList />
        <Location />
        <Tweets />
      </div>
    </>
  );
}
