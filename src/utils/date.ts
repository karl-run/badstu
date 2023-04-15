import { format, formatISO, getDay, parse, parseISO } from "date-fns";
import { nb } from 'date-fns/locale';

export function toDateString(date: Date): string {
  return formatISO(date, { representation: 'date' });
}

export function dateAndTimeToDate(date: string, time: string): Date {
  return parse(`${date} ${time} +02`, 'yyyy-MM-dd HH:mm x', new Date());
}

export function toReadableDateWithWeekdayName(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'do LLLL (EEEE)', { locale: nb });
}

export function getDayCorrect(date: Date) {
  return (getDay(date) + 6) % 7
}
