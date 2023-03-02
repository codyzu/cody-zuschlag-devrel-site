import cx from 'clsx';
import {track, parameters} from 'insights-js';
import {type ReactNode} from 'react';

export function Link({
  icon,
  children,
  url = '',
  active = true,
}: {
  icon?: string;
  children: ReactNode;
  url?: string;
  active?: boolean;
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

  const Wrapper = active
    ? ({children: anchorChildren}: {children: ReactNode}) => (
        <a
          href={url}
          onClick={nav}
          className="outline-none focus:border-b-2 focus:border-b-white"
        >
          {anchorChildren}
        </a>
      )
    : ({children: divChildren}: {children: ReactNode}) => (
        <div>{divChildren}</div>
      );

  return (
    <Wrapper>
      <div className="inline-flex flex-row gap-2 items-center rounded-full">
        {icon && <div className={cx(active && 'text-highlight', icon)} />}
        <div
          className={cx(
            active && 'bg-gradient-link bg-clip-text text-transparent',
          )}
        >
          {children}
        </div>
      </div>
    </Wrapper>
  );
}
