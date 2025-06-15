import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { InferSelectModel, relations } from 'drizzle-orm'

import { ExtractedDay } from '@/scraping/types'

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey(),
  name: text('name').unique().notNull(),
  dropins_polled_at: integer('dropins_polled_at', { mode: 'timestamp_ms' }),
  dropins: text('dropins', { mode: 'json' }).$type<ExtractedDay[]>(),
  private_polled_at: integer('private_polled_at', { mode: 'timestamp_ms' }),
  private: text('private', { mode: 'json' }).$type<ExtractedDay[]>(),
})

export type Location = InferSelectModel<typeof locations>

export const scrapeLocks = sqliteTable('scrape_locks', {
  id: integer('id').primaryKey(),
  locked_at: integer('locked_at', { mode: 'timestamp_ms' }),
  locked_by: text('locked_by'),
  location: text('location').unique().notNull(),
})

export type ScrapeLock = InferSelectModel<typeof scrapeLocks>

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  created_at: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  number: text('number').unique(),
})

export const usersRelations = relations(users, ({ many }) => ({
  notifies: many(notifies),
}))

export type User = InferSelectModel<typeof users>

export const notifies = sqliteTable('notifies', {
  id: integer('id').primaryKey(),
  userId: text('userId').references(() => users.id),
  slot: text('slot').notNull(),
  date: integer('date', { mode: 'timestamp_ms' }).notNull(),
  location: text('location').notNull(),
  notified: integer('notified', { mode: 'boolean' }).default(true),
  notified_at: integer('notified_at', { mode: 'timestamp_ms' }),
})

export const notifiesRelations = relations(notifies, ({ one }) => ({
  user: one(users, {
    fields: [notifies.userId],
    references: [users.id],
  }),
}))

export type Notify = InferSelectModel<typeof notifies>
