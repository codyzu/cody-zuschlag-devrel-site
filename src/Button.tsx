import cx from 'clsx';
import {track, parameters} from 'insights-js';
import {type ReactNode} from 'react';

export default function Button({
  icon,
  children,
  url = '',
  active = true,
}: {
  icon: string;
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
        <a href={url} onClick={nav}>
          {anchorChildren}
        </a>
      )
    : ({children: divChildren}: {children: ReactNode}) => (
        <div>{divChildren}</div>
      );

  return (
    <Wrapper>
      <div className="flex flex-col items-stretch p-[2px] rounded-full bg-gradient-link">
        <div
          className={cx(
            'inline-flex flex-row gap-2 items-center border-2 border-background rounded-full px-2',
            active && 'text-background',
            active ? 'bg-gradient-link' : 'bg-background',
          )}
        >
          <div className={cx('text-lg', icon)} />
          {children}
        </div>
      </div>
    </Wrapper>
  );
}
