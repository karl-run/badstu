import * as R from 'remeda'
import { type FirebaseSlot, getFirebaseDocuments } from './firebase'
import type { BadstuDay, BadstuSlot } from '../types'
import { decimalTimeToStringTime } from './utils'
import type { ObfDropinLocation } from './locations'
import logger from '@badstu/logger'

function firebaseSlotToBadstuSlot(slot: FirebaseSlot): BadstuSlot | null {
  // Bookings with 0 available slots are not useful
  if (slot.available == 0) return null

  return {
    available: slot.available - slot.booked + slot.cancelled,
    length: slot.length,
    decimalTime: slot.time,
    time: decimalTimeToStringTime(slot.time),
    timeEnd: decimalTimeToStringTime(slot.time + slot.length),
    size: slot.available,
  }
}

async function getFirebaseLocationById(location: ObfDropinLocation): Promise<BadstuDay[]> {
  const documents = await getFirebaseDocuments(location.dropin)
  const byDay = R.groupBy(documents, R.prop('date'))

  if (R.entries(byDay).some(([, docs]) => docs.length > 1)) {
    logger.warn(`Multiple documents found for the same date in ${location.dropin}. This may cause issues:`, byDay)
  }

  return R.pipe(
    byDay,
    R.mapValues(R.first()),
    R.mapValues(R.prop('slots')),
    R.mapValues(R.piped(R.map(firebaseSlotToBadstuSlot), R.filter(R.isNonNull))),
    R.entries(),
    R.map(
      ([date, day]): BadstuDay => ({
        locationKey: location.key,
        locationName: location.name,
        date: date,
        slots: day,
      }),
    ),
  )
}

export async function getDropin(location: ObfDropinLocation): Promise<BadstuDay[]> {
  return await getFirebaseLocationById(location)
}
