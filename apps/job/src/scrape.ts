import { lock, getLock, openLock } from '@badstu/db/lock'
import {} from '@badstu/data'

import { logWithTimestamp } from './logging.ts'

export async function scrapeWithLock(location: string) {
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

if (Deno.mainModule.endsWith('scrape.ts')) {
  await scrapeWithLock('kroloftet')
}
