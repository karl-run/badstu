import { Cron } from '@hexagon/croner'
import logger from '@badstu/logger'
import { jobs } from './jobs/jobs-list.ts'

logger.info('Setting up scrape cron job')
const obfCron = new Cron('*/3 * * * *', async () => {
  // Do work synchronously as to not hammer their API
  for (const obfJob of jobs) {
    try {
      await obfJob.doWorkWithLock()
    } catch (e) {
      logger.error(new Error(`Job ${obfJob.name} (${obfJob.key}) failed at root level :(`, { cause: e }))
    }
  }
})

logger.info(`OBF Job: Started... job will run ${obfCron.nextRun()?.toLocaleTimeString() ?? 'never somehow?'}`)

process.on('SIGINT', () => {
  logger.info('SIGINT received, exiting...')
  obfCron.stop()
  process.exit(0)
})

// Immediately trigger the cron job when app starts
obfCron.trigger()
