import { initializeApp } from 'firebase/app'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { addWeeks, format } from 'date-fns'
import logger from '@badstu/logger'

export interface FirebaseDocument {
  slots: FirebaseSlot[]
  date: string
}

export interface FirebaseSlot {
  length: number
  available: number
  onlyMembers: boolean
  deleted: number
  reserved: number
  confirmed: number
  priceAdjustments: number
  cancelled: number
  time: number
  booked: number
  customMessage: string
}

logger.info('Am i firebasing for some reason?')

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG ?? '{}')

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function getFirebaseDocuments(locationId: string): Promise<FirebaseDocument[]> {
  const querySnapshot = await getDocs(
    query(
      collection(db, 'dateSlots', '1cKim9HkbQPgrbXOr8ad', 'manifests', locationId, 'slots'),
      where('date', '>=', format(new Date(), 'yyyy-MM-dd')),
      where('date', '<=', format(addWeeks(new Date(), 4), 'yyyy-MM-dd')),
    ),
  )

  // Seems impossible to type >:( Should probably zod it
  return querySnapshot.docs.map((doc) => doc.data()) as FirebaseDocument[]
}

// console.log(await getFirebaseDocuments("XfIruVrKjcN2Alt2DFDY"));
