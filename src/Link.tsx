import {type ReactNode} from 'react';
import {track, parameters} from 'insights-js';

export function Link({
  icon,
  url,
  children,
}: {
  icon?: string;
  url: string;
  children: ReactNode;
}) {
  function nav() {
    if (import.meta.env.PROD) {
      console.log('click');
      track({
        id: 'nav',
        parameters: {
          url,
          screenType: parameters.screenType(),
          referrer: parameters.referrer(),
          locale: parameters.locale(),
        },
      });
      console.log('go');
    }
  }

  return (
    <a
      onClick={nav}
      href={url}
      className="link decoration-none inline-flex flex-row items-center gap-2"
    >
      {icon && <div className={icon} />}
      <div className="bg-gradient-link bg-clip-text text-transparent">
        {children}
      </div>
    </a>
  );
}
