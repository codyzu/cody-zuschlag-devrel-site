import {useEffect} from 'react';
import Section from './Section';
import SectionTitle from './SectionTitle';

export default function Tweets() {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.append(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <Section>
      <SectionTitle title="Recent tweets" />
      <div className="w-full">
        <a
          className="twitter-timeline"
          data-theme="dark"
          href="https://twitter.com/codyzus?ref_src=twsrc%5Etfw"
        >
          Tweets by codyzus
        </a>
      </div>
    </Section>
  );
}
