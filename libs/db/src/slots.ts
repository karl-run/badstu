import * as R from 'remeda'
import { db } from './db'
import { availability } from './drizzle'
import { eq } from 'drizzle-orm'
import { formatISO, subDays } from 'date-fns'
import logger from '@badstu/logger'

export async function getAllAvailabilityToday() {
  const today = formatISO(new Date(), { representation: 'date' })

  logger.info(`Getting all availability for today: ${today}`)

  const results = await db.select().from(availability).where(eq(availability.date_string, today))
  const mapped = results.map((it) => ({
    key: it.location_key,
    name: it.location_name,
    date: it.date_string,
    updated: it.last_polled_at,
    slots: it.slots,
  }))

  const byPhysicalLocation = R.pipe(
    mapped,
    R.groupBy(R.prop('name')),
    R.mapValues((loc) => {
      if (loc.length === 1) return { ...loc[0], variations: 1 }

      const first = loc[0]
      const slotsWithVariations = R.pipe(
        loc,
        R.map((it) => it.slots.map((slot) => [slot, it.key] as const)),
        R.flat(),
        R.sortBy([([slot]) => slot.time, 'asc']),
        R.map(([slot, key]) => ({ ...slot, variation: variationTexts[key] ?? key })),
      )

      const uniqueVariations = R.uniqueBy(slotsWithVariations, (slot) => slot.variation)

      return {
        ...first,
        slots: slotsWithVariations,
        variations: uniqueVariations.length,
      }
    }),
  )

  return byPhysicalLocation
}

export const variationTexts: Record<string, string> = {
  'sagene-basseng': 'Badstu og basseng',
  'sagene-basseng-naken': 'Badstu og basseng, valgfri nakenhet',
  'sagene-badstu-naken': 'Kun badstu, valgfri nakenhet',
}
