import type { PageServerLoad } from './$types'
import { getAllAvailabilityToday } from '@badstu/db/slots'

export const load: PageServerLoad = async () => {
  const locations = await getAllAvailabilityToday()

  return {
    locations,
  }
}
