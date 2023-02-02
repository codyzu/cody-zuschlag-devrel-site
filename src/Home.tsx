import {useEffect} from 'react';
import About from './About';
import Socials from './Socials';
import TalkList from './TalkList';
import ArticleList from './ArticleList';
import Location from './Location';
import Tweets from './Tweets';
import Photos from './Photos';
import Hero from './Hero';

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
      <Hero />
      <div className="mt-12 container max-w-screen-xl mx-auto">
        <About />
        <Socials />
        <TalkList />
        <ArticleList />
        <Location />
        <Photos />
        <Tweets />
      </div>
    </div>
  );
}
