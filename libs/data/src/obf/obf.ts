import * as R from 'remeda'
import { type FirebaseSlot, getFirebaseDocuments } from './firebase'
import type { BadstuDay, BadstuSlot } from '../types'
import { decimalTimeToStringTime } from './utils'

function firebaseSlotToBadstuSlot(slot: FirebaseSlot): BadstuSlot {
  return {
    available: slot.available,
    length: slot.length,
    decimalTime: slot.time,
    time: decimalTimeToStringTime(slot.time),
    timeEnd: decimalTimeToStringTime(slot.time + slot.length),
    size: -1,
  }
}

async function getFirebaseLocationById(id: string): Promise<BadstuDay[]> {
  const documents = await getFirebaseDocuments(id)
  const byDay = R.groupBy(documents, R.prop('date'))

  if (R.entries(byDay).some(([, docs]) => docs.length > 1)) {
    console.warn(`Multiple documents found for the same date in ${id}. This may cause issues:`, byDay)
  }

  return R.pipe(
    byDay,
    R.mapValues(R.first()),
    R.mapValues(R.prop('slots')),
    R.mapValues(R.map(firebaseSlotToBadstuSlot)),
    R.entries(),
    R.map(
      ([key, day]): BadstuDay => ({
        date: key,
        slots: day,
        name: 'wat',
      }),
    ),
  )
}

export async function getDropin(location: { dropin: string }): Promise<BadstuDay[]> {
  return await getFirebaseLocationById(location.dropin)
}
