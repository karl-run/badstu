import { formatISO } from 'date-fns';

export function toDateString(date: Date): string {
  return formatISO(date, { representation: 'date' });
}
