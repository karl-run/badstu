import * as R from 'remeda';
import { formatISO } from 'date-fns';
import { parseISO, setHours, setMinutes, differenceInMinutes } from 'date-fns/fp';

export function toDateString(date: Date): string {
  return formatISO(date, { representation: 'date' });
}

export function doesBookableCollideWithDropin(day: string, dropin: string, bookable: string): boolean {
  const split = (time: string) => {
    const [hour, minute] = time.split(':');
    return { hour: +hour, minute: +minute };
  };

  const date = parseISO(day);
  const dropinTime = split(dropin);
  const bookableTime = split(bookable);

  const dropinDate = R.pipe(date, setMinutes(dropinTime.minute), setHours(dropinTime.hour));
  const bookableDate = R.pipe(date, setMinutes(bookableTime.minute), setHours(bookableTime.hour));

  return Math.max(0, differenceInMinutes(dropinDate, bookableDate)) < 90;
}
