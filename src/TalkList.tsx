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
import {type ReactNode, useState, useCallback, useEffect} from 'react';
import {
  create,
  insertBatch,
  search,
  type RetrievedDoc,
  type SearchResult,
} from '@lyrasearch/lyra';
import {useDebouncedCallback} from 'use-debounce';
import talks from './talks';
import Section from './Section';
import SectionTitle from './SectionTitle';
import {Link} from './Link';
import {type Talk} from './talk-type';

const columnHelper = createColumnHelper<Talk>();

type GlobalFilterFn = (row: Row<Talk>, columnId: string) => boolean;

const filter: FilterFn<Talk> = (
  row,
  columnId,
  filterValue: Set<GlobalFilterFn>,
) => {
  console.log('filter', {row, columnId, filterValue});
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
        className="hidden children:sibling:checked:bg-gradient-link sibling:checked:text-background"
      />
      <div className="rounded-lg p-[2px] bg-gradient-link">
        <div className="px-4 py-2 bg-background rounded-lg">{children}</div>
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
  filter: GlobalFilterFn;
  children: ReactNode;
}) {
  return (
    <CheckBox
      onCheckChanged={(checked) => {
        filterUpdater((old: Set<GlobalFilterFn>) => {
          console.log('update filters');
          const filters = new Set(old);
          if (checked) {
            filters.add(filter);
          } else {
            filters.delete(filter);
          }

          return filters;
        });
      }}
    >
      {children}
    </CheckBox>
  );
}

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

let indexReady = false;

export default function Talks() {
  // Const [searchResult, setSearchResult] = useState<
  //   SearchResult<{
  //     conference: 'string';
  //     name: 'string';
  //     location: 'string';
  //   }>
  // >();

  // Const isSearched = useCallback(
  //   (row: Row<Talk>) => {
  //     console.log('Searching', {row, searchResult});
  //     return (
  //       searchResult === undefined ||
  //       searchResult.hits.some((hit) => hit.document === row.original)
  //     );
  //   },
  //   [searchResult],
  // );

  const [globalFilter, setGlobalFilter] = useState<Set<GlobalFilterFn>>(
    new Set(),
  );

  const [searchFilter, setSearchFilter] = useState<GlobalFilterFn>();

  const [toggleFilters, setToggleFilters] = useState<Set<GlobalFilterFn>>(
    new Set(),
  );

  useEffect(() => {
    table.setGlobalFilter(
      new Set([searchFilter, ...toggleFilters].filter(Boolean)),
    );
  }, [searchFilter, toggleFilters]);

  const [searchString, setSearchString] = useState<string>('');

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

  const debouncedSetSearchString = useDebouncedCallback(
    async (value: string) => {
      if (value === '') {
        console.log('reset search result');
        setSearchFilter(undefined);
        // SetSearchResult(undefined);
        return;
      }

      await db;
      if (!indexReady) {
        console.log('create index');
        await insertBatch(await db, talks);
        indexReady = true;
      }

      const result = await search(await db, {
        term: value,
        properties: '*',
        // Tolerance does not seem compatible when deactivating the stemmer see: https://github.com/LyraSearch/lyra/issues/248
        // Tolerance: 1,
      });
      console.log('update search', result);
      setSearchFilter(
        () => (row: Row<Talk>) =>
          result.hits.some((hit) => hit.document === row.original),
      );
      // SetSearchResult(result);
    },
    500,
  );

  return (
    <Section id="talks">
      <SectionTitle
        title="Speaking engagements and videos"
        subtitle="All of my previous and planned future speaking experience"
      />
      <div className="flex flex-row justify-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-shrink-1">
            <div>
              <div className="i-lucide-search h-[1rem] w-[1rem]" /> Search
            </div>
            <div className="bg-gradient-link p-[2px] rounded-lg flex flex-grow-1 flex-shrink-1">
              <input
                className="text-background rounded-lg p2 bg-black text-primary outline-none flex-grow-1 flex-shrink-1"
                type="text"
                value={searchString}
                onChange={(event) => {
                  setSearchString(event.target.value);
                  void debouncedSetSearchString(event.target.value);
                }}
                placeholder="powered by Lyra"
              />
            </div>
          </div>
          <div className="flex flex-row justify-end gap-2 items-center flex-wrap">
            <div>
              <div className="i-lucide-filter text-white w-[1rem] h-[1rem]" />{' '}
              Filters
            </div>
            <ToggleFilter
              filterUpdater={setToggleFilters}
              filter={filterSlides}
            >
              Slides
            </ToggleFilter>
            <ToggleFilter filterUpdater={setToggleFilters} filter={filterVideo}>
              Video
            </ToggleFilter>
            <ToggleFilter
              filterUpdater={setToggleFilters}
              filter={filterVirtual}
            >
              Virtual
            </ToggleFilter>
            <ToggleFilter filterUpdater={setToggleFilters} filter={filterUsa}>
              USA
            </ToggleFilter>
            <ToggleFilter
              filterUpdater={setToggleFilters}
              filter={filterEurope}
            >
              Europe
            </ToggleFilter>
          </div>
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
