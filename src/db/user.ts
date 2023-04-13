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

export async function getNotifies(id: string) {
  return prisma.notify.findMany({
    where: { userId: id, date: { gte: new Date() }, notified: false },
    orderBy: { date: 'asc' },
  });
}
