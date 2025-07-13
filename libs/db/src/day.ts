import type { BadstuDay } from '@badstu/data'
import { availability, db } from './drizzle'
import { parseISO, setHours } from 'date-fns'

export async function saveDay(day: BadstuDay): Promise<void> {
  await db
    .insert(availability)
    .values({
      location_key: day.locationKey,
      location_name: day.locationName,
      date_string: day.date,
      date: setHours(parseISO(day.date), 12),
      last_polled_at: new Date(),
      slots: day.slots,
    })
    .onConflictDoUpdate({
      target: [availability.location_key, availability.date],
      set: {
        last_polled_at: new Date(),
        slots: day.slots,
      },
    })
}
