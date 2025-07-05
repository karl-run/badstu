import { lock, getLock, openLock } from '@badstu/db/lock'

import { logWithTimestamp } from './logging.ts'

export async function scrape(location: string) {
  logWithTimestamp(`Scrape: Time to poll location ${location}`)

  logWithTimestamp('Dummy scrape! Can we connect to DB?')

  const currentLock = await getLock('kroloftet')

  if (currentLock == null) {
    logWithTimestamp('No lock found, locking...')
    await lock('kroloftet', 'scraper')

    await new Promise((resolve) => setTimeout(resolve, 1000))
  } else {
    logWithTimestamp('Lock found! Nothing to do...')
  }

  logWithTimestamp(`Rows: ${JSON.stringify(currentLock)}`)
}

if (Bun.argv?.[1]?.endsWith('scrape.ts')) {
  await scrape('kroloftet')
}
