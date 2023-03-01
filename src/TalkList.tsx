import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type FilterFn,
  getFilteredRowModel,
  type Row,
} from '@tanstack/react-table';
import cx from 'clsx';
import {useState, useCallback, useEffect} from 'react';
import {create, insertBatch, search} from '@lyrasearch/lyra';
import talks from './talks';
import Section from './Section';
import SectionTitle from './SectionTitle';
import {Link} from './Link';
import {type Talk} from './talk-type';
import {Search} from './Search';
import {ToggleFilter} from './ToggleFilter';

const columnHelper = createColumnHelper<Talk>();

export type GlobalFilterFn = (row: Row<Talk>, columnId: string) => boolean;

const filter: FilterFn<Talk> = (
  row,
  columnId,
  filterValue: Set<GlobalFilterFn>,
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

const filterSlides: GlobalFilterFn = (row, columnId) =>
  columnId === 'slides' && row.getValue(columnId) !== undefined;

const filterVideo: GlobalFilterFn = (row, columnId) =>
  columnId === 'video' &&
  row.getValue(columnId) !== undefined &&
  row.getValue(columnId) !== 'none';

const filterUsa: GlobalFilterFn = (row, columnId) =>
  columnId === 'location' && row.getValue<string>(columnId).endsWith('USA');

const filterVirtual: GlobalFilterFn = (row, columnId) =>
  columnId === 'location' && row.getValue(columnId) === 'Virtual';

const filterEurope: GlobalFilterFn = (row, columnId) =>
  columnId === 'location' &&
  !row.getValue<string>(columnId).endsWith('USA') &&
  row.getValue(columnId) !== 'Virtual';

const db = create({
  schema: {
    conference: 'string',
    name: 'string',
    location: 'string',
  },
  components: {
    tokenizer: {
      enableStemming: false,
    },
  },
});

// Flag to indicate if the index has been lazy loaded
let indexReady = false;

export default function Talks() {
  const [globalFilter, setGlobalFilter] = useState<Set<GlobalFilterFn>>(
    new Set(),
  );

  const [searchFilter, setSearchFilter] = useState<GlobalFilterFn>();

  const [toggleFilters, setToggleFilters] = useState<Set<GlobalFilterFn>>(
    new Set(),
  );

  useEffect(() => {
    table.setGlobalFilter(
      // Create a new set (to trigger refresh) and remove any empty filters
      new Set([searchFilter, ...toggleFilters].filter(Boolean)),
    );
  }, [searchFilter, toggleFilters]);

  const table = useReactTable({
    data: talks,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getColumnCanGlobalFilter: () => true,
    globalFilterFn: filter,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const onSearch = useCallback(
    async (value: string) => {
      if (value === '') {
        setSearchFilter(undefined);
        return;
      }

      // Lazy load the index on the first search
      if (!indexReady) {
        await insertBatch(await db, talks);
        indexReady = true;
      }

      const result = await search(await db, {
        term: value,
        properties: '*',
        // Tolerance does not seem compatible when deactivating the stemmer see: https://github.com/LyraSearch/lyra/issues/248
        // Tolerance: 1,
      });

      setSearchFilter(
        () => (row: Row<Talk>) =>
          result.hits.some((hit) => hit.document === row.original),
      );
    },
    [setSearchFilter],
  );

  return (
    <Section id="talks">
      <SectionTitle
        title="Speaking engagements and videos"
        subtitle="All of my previous and planned future speaking experience"
      />
      <div className="grid grid-cols-[auto_auto] gap-2 items-center justify-end">
        <div className="i-lucide-search h-[2rem] w-[2rem]" />
        <div className="bg-gradient-link p-[2px] rounded-lg flex flex-grow-1 flex-shrink-1">
          <Search onSearch={onSearch} />
        </div>
        <div className="i-lucide-filter w-[2rem] h-[2rem]" />
        <div className="flex flex-row gap-2 flex-wrap">
          <ToggleFilter filterUpdater={setToggleFilters} filter={filterSlides}>
            Slides
          </ToggleFilter>
          <ToggleFilter filterUpdater={setToggleFilters} filter={filterVideo}>
            Video
          </ToggleFilter>
          <ToggleFilter filterUpdater={setToggleFilters} filter={filterVirtual}>
            Virtual
          </ToggleFilter>
          <ToggleFilter filterUpdater={setToggleFilters} filter={filterUsa}>
            USA
          </ToggleFilter>
          <ToggleFilter filterUpdater={setToggleFilters} filter={filterEurope}>
            Europe
          </ToggleFilter>
        </div>
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
