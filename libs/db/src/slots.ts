import { db } from './db'
import { availability } from './drizzle/schema'
import { eq } from 'drizzle-orm'
import { formatISO } from 'date-fns'

export async function getAllAvailabilityToday() {
  const today = formatISO(new Date(), { representation: 'date' })

  const results = await db.select().from(availability).where(eq(availability.date_string, today))

  return results.map((it) => ({
    key: it.location_key,
    date: it.date_string,
    updated: it.last_polled_at,
    slots: it.slots,
  }))
}
