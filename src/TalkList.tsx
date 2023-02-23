import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import cx from 'clsx';
import Talk from './Talk';
import talks from './talks';
import Section from './Section';
import SectionTitle from './SectionTitle';
import {Link} from './Link';
import type TalkType from './talk-type';

const columnHelper = createColumnHelper<TalkType>();
const defaultColumns = [
  columnHelper.accessor('conference', {
    cell: (cell) => (
      <div className="text-2xl col-span-2 sm:col-span-5 mt-3 first:mt-0 text-primary">
        {cell.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('name', {
    cell: (cell) => (
      <div className="text-secondary col-start-2 sm:col-start-2 sm:col-span-2 md:col-start-2 md:col-span-1 md:row-span-3">
        {cell.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('date', {
    cell: (cell) => (
      <div className="text-secondary col-start-2 sm:col-start-4 md:col-start-3">
        {new Date(cell.getValue()).toLocaleDateString()}
      </div>
    ),
  }),
  columnHelper.accessor('location', {
    cell: (cell) => (
      <div className="text-secondary col-start-2 sm:col-span-2 md:col-span-1 sm:col-start-2 md:col-start-4 md:row-span-3">
        <div className="flex flex-row items-center gap-2">
          <div
            className={cx(
              cell.row.original.flag ?? 'i-lucide-globe text-primary',
              'min-w-[1rem] min-h-[1rem]',
            )}
          />
          <div>{cell.getValue()}</div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('video', {
    cell: (cell) => (
      <div className="col-start-2 md:col-start-5">
        {cell.getValue() === 'none' ? (
          <Link icon="i-lucide-video-off text-lg" active={false}>
            Not recorded
          </Link>
        ) : cell.getValue() ? (
          <Link icon="i-lucide-video text-lg" url={cell.getValue()}>
            <div className="">Watch now</div>
          </Link>
        ) : (
          <Link icon="i-lucide-timer text-lg" active={false}>
            Coming soon
          </Link>
        )}
      </div>
    ),
  }),
  columnHelper.accessor('slides', {
    cell: (cell) =>
      cell.getValue() && (
        <div className="col-start-2 sm:col-start-3 md:col-start-5">
          <Link icon="i-lucide-monitor text-lg" url={cell.getValue()}>
            Slides
          </Link>
        </div>
      ),
  }),
  columnHelper.accessor('repo', {
    cell: (cell) =>
      cell.getValue() && (
        <div className="col-start-2 sm:col-start-4 md:col-start-5">
          <Link icon="i-lucide-github text-lg" url={cell.getValue()}>
            GitHub repo
          </Link>
        </div>
      ),
  }),
];

export default function Talks() {
  const table = useReactTable({
    data: talks,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    debugAll: true,
  });
  return (
    <Section id="talks">
      <SectionTitle
        title="Speaking engagements and videos"
        subtitle="All of my previous and planned future speaking experience"
      />
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] md:grid-cols-[3fr_auto_1fr_auto] lg:grid-cols-[1fr_auto_auto_auto] gap-y-1 gap-x-4">
        {talks.map((talk) => (
          <Talk key={`${talk.name}-${talk.date}`} talk={talk} />
        ))}
      </div>
      <div className="grid grid-cols-[0.75rem_1fr] sm:grid-cols-[0.75rem_1fr_1fr_1fr] md:grid-cols-[0.75rem_3fr_auto_1fr_auto] lg:grid-cols-[0.75rem_1fr_auto_auto_auto] gap-x-4 gap-y-1 text-secondary">
        {table
          .getRowModel()
          .rows.map((row) =>
            row
              .getVisibleCells()
              .map((cell) =>
                flexRender(cell.column.columnDef.cell, cell.getContext()),
              ),
          )}
      </div>
    </Section>
  );
}
