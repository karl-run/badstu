import { getFirebaseDocuments } from './firebase'

async function firebaseToDate(id: string) {
  const documents = await getFirebaseDocuments(id)

  console.log('hey', documents)
}

export async function getDropin(location: { dropin: string }) {
  await firebaseToDate(location.dropin)
}
