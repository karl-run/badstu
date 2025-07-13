import * as R from 'remeda'
import { db } from './db'
import { availability } from './drizzle'
import { gte, and, eq } from 'drizzle-orm'
import { formatISO } from 'date-fns'
import logger from '@badstu/logger'
import { type AllLocationNames } from '@badstu/data/meta'

function mapAvailabilityRow(row: typeof availability.$inferSelect) {
  return {
    key: row.location_key,
    variation: variationTexts[row.location_key] ?? null,
    name: row.location_name,
    date: row.date_string,
    updated: row.last_polled_at,
    slots: row.slots,
  }
}

const mapVariations = (location: ReturnType<typeof mapAvailabilityRow>[]) => {
  if (location.length === 1) return { ...location[0], variations: 1 }

  const first = location[0]
  const slotsWithVariations = R.pipe(
    location,
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
}

export async function getAllAvailabilityToday() {
  const today = formatISO(new Date(), { representation: 'date' })

  logger.info(`Getting all availability for today: ${today}`)

  const availabilityRows = await db.select().from(availability).where(eq(availability.date_string, today))

  return R.pipe(
    availabilityRows,
    R.map(mapAvailabilityRow),
    R.groupBy((it) => it.name as AllLocationNames),
    R.mapValues(mapVariations),
  )
}

export async function getAllAvailabilityForLocation(locationName: AllLocationNames) {
  const today = formatISO(new Date(), { representation: 'date' })

  logger.info(`Getting all availability for ${locationName} today: ${today}`)

  const availabilityRows = await db
    .select()
    .from(availability)
    .where(and(eq(availability.location_name, locationName), gte(availability.date_string, today)))

  const byDate = R.pipe(
    availabilityRows,
    R.map(mapAvailabilityRow),
    R.groupBy((it) => it.date),
    R.mapValues(mapVariations),
  )

  return byDate
}

export const variationTexts: Record<string, string> = {
  'sagene-basseng': 'Badstu og basseng',
  'sagene-basseng-naken': 'Badstu og basseng, valgfri nakenhet',
  'sagene-badstu-naken': 'Kun badstu, valgfri nakenhet',
  'kroloftet-svarttrosten': 'Svarttrosten',
  'kroloftet-svarttrosten-naken': 'Nakenbadstu',
  'kroloftet-svarttrosten-naken-kvinner': 'Nakenbadstu (kvinner)',
  'kroloftet-jurten': 'Jurten',
}
