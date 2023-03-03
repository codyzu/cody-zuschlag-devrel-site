import {type GlobalFilterFn} from './filter-type';

/* eslint-disable @typescript-eslint/naming-convention */
const Slides: GlobalFilterFn = (row, columnId) =>
  columnId === 'slides' && row.getValue(columnId) !== undefined;

const Video: GlobalFilterFn = (row, columnId) =>
  columnId === 'video' &&
  row.getValue(columnId) !== undefined &&
  row.getValue(columnId) !== 'none';

const USA: GlobalFilterFn = (row, columnId) =>
  columnId === 'location' && row.getValue<string>(columnId).endsWith('USA');

const Virtual: GlobalFilterFn = (row, columnId) =>
  columnId === 'location' && row.getValue(columnId) === 'Virtual';

const Europe: GlobalFilterFn = (row, columnId) =>
  columnId === 'location' &&
  !row.getValue<string>(columnId).endsWith('USA') &&
  row.getValue(columnId) !== 'Virtual';
/* eslint-enable @typescript-eslint/naming-convention */

export const filters = [Video, Slides, USA, Europe, Virtual];
