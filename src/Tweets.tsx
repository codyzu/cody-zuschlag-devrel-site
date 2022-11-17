import {useEffect} from 'react';
import {Row, Col} from 'reactstrap';
import cx from 'clsx';
import heroClasses from './hero.module.css';

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
    <Row
      className={cx(
        'flex-lg-row-reverse align-items-center mb-5 p-5 mx-3 rounded',
        heroClasses.whiteShadow,
      )}
    >
      <Col className="align-self-start">
        <Row className="mb-3">
          <Col>
            <h1 className="display-5 fw-bold lh-1">Recent tweets</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <a
              className="twitter-timeline"
              data-theme="dark"
              href="https://twitter.com/codyzus?ref_src=twsrc%5Etfw"
            >
              Tweets by codyzus
            </a>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
