import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  // SortingFn,
  type FilterFn,
  type ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import cx from 'clsx';
import {type ReactNode, useState} from 'react';
import talks from './talks';
import Section from './Section';
import SectionTitle from './SectionTitle';
import {Link} from './Link';
import {type Talk} from './talk-type';

const columnHelper = createColumnHelper<Talk>();
const isTruthy: FilterFn<any> = (row, columnId, filterValue) => {
  console.log('filterFn', row, columnId, filterValue);
  const value = row.getValue(columnId);
  return Boolean(value) === filterValue;
};

isTruthy.autoRemove = (value) => !value;

const isTruthyNotNone: FilterFn<any> = (row, columnId, filterValue) => {
  console.log('filterFn', row, columnId, filterValue);
  const value = row.getValue(columnId);
  return Boolean(value === 'none' ? false : value) === filterValue;
};

isTruthyNotNone.autoRemove = (value) => !value;

const filterLocation: FilterFn<Talk> = (
  row,
  columnId,
  filterValue: Set<string>,
) => {
  console.log('filterFn', row, columnId, filterValue);
  if (filterValue.size === 0) {
    return true;
  }

  const value: string = row.getValue(columnId);
  return value === 'Virtual'
    ? filterValue.has('virtual')
    : value.endsWith('USA')
    ? filterValue.has('north america')
    : filterValue.has('europe');
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
    filterFn: filterLocation,
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
    filterFn: isTruthyNotNone,
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
    filterFn: isTruthy,
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

export default function Talks() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // Const [thing, setThing] = useState('abc');

  const table = useReactTable({
    data: talks,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // DebugAll: true,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  });
  console.log('filters', columnFilters);
  console.log('filtered', table.getColumn('slides')?.getIsFiltered());
  console.log('canFilter', table.getColumn('slides')?.getCanFilter());
  console.log('filteredRows', table.getFilteredRowModel().rows);
  return (
    <Section id="talks">
      <SectionTitle
        title="Speaking engagements and videos"
        subtitle="All of my previous and planned future speaking experience"
      />
      <div className="flex flex-row justify-end gap-2">
        <CheckBox
          onCheckChanged={(checked) =>
            table.getColumn('slides')?.setFilterValue(checked)
          }
        >
          Slides
        </CheckBox>
        <CheckBox
          onCheckChanged={(checked) =>
            table.getColumn('video')?.setFilterValue(checked)
          }
        >
          Video
        </CheckBox>
        <CheckBox
          onCheckChanged={(checked) =>
            table
              .getColumn('location')
              ?.setFilterValue((old: Set<string> | undefined) => {
                console.log('old', old);
                const filters = old ?? new Set();
                if (checked) {
                  filters.add('virtual');
                } else {
                  filters.delete('virtual');
                }

                return filters;
              })
          }
        >
          Virtual
        </CheckBox>
        <CheckBox
          onCheckChanged={(checked) =>
            table
              .getColumn('location')
              ?.setFilterValue((old: Set<string> | undefined) => {
                console.log('old', old);
                const filters = old ?? new Set();
                if (checked) {
                  filters.add('north america');
                } else {
                  filters.delete('north america');
                }

                return filters;
              })
          }
        >
          North America
        </CheckBox>
        <CheckBox
          onCheckChanged={(checked) =>
            table
              .getColumn('location')
              ?.setFilterValue((old: Set<string> | undefined) => {
                console.log('old', old);
                const filters = old ?? new Set();
                if (checked) {
                  filters.add('europe');
                } else {
                  filters.delete('europe');
                }

                return filters;
              })
          }
        >
          Europe
        </CheckBox>
      </div>
      <div className="grid grid-cols-[0.75rem_1fr] sm:grid-cols-[0.75rem_1fr_1fr_1fr] md:grid-cols-[0.75rem_3fr_auto_1fr_auto] lg:grid-cols-[0.75rem_1fr_auto_auto_auto] gap-x-4 gap-y-1 text-secondary">
        {table.getFilteredRowModel().rows.map((row) =>
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
