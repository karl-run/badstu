import { subDays } from 'date-fns';

import prisma from '@/db/prisma';

export async function getAdminStats() {
  return await prisma.$transaction(async () => {
    return await Promise.all([
      await prisma.user.count(),
      await prisma.notify.count(),
      await prisma.notify.count({ where: { date: { gte: subDays(new Date(), 1) } } }),
      await prisma.notify.count({ where: { notified: true } }),
    ]);
  });
}
