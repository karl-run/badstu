import { Job } from './common.ts'
import { type BadstuDay, getLebDropin } from '@badstu/data'

export class LebJob extends Job {
  private readonly offset: number
  private readonly days: number

  constructor(offset: number = 0, days: number = 1) {
    super('Lilleborg Elvebadstu', 'leb:lilleborg')

    this.offset = offset
    this.days = days
  }

  getDaysForJob(): Promise<BadstuDay[]> {
    return getLebDropin(this.offset, this.days)
  }
}
