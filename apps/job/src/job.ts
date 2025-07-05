import { Cron } from '@hexagon/croner'
import { logWithTimestamp } from './logging.ts'
import { scrapeWithLock } from './scrape.ts'

logWithTimestamp('Setting up scrape cron job')
const job = new Cron('*/3 * * * *', async () => {
  await Promise.all(['kroloftet', 'sukkerbiten', 'langkaia', 'jurten'].map(scrapeWithLock))
})

logWithTimestamp('Setting up notify cron job')
const notifyJob = new Cron('*/3 * * * *', async () => {
  logWithTimestamp(`Notify: Time to start notify job`)

  logWithTimestamp('Dummy notify! Can we connect to DB?')
})

logWithTimestamp(`Scrape: Started... job will run ${job.nextRun()?.toLocaleTimeString() ?? 'never somehow?'}`)
logWithTimestamp(`Notify: Started... job will run ${notifyJob.nextRun()?.toLocaleTimeString() ?? 'never somehow?'}`)

process.on('SIGINT', () => {
  logWithTimestamp('SIGINT received, exiting...')
  job.stop()
  notifyJob.stop()
  process.exit(0)
})
