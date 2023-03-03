import {type Row} from '@tanstack/react-table';
import {type Talk} from './talk-type';

export type GlobalFilterFn = (row: Row<Talk>, columnId: string) => boolean;
