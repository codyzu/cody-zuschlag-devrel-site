import cx from 'clsx';
import {type Talk as TalkDef} from './talk-type';
import Button from './Button';

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
        <div className="w-auto flex flex-col items-stretch lt-sm:ml-7 text-secondary gap-2 sm:w-full">
          {talk.video === 'none' ? (
            <Button icon="i-lucide-video-off" active={false}>
              Not recorded
            </Button>
          ) : talk.video ? (
            <Button icon="i-lucide-video" url={talk.video}>
              Watch now
            </Button>
          ) : (
            <Button icon="i-lucide-timer" active={false}>
              Coming soon
            </Button>
          )}
          {talk.slides && (
            <Button icon="i-lucide-monitor" url={talk.slides}>
              Slides
            </Button>
          )}
          {talk.repo && (
            <Button icon="i-lucide-github" url={talk.repo}>
              GitHub repo
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
