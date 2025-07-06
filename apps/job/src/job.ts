import { Cron } from '@hexagon/croner'
import logger from '@badstu/logger'
import { obfJobs } from './jobs/jobs-list.ts'

logger.info('Setting up scrape cron job')
const obfCron = new Cron('*/3 * * * *', async () => {
  // Do work synchronously as to not hammer their API
  for (const obfJob of obfJobs) {
    await obfJob.doWorkWithLock()
  }
})

logger.info('Setting up notify cron job')
const notifyJob = new Cron('*/3 * * * *', async () => {
  logger.info(`Notify: Time to start notify job`)

  logger.info('Dummy notify! Can we connect to DB?')
})

logger.info(`OBF Job: Started... job will run ${obfCron.nextRun()?.toLocaleTimeString() ?? 'never somehow?'}`)
logger.info(`Notify: Started... job will run ${notifyJob.nextRun()?.toLocaleTimeString() ?? 'never somehow?'}`)

process.on('SIGINT', () => {
  logger.info('SIGINT received, exiting...')
  obfCron.stop()
  notifyJob.stop()
  process.exit(0)
})

// Immediately trigger the cron job when app starts
obfCron.trigger()
