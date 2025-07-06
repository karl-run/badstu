import type { PageServerLoad } from './$types'
import { getAllAvailabilityToday } from '@badstu/db/slots'

export const load: PageServerLoad = async () => {
  const rows = await getAllAvailabilityToday()

  return {
    serverMessage: 'hello from server load function',
    rows,
  }
}
