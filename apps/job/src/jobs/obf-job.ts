import type { BadstuDay, ObfDropinLocation } from '@badstu/data'
import { getDropin } from '@badstu/data'

import { Job } from './common'

export class ObfJob extends Job {
  private readonly location: ObfDropinLocation

  constructor(name: string, location: ObfDropinLocation) {
    super(name, `obf:${location.key}`)

    this.location = location
  }

  public getDaysForJob(): Promise<BadstuDay[]> {
    return getDropin(this.location)
  }
}
