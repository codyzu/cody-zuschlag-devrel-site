import {type Talk as TalkDef} from './talk-type';
import {Link} from './Link';

type Props = {
  talk: TalkDef;
};

export default function Talk({talk}: Props) {
  return (
    <>
      <div className="mt-6 text-2xl mb-2">{talk.conference}</div>
      <div className="ml-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-gray gap-4">
        <div>{talk.name}</div>
        <div>{new Date(talk.date).toLocaleDateString()}</div>
        <div>{talk.location}</div>
        <div className="flex flex-col items-start">
          {talk.video === 'none' ? null : talk.video ? (
            <Link icon="i-lucide-video" url={talk.video}>
              Watch now
            </Link>
          ) : (
            <div className="bg-blue-600 text-black rounded-full px-2">
              Video coming soon
            </div>
          )}
          {talk.slides && (
            <Link icon="i-lucide-monitor" url={talk.slides}>
              Slides
            </Link>
          )}
          {talk.repo && (
            <Link icon="i-lucide-github" url={talk.repo}>
              GitHub repo
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
