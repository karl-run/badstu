import * as R from 'remeda'
import type { BadstuDay, BadstuSlot } from '../types'
import { addDays, formatISO } from 'date-fns'
import { stringTimeToDecimalTime, decimalTimeToStringTime } from './utils'
import logger from '@badstu/logger'
import type { LebDayFetchPayload } from './types'

export async function getLebDropin(offset: number, days: number): Promise<BadstuDay[]> {
  const from = addDays(new Date(), offset)
  const dates = R.range(0, days)
    .map((it) => addDays(from, it))
    .map((it) => formatISO(it, { representation: 'date' }))

  logger.info(`Fetching days: ${dates.join(', ')} for LEB (${dates.length} days)`)

  const badstuDays: BadstuDay[] = []
  for (const date of dates) {
    const result = await getForDay(date)
    if (result) badstuDays.push(result)

    // Chill a bit
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 369))
  }

  return badstuDays
}

async function getForDay(date: string): Promise<BadstuDay | null> {
  const response = await fetch(`https://lilleborgelvebadstue.no/api/DayService?date=${date}`)

  if (!response.ok) {
    logger.error(`Failed to fetch LEB data for date ${date}, cause: ${response.status} ${response.statusText}`)

    return null
  }

  try {
    const result: LebDayFetchPayload = await response.json()

    return {
      locationKey: 'leb:lilleborg',
      provider: 'leb',
      date: date,
      slots: result.day.slots
        .filter((it) => !it.isForMembersOnly)
        .map((it): BadstuSlot => {
          const decimalTime = stringTimeToDecimalTime(it.startTime)
          const numberOfValidBookings = it.bookings
            .filter((booking) => booking.status === 'PAYMENT_COMPLETED')
            .flatMap((booking) => booking.spots.length)
            .reduce((acc, slots) => acc + slots, 0)

          return {
            size: it.totalSpots,
            length: 1.25,
            decimalTime: decimalTime,
            time: it.startTime,
            timeEnd: decimalTimeToStringTime(decimalTime + 1.25),
            available: it.totalSpots - numberOfValidBookings,
          }
        }),
      locationName: 'Lilleborg Elvebadstu',
    }
  } catch (e) {
    logger.error(`Failed to parse LEB data for date ${date}, cause: ${e}`)
    return null
  }
}
