import { formatISO } from 'date-fns';
import { parse } from 'date-fns';

export function toDateString(date: Date): string {
  return formatISO(date, { representation: 'date' });
}

export function dateAndTimeToDate(date: string, time: string): Date {
  return parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
}
