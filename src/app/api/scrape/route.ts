import { differenceInSeconds } from 'date-fns';

import { scrapeTimes } from '@/scraping/obf';
import { getLock, lock, openLock } from '@/db/lock';
import { validateLocation } from '@/scraping/metadata';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = validateLocation(searchParams.get('location') ?? null);
  const source = searchParams.get('source') ?? 'unknown';
  const currentLock = await getLock(location);

  if (currentLock?.locked_at && differenceInSeconds(new Date(), currentLock.locked_at) < 60) {
    console.info(
      `Already scraping (${differenceInSeconds(
        new Date(),
        currentLock.locked_at,
      )} seconds ago), started at ${currentLock.locked_at} by ${currentLock.locked_by}`,
    );
    return new Response('Already scraping', { status: 208 });
  }

  console.log(`Not currently scraping ${location}, starting now... (triggered by ${source})`);
  try {
    await lock(location, source);
    await scrapeTimes(location);
    await openLock(location);
    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error(e);
    await openLock(location);
    return new Response('Error', { status: 500 });
  }
}
