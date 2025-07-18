import type { ObfDropinLocation } from '../../../../libs/data/src/obf/locations'
import logger from '@badstu/logger'
import { getLock, lock, releaseLock } from '@badstu/db/lock'
import { getDropin } from '@badstu/data'
import { saveDay } from '@badstu/db/day'
import { differenceInSeconds } from 'date-fns'

export class ObfJob {
  readonly key: string
  readonly name: string

  private readonly location: ObfDropinLocation

  constructor(name: string, location: ObfDropinLocation) {
    this.name = name
    this.location = location
    this.key = `obf:${location.key}`
  }

  async doWorkWithLock(): Promise<void> {
    logger.info(`OBF Job: ${this.name}`)

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
    const days = await getDropin(this.location)
    if (days == null) {
      logger.warn(`No dropin data found for ${this.key}`)
      return
    }

    let failed = 0
    for (const day of days) {
      try {
        await saveDay(day)
      } catch (e) {
        logger.error(new Error(`Unable to update day ${day.date} for ${this.location.key}`, { cause: e }))
        failed++
      }
    }

    logger.info(`Updated ${days.length - failed} days for ${this.key} (${failed} failed)`)
  }
}
