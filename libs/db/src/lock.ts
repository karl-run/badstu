import { db, scrapeLocks } from './drizzle'

export async function releaseLock(location: string) {
  await db
    .insert(scrapeLocks)
    .values({
      location,
      locked_at: null,
      locked_by: null,
    })
    .onConflictDoUpdate({
      target: scrapeLocks.location,
      set: {
        locked_at: null,
        locked_by: null,
      },
    })
}

export async function lock(location: string, whoami: string) {
  await db
    .insert(scrapeLocks)
    .values({
      location,
      locked_at: new Date(),
      locked_by: whoami,
    })
    .onConflictDoUpdate({
      target: scrapeLocks.location,
      set: {
        locked_at: new Date(),
        locked_by: whoami,
      },
    })
}

export async function getLock(location: string) {
  return db.query.scrapeLocks.findFirst({
    where: (scrapeLocks, { eq }) => eq(scrapeLocks.location, location),
  })
}
