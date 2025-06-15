import * as R from 'remeda'
import { differenceInMinutes, parseISO, setHours, setMinutes } from 'date-fns/fp'
import { flow } from 'fp-ts/function'
import { last, map, sort } from 'fp-ts/Array'
import { Ord } from 'fp-ts/Date'
import { Option } from 'fp-ts/Option'

import { ExtractedDay } from '@/scraping/types'

export const privateToDropInCollissions =
  (privates: ExtractedDay[]) =>
  (date: string, time: string): boolean => {
    return (
      privates.find((privateDay) => {
        if (privateDay.date !== date) return false

        return R.keys(privateDay.times).some((fullbookableTime) =>
          doesBookableCollideWithDropin(date, time, fullbookableTime),
        )
      }) != null
    )
  }

export function doesBookableCollideWithDropin(day: string, dropin: string, bookable: string): boolean {
  const split = (time: string) => {
    const [hour, minute] = time.split(':')
    return { hour: +hour, minute: +minute }
  }

  const date = parseISO(day)
  const dropinTime = split(dropin)
  const bookableTime = split(bookable)

  const dropinDate = R.pipe(date, setMinutes(dropinTime.minute), setHours(dropinTime.hour))
  const bookableDate = R.pipe(date, setMinutes(bookableTime.minute), setHours(bookableTime.hour))

  return Math.max(0, differenceInMinutes(dropinDate, bookableDate)) < 90
}

export const daysToLatestDate: (days: ExtractedDay[]) => Option<Date> = flow(
  map((it) => it.date),
  map(parseISO),
  sort(Ord),
  last,
)
