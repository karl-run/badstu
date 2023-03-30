import { differenceInSeconds } from 'date-fns';

import { scrapeKroloftetTimes } from '@/scraping/obf';
import { getLock, lock, openLock } from '@/db/lock';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const currentLock = await getLock('kroloftet');

  if (currentLock?.locked_at && differenceInSeconds(new Date(), currentLock.locked_at) < 60) {
    console.info(
      `Already scraping (${differenceInSeconds(
        new Date(),
        currentLock.locked_at,
      )} seconds ago), started at ${currentLock.locked_at} by ${currentLock.locked_by}`,
    );
    return new Response('Already scraping', { status: 208 });
  }

  console.log('Not scraping, starting now...');
  try {
    await lock('kroloftet', searchParams.get('source') ?? 'unknown');
    await scrapeKroloftetTimes();
    await openLock('kroloftet');
    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error(e);
    await openLock('kroloftet');
    return new Response('Error', { status: 500 });
  }
}
