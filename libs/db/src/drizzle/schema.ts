import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core'
import type { BadstuSlot } from '@badstu/data'

export const scrapeLocks = sqliteTable('scrape_locks', {
  id: integer('id').primaryKey(),
  locked_at: integer('locked_at', { mode: 'timestamp_ms' }),
  locked_by: text('locked_by'),
  location: text('location').unique().notNull(),
})

export const availability = sqliteTable(
  'availability',
  {
    id: integer('id').primaryKey().unique(),
    location_key: text('location_key').notNull(),
    location_name: text('location_name').notNull(),
    date_string: text('date_string').notNull(),
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    last_polled_at: integer('last_polled_at', { mode: 'timestamp_ms' }),
    slots: text('slots', { mode: 'json' }).$type<BadstuSlot[]>().notNull(),
    provider: text('provider').$type<'obf' | 'leb'>().notNull(),
  },
  (t) => [unique('location_date_unique_index').on(t.location_key, t.date)],
)
