import { formatISO, parse } from 'date-fns';

export function toDateString(date: Date): string {
  return formatISO(date, { representation: 'date' });
}

export function dateAndTimeToDate(date: string, time: string): Date {
  return parse(`${date} ${time} +02`, 'yyyy-MM-dd HH:mm x', new Date());
}
