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
    name: row.location_name,
    date: row.date_string,
    updated: row.last_polled_at,
    slots: row.slots.map((slot) => ({
      ...slot,
      variation: {
        key: row.location_key,
        text: variationTexts[row.location_key] ?? null,
      },
    })),
    provider: row.provider,
  }
}

const mapVariations = (location: ReturnType<typeof mapAvailabilityRow>[]) => {
  if (location.length === 1) return { ...location[0], variations: 1 }

  const first = location[0]
  const slotsByVariation = R.pipe(location, R.flatMap(R.prop('slots')), R.sortBy([(slot) => slot.time, 'asc']))
  const uniqueVariations = R.uniqueBy(slotsByVariation, (slot) => slot.variation)

  return {
    ...first,
    slots: slotsByVariation,
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
