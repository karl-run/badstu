import { format, parseISO } from 'date-fns'
import { nb } from 'date-fns/locale'

export function toReadableDateWithWeekdayName(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, 'do LLLL (EEEE)', { locale: nb })
}
