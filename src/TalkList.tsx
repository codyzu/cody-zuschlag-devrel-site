import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type FilterFn,
  getFilteredRowModel,
  type Row,
  type Updater,
} from '@tanstack/react-table';
import cx from 'clsx';
import {type ReactNode, useState} from 'react';
import talks from './talks';
import Section from './Section';
import SectionTitle from './SectionTitle';
import {Link} from './Link';
import {type Talk} from './talk-type';

const columnHelper = createColumnHelper<Talk>();

const filter: FilterFn<Talk> = (
  row,
  columnId,
  filterValue: Set<(row: Row<Talk>, columnId: string) => boolean>,
) => {
  if (filterValue.size === 0) {
    return true;
  }

  for (const cellFilter of filterValue) {
    if (cellFilter(row, columnId)) {
      return true;
    }
  }

  return false;
};

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
    filterFn(row: Row<Talk>, columnId: string, filterValue: boolean) {
      if (filterValue) {
        return (
          row.getValue(columnId) !== undefined &&
          row.getValue(columnId) !== 'none'
        );
      }

      return true;
    },
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

function CheckBox({
  onCheckChanged,
  children,
}: {
  onCheckChanged: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label>
      <input
        type="checkbox"
        onChange={(event) => {
          onCheckChanged(event.target.checked);
        }}
        className="hidden sibling:checked:bg-highlight sibling:checked:text-background"
      />
      <div className="rounded-lg px-4 py-2 border-highlight border-2">
        {children}
      </div>
    </label>
  );
}

function ToggleFilter({
  filterUpdater,
  filter,
  children,
}: {
  filterUpdater: (updater: Updater<any>) => void;
  filter: (row: Row<Talk>, columnId: string) => boolean;
  children: ReactNode;
}) {
  return (
    <CheckBox
      onCheckChanged={(checked) => {
        filterUpdater(
          (old: Set<(row: Row<Talk>, columnId: string) => boolean>) => {
            console.log('update filters');
            const filters = new Set(old);
            if (checked) {
              filters.add(filter);
            } else {
              filters.delete(filter);
            }

            return filters;
          },
        );
      }}
    >
      {children}
    </CheckBox>
  );
}

const filterSlides: (row: Row<Talk>, columnId: string) => boolean = (
  row,
  columnId,
) => columnId === 'slides' && row.getValue(columnId) !== undefined;

const filterVideo: (row: Row<Talk>, columnId: string) => boolean = (
  row,
  columnId,
) =>
  columnId === 'video' &&
  row.getValue(columnId) !== undefined &&
  row.getValue(columnId) !== 'none';

const filterUsa: (row: Row<Talk>, columnId: string) => boolean = (
  row,
  columnId,
) => columnId === 'location' && row.getValue<string>(columnId).endsWith('USA');

const filterVirtual: (row: Row<Talk>, columnId: string) => boolean = (
  row,
  columnId,
) => columnId === 'location' && row.getValue(columnId) === 'Virtual';

const filterEurope: (row: Row<Talk>, columnId: string) => boolean = (
  row,
  columnId,
) =>
  columnId === 'location' &&
  !row.getValue<string>(columnId).endsWith('USA') &&
  row.getValue(columnId) !== 'Virtual';

export default function Talks() {
  const [globalFilter, setGlobalFilter] = useState<
    Set<(row: Row<Talk>, columnId: string) => boolean>
  >(new Set<(row: Row<Talk>, columnId: string) => boolean>());

  const table = useReactTable({
    data: talks,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filter,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  console.log('global', globalFilter);
  return (
    <Section id="talks">
      <SectionTitle
        title="Speaking engagements and videos"
        subtitle="All of my previous and planned future speaking experience"
      />
      <div className="flex flex-row justify-end gap-2">
        <ToggleFilter
          filterUpdater={table.setGlobalFilter}
          filter={filterSlides}
        >
          Slides
        </ToggleFilter>
        <ToggleFilter
          filterUpdater={table.setGlobalFilter}
          filter={filterVideo}
        >
          Video
        </ToggleFilter>
        <ToggleFilter
          filterUpdater={table.setGlobalFilter}
          filter={filterVirtual}
        >
          Virtual
        </ToggleFilter>
        <ToggleFilter filterUpdater={table.setGlobalFilter} filter={filterUsa}>
          USA
        </ToggleFilter>
        <ToggleFilter
          filterUpdater={table.setGlobalFilter}
          filter={filterEurope}
        >
          Europe
        </ToggleFilter>
      </div>
      <div className="grid grid-cols-[0.75rem_1fr] sm:grid-cols-[0.75rem_1fr_1fr_1fr] md:grid-cols-[0.75rem_3fr_auto_1fr_auto] lg:grid-cols-[0.75rem_1fr_auto_auto_auto] gap-x-4 gap-y-1 text-secondary">
        {table.getRowModel().rows.map((row) =>
          row.getVisibleCells().map((cell) => (
            <div key={`r${row.id}c${cell.id}`} className="contents">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          )),
        )}
      </div>
    </Section>
  );
}
