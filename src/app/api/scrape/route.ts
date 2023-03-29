import { differenceInSeconds } from 'date-fns';

import { scrapeKroloftetTimes } from '@/scraping/obf';
import prisma from '@/db/prisma';

async function openLock() {
  await prisma.scrapeLock.upsert({
    create: {
      location: 'kroloftet',
      locked_at: null,
      locked_by: null,
    },
    update: {
      locked_at: null,
      locked_by: null,
    },
    where: {
      location: 'kroloftet',
    },
  });
}

async function lock() {
  await prisma.scrapeLock.upsert({
    create: {
      location: 'kroloftet',
      locked_at: new Date(),
      locked_by: 'scraper',
    },
    update: {
      locked_at: new Date(),
      locked_by: 'scraper',
    },
    where: {
      location: 'kroloftet',
    },
  });
}

export async function POST(request: Request) {
  const currentLock = await prisma.scrapeLock.findUnique({
    where: { location: 'kroloftet' },
  });

  if (currentLock?.locked_at && differenceInSeconds(currentLock.locked_at, new Date()) < 60) {
    console.info(
      `Already scraping, started at ${currentLock.locked_at} by ${currentLock.locked_by}`,
    );
    return new Response('Already scraping', { status: 208 });
  }

  console.log('Not scraping, starting now...');
  try {
    await lock();
    await scrapeKroloftetTimes();
    await openLock();
    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error(e);
    await openLock();
    return new Response('Error', { status: 500 });
  }
}
