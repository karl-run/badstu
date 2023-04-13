import prisma from '@/db/prisma';
import { Location } from '@/scraping/metadata';

export function insertUser(id: string) {
  return prisma.user.upsert({
    update: {},
    create: { id },
    where: { id },
  });
}

type AddNotify = { id: string; location: Location; date: Date; slot: string };
export async function addNotify(newNotify: AddNotify) {
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

export async function getNotifies(id: string) {
  return prisma.notify.findMany({
    where: { userId: id },
    orderBy: { date: 'asc' },
  });
}
