import {formatDate} from '../format-date.ts';

/**
An absolute scheduled date remains factual between static builds.
*/
export function formatTalkDate(date: string, now: number): string {
  const prefix = new Date(date).getTime() > now ? 'Scheduled for ' : '';
  return `${prefix}${formatDate(date)}`;
}
