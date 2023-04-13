import prisma from '@/db/prisma';

export function insertUser(id: string) {
  return prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
    },
  });
}
