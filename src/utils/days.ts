import * as R from 'remeda'

import { AvailabilityMap } from '@/scraping/types'

export const createEmptyDropinDay = (dropinSlots: string[]): AvailabilityMap =>
  R.pipe(
    dropinSlots,
    R.map((it): [string, number] => [it, 0]),
    (it) => R.fromEntries(it),
  )
