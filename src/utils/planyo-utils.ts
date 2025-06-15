import * as R from 'remeda'
import { format, parseISO } from 'date-fns/fp'

const BOOKING_ROOT = 'https://minside.periode.no/booking/1cKim9HkbQPgrbXOr8ad/'

export function createClickableBookingLink(locationId: string, date: string) {
  const isoDate = R.pipe(date, parseISO, format('yyyy-MM-dd'))

  return `${BOOKING_ROOT}/${locationId}/${isoDate}`
}
