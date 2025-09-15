import { type BadstuDay, getDropin, type ObfDropinLocation } from '@badstu/data'
import logger from '@badstu/logger'
import { getLock, lock, releaseLock } from '@badstu/db/lock'
import { differenceInSeconds } from 'date-fns'
import { saveDay } from '@badstu/db/day'

export abstract class Job {
  readonly key: string
  readonly name: string

  constructor(name: string, key: string) {
    this.name = name
    this.key = key
  }

  public abstract getDaysForJob(): Promise<BadstuDay[]>

  async doWorkWithLock(): Promise<void> {
    logger.info(`Doing work for ${this.key}`)

    try {
      const currentLock = await getLock(this.key)
      if (currentLock != null && currentLock.locked_at) {
        const timeSinceLock = differenceInSeconds(new Date(), currentLock.locked_at)

        if (timeSinceLock < 60) {
          logger.info(`${this.name} was locked by ${currentLock.locked_by} ${timeSinceLock} seconds ago, skipping job`)
          return
        } else {
          logger.warn(
            `Found stale lock for ${this.name}, locked by ${currentLock.locked_by} ${timeSinceLock} seconds ago, unlocking and continuing...`,
          )
          await releaseLock(this.key)
        }
      }

      await lock(this.key, 'scraper')
      await this.updateLocation()
      await releaseLock(this.key)
    } catch (e) {
      logger.error(e)
      logger.info('Tryng to open lock after failure...')
      await releaseLock(this.key)
    }
  }

  private async updateLocation(): Promise<void> {
    const days = await this.getDaysForJob()
    if (days == null) {
      logger.warn(`No dropin data found for ${this.key}`)
      return
    }

    let failed = 0
    for (const day of days) {
      try {
        await saveDay(day)
      } catch (e) {
        logger.error(Error(`Unable to update day ${day.date} for ${this.key}`, { cause: e }))
        failed++
      }
    }

    logger.info(`Updated ${days.length - failed} days for ${this.key} (${failed} failed)`)
  }
}
