import { addMinutes, isAfter, startOfDay, subDays } from 'date-fns';
import { and, count, eq } from 'drizzle-orm';

import db from '@/db/db';
import { Location } from '@/scraping/metadata';
import { dateAndTimeToDate, toDateString } from '@/utils/date';
import { notifies, users } from '@/db/schema';

export function insertUser(id: string) {
  return db
    .insert(users)
    .values({ id, number: null, created_at: new Date() })
    .onConflictDoNothing();
}

type AddRemoveNotify = { id: string; location: Location; date: Date; slot: string };
export async function addNotify(newNotify: AddRemoveNotify) {
  return db.insert(notifies).values({
    date: newNotify.date,
    slot: newNotify.slot,
    location: newNotify.location,
    userId: newNotify.id,
    notified: false,
    notified_at: null,
  });
}

export async function removeNotify(deleteNotify: AddRemoveNotify) {
  await db.transaction(async (tx) => {
    const itemToDelete = await tx.query.notifies.findFirst({
      where: (notifies, { eq, and }) =>
        and(
          eq(notifies.userId, deleteNotify.id),
          eq(notifies.location, deleteNotify.location),
          eq(notifies.date, deleteNotify.date),
          eq(notifies.slot, deleteNotify.slot),
        ),
    });

    if (!itemToDelete) return;

    await tx.delete(notifies).where(eq(notifies.id, itemToDelete.id));
  });
}

export async function markNotifyNotified(id: number) {
  await db
    .update(notifies)
    .set({ notified: true, notified_at: new Date() })
    .where(eq(notifies.id, id));
}

export async function getNotifies(id: string) {
  return (
    await db.query.notifies.findMany({
      // where: { userId: id, date: { gte: subDays(new Date(), 1) }, notified: false },
      where: (notifies, { eq, and }) =>
        and(
          eq(notifies.userId, id),
          eq(notifies.date, subDays(new Date(), 1)),
          eq(notifies.notified, false),
        ),
      orderBy: (notifies, { desc }) => desc(notifies.date),
    })
  ).filter((it) =>
    isAfter(addMinutes(dateAndTimeToDate(toDateString(it.date), it.slot), 60), new Date()),
  );
}

export async function getTodaysNotified(id: string) {
  return (
    await db.query.notifies.findMany({
      where: (notifies, { eq, and }) =>
        and(
          eq(notifies.userId, id),
          eq(notifies.notified, true),
          eq(notifies.notified_at, startOfDay(new Date())),
        ),
      orderBy: (notifies, { asc }) => asc(notifies.notified_at),
    })
  ).filter((it) =>
    isAfter(addMinutes(dateAndTimeToDate(toDateString(it.date), it.slot), 60), new Date()),
  );
}

export async function getAllTimeNotifyCount(id: string) {
  return await db.transaction(async (tx) => {
    const [allTime, notified] = await Promise.all([
      tx
        .select({ count: count() })
        .from(notifies)
        .where(eq(notifies.userId, id))
        .then((it) => it[0].count),
      tx
        .select({ count: count() })
        .from(notifies)
        .where(and(eq(notifies.userId, id), eq(notifies.notified, true)))
        .then((it) => it[0].count),
    ]);

    return { allTime, notified };
  });
}

export async function deleteMe(id: string) {
  await db.delete(users).where(eq(users.id, id));
}

export async function updatePhoneNumber(id: string, phoneNumber: string) {
  await db.update(users).set({ number: phoneNumber }).where(eq(users.id, id));
}

export async function getUserPhoneNumber(id: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });

  return user?.number ?? null;
}

export async function getValidUsers() {
  return db.query.users.findMany({
    where: (users, { isNotNull }) => isNotNull(users.number),
    with: {
      notifies: {
        where: (notifies, { gte, eq, and }) =>
          and(eq(notifies.notified, false), gte(notifies.date, subDays(new Date(), 1))),
      },
    },
  });
}
