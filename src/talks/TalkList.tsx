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
import Section from '../Section';
import SectionTitle from '../SectionTitle';
import {Link} from '../Link';
import talks from './talks';
import {type Talk} from './talk-type';
import {Search} from './Search';
import {ToggleFilter} from './ToggleFilter';
import {createTalkSearch} from './search-talks';
import {filters as talkFilters, type TalkFilterFn} from './filters';

const columnHelper = createColumnHelper<Talk>();

const filterTalks: FilterFn<Talk> = (
  row,
  columnId,
  filterSet: Set<TalkFilterFn>,
) => {
  // No filters, return true for every value
  if (filterSet.size === 0) {
    return true;
  }

  // Test each filter until one returns true
  for (const cellFilter of filterSet) {
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
    cell(cell) {
      const video = cell.getValue();

      return (
        <div className="col-start-2 md:col-start-5">
          {video === 'none' ? (
            <Link icon="i-lucide-video-off text-lg" active={false}>
              Not recorded
            </Link>
          ) : video === undefined ? (
            <Link icon="i-lucide-timer text-lg" active={false}>
              Coming soon
            </Link>
          ) : (
            <Link icon="i-lucide-video text-lg" url={cell.getValue()}>
              <div className="">Watch now</div>
            </Link>
          )}
        </div>
      );
    },
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

const searchTalks = createTalkSearch(talks);

export default function Talks() {
  const [globalFilter, setGlobalFilter] = useState<Set<TalkFilterFn>>(
    new Set(),
  );

  const [searchFilter, setSearchFilter] = useState<TalkFilterFn>();

  const [toggleFilters, setToggleFilters] = useState<Set<TalkFilterFn>>(
    new Set(),
  );

  // Given a filter, create a onCheckedChanged handler for a ToggleFilter
  const toggleFilterOnChangedFactory = useCallback(
    (filter: TalkFilterFn) => (checked: boolean) => {
      setToggleFilters((old: Set<TalkFilterFn>) => {
        // Create a new Set in order to ensure a new render is triggered
        const filters = new Set(old);

        // Add or deleted the filter to the set
        if (checked) {
          filters.add(filter);
        } else {
          filters.delete(filter);
        }

        return filters;
      });
    },
    [setToggleFilters],
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
    globalFilterFn: filterTalks,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const onSearch = useCallback(
    async (value: string) => {
      // Clear the search filter when the search string is empty
      if (value === '') {
        setSearchFilter(undefined);
        return;
      }

      const searchHits = await searchTalks(value);

      setSearchFilter(
        () => (row: Row<Talk>) =>
          searchHits.some((hit) => hit.document === row.original),
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
        <div className="col-span-2 flex flex-grow-1 flex-shrink-1">
          <Search onSearch={onSearch} />
        </div>
        <div className="i-lucide-filter w-[2rem] h-[2rem] row-start-2" />
        <div className="flex flex-row gap-2 flex-wrap">
          {talkFilters.map(({label, filterFn}) => (
            <ToggleFilter
              key={label}
              onCheckChanged={toggleFilterOnChangedFactory(filterFn)}
            >
              {label}
            </ToggleFilter>
          ))}
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
