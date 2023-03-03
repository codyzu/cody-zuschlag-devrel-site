import {type Row} from '@tanstack/react-table';
import {type Talk} from './talk-type';

export type TalkFilterFn = (row: Row<Talk>, columnId: string) => boolean;

type Filter = {
  filterFn: TalkFilterFn;
  label: string;
};

// These will be rendered as toggle filters below the search box
export const filters: Filter[] = [
  {
    label: 'Video',
    filterFn: (row, columnId) =>
      columnId === 'video' &&
      row.getValue(columnId) !== undefined &&
      row.getValue(columnId) !== 'none',
  },
  {
    label: 'Slides',
    filterFn: (row, columnId) =>
      columnId === 'slides' && row.getValue(columnId) !== undefined,
  },
  {
    label: 'USA',
    filterFn: (row, columnId) =>
      columnId === 'location' && row.getValue<string>(columnId).endsWith('USA'),
  },
  {
    label: 'Europe',
    filterFn: (row, columnId) =>
      columnId === 'location' &&
      !row.getValue<string>(columnId).endsWith('USA') &&
      row.getValue(columnId) !== 'Virtual',
  },
  {
    label: 'Virtual',
    filterFn: (row, columnId) =>
      columnId === 'location' && row.getValue(columnId) === 'Virtual',
  },
];
