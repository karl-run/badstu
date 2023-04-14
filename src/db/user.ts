import prisma from '@/db/prisma';
import { Location } from '@/scraping/metadata';

export function insertUser(id: string) {
  return prisma.user.upsert({
    update: {},
    create: { id },
    where: { id },
  });
}

type AddRemoveNotify = { id: string; location: Location; date: Date; slot: string };
export async function addNotify(newNotify: AddRemoveNotify) {
  return prisma.notify.create({
    data: {
      date: newNotify.date,
      slot: newNotify.slot,
      location: newNotify.location,
      userId: newNotify.id,
      notified: false,
      notified_at: null,
    },
  });
}

export async function removeNotify(deleteNotify: AddRemoveNotify) {
  await prisma.$transaction(async () => {
    const itemToDelete = await prisma.notify.findFirst({
      where: {
        userId: deleteNotify.id,
        location: deleteNotify.location,
        date: deleteNotify.date,
        slot: deleteNotify.slot,
      },
    });

    if (!itemToDelete) return;

    await prisma.notify.delete({
      where: { id: itemToDelete.id },
    });
  });
}

export async function markNotifyNotified(id: number) {
  await prisma.notify.update({
    where: { id },
    data: { notified: true, notified_at: new Date() },
  });
}

export async function getNotifies(id: string) {
  return prisma.notify.findMany({
    where: { userId: id, date: { gte: new Date() }, notified: false },
    orderBy: { date: 'asc' },
  });
}

export async function getAllTimeNotifyCount(id: string) {
  return await prisma.$transaction(async () => {
    const [allTime, notified] = await Promise.all([
      prisma.notify.count({ where: { userId: id } }),
      prisma.notify.count({ where: { userId: id, notified: true } }),
    ]);

    return { allTime, notified };
  });
}

export async function deleteMe(id: string) {
  await prisma.user.delete({ where: { id } });
}

export async function updatePhoneNumber(id: string, phoneNumber: string) {
  await prisma.user.update({
    where: { id },
    data: { number: phoneNumber },
  });
}

export async function getUserPhoneNumber(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  return user?.number ?? null;
}

export async function getValidUsers() {
  return prisma.user.findMany({
    where: { number: { not: null } },
    include: { notifies: { where: { notified: { not: true }, date: { gte: new Date() } } } },
  });
}
