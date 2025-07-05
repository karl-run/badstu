import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const scrapeLocks = sqliteTable('scrape_locks', {
  id: integer('id').primaryKey(),
  locked_at: integer('locked_at', { mode: 'timestamp_ms' }),
  locked_by: text('locked_by'),
  location: text('location').unique().notNull(),
})
