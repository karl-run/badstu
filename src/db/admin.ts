import { subDays } from 'date-fns'
import { count, eq, gte } from 'drizzle-orm'

import { notifies, users } from './schema'

import db from '@/db/db'

export async function getAdminStats() {
  return await db.transaction(async (tx) => {
    return await Promise.all([
      db
        .select({ count: count() })
        .from(users)
        .then((it) => it[0].count),
      db
        .select({ count: count() })
        .from(notifies)
        .then((it) => it[0].count),
      db
        .select({ count: count() })
        .from(notifies)
        .where(gte(notifies.date, subDays(new Date(), 1)))
        .then((it) => it[0].count),
      db
        .select({ count: count() })
        .from(notifies)
        .where(eq(notifies.notified, true))
        .then((it) => it[0].count),
    ])
  })
}
