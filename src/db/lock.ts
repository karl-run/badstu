import prisma from '@/db/prisma';

export async function openLock(location: string) {
  await prisma.scrapeLock.upsert({
    create: {
      location,
      locked_at: null,
      locked_by: null,
    },
    update: {
      locked_at: null,
      locked_by: null,
    },
    where: {
      location,
    },
  });
}

export async function lock(location: string, whoami: string) {
  await prisma.scrapeLock.upsert({
    create: {
      location,
      locked_at: new Date(),
      locked_by: 'scraper',
    },
    update: {
      locked_at: new Date(),
      locked_by: 'scraper',
    },
    where: {
      location,
    },
  });
}

export async function getLock(location: string) {
  return prisma.scrapeLock.findUnique({
    where: { location },
  });
}
