import cx from 'clsx';
import {type Talk as TalkDef} from './talk-type';
import {Link} from './Link';

type Props = {
  talk: TalkDef;
};

export default function Talk({talk}: Props) {
  return (
    <>
      <div className="text-2xl sm:col-span-2 md:col-span-4 mt-4 first:mt-0">
        {talk.conference}
      </div>
      <div className="ml-7 text-secondary">{talk.name}</div>
      <div className="lt-sm:ml-7 text-secondary">
        {new Date(talk.date).toLocaleDateString()}
      </div>
      <div className="lt-md:ml-7 text-secondary">
        <div className="flex flex-row items-center gap-2">
          <div
            className={cx(
              talk.flag ?? 'i-lucide-globe text-primary',
              'min-w-[1rem] min-h-[1rem]',
            )}
          />
          <div>{talk.location}</div>
        </div>
      </div>
      <div className="flex">
        <div className="w-auto flex flex-col items-start lt-sm:ml-7 text-secondary">
          {talk.video === 'none' ? (
            <Link icon="i-lucide-video-off text-lg" active={false}>
              Not recorded
            </Link>
          ) : talk.video ? (
            <Link icon="i-lucide-video text-lg" url={talk.video}>
              <div className="">Watch now</div>
            </Link>
          ) : (
            <Link icon="i-lucide-timer text-lg" active={false}>
              Coming soon
            </Link>
          )}
          {talk.slides && (
            <Link icon="i-lucide-monitor text-lg" url={talk.slides}>
              Slides
            </Link>
          )}
          {talk.repo && (
            <Link icon="i-lucide-github text-lg" url={talk.repo}>
              GitHub repo
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
