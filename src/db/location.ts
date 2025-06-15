import * as R from 'remeda'

import db from '@/db/db'
import { AvailabilityMap, ExtractedDay } from '@/scraping/types'
import { Location, validateLocation } from '@/scraping/metadata'
import { unsafeFirst } from '@/utils/R'
import { locations } from '@/db/schema'

export async function upsertLocation(
  name: Location,
  days?: ExtractedDay[],
  privateDays?: ExtractedDay[],
): Promise<void> {
  const now = new Date()
  await db
    .insert(locations)
    .values({
      name,
      dropins_polled_at: days ? now : undefined,
      dropins: days,
      private: privateDays,
      private_polled_at: privateDays ? now : undefined,
    })
    .onConflictDoUpdate({
      target: locations.name,
      set: {
        dropins_polled_at: days ? now : undefined,
        dropins: days,
        private: privateDays,
        private_polled_at: privateDays ? now : undefined,
      },
    })
}

export async function getLocation(name: string) {
  const location = await db.query.locations.findFirst({
    where: (locations, { eq }) => eq(locations.name, name),
  })

  if (location == null) {
    console.warn(`Someone looked up location ${name}, and it was null. That's weird.`)
  }

  return location
}
