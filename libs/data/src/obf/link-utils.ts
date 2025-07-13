import * as R from 'remeda'
import { format, parseISO } from 'date-fns/fp'
import { ObfLocations, obfLocations } from './locations'

const BOOKING_ROOT = 'https://minside.periode.no/booking/1cKim9HkbQPgrbXOr8ad'

export function toObfLink(locationKey: string, date: string) {
  if (!isValidObfKey(locationKey)) {
    console.error('Invalid location key provided:', locationKey)
    return ''
  }

  const locationLinkId = obfLocations[locationKey].dropin
  const isoDate = R.pipe(date, parseISO, format('yyyy-MM-dd'))

  return `${BOOKING_ROOT}/${locationLinkId}/${isoDate}`
}

function isValidObfKey(key: string): key is ObfLocations {
  return Object.keys(obfLocations).includes(key)
}
