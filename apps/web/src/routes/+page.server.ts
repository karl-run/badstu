import type { PageServerLoad } from './$types'
import { getAllAvailabilityToday } from '@badstu/db/slots'
import logger from '@badstu/logger'

export const load: PageServerLoad = async () => {
  const startTime = Date.now()

  logger.info("Landing page, generating today's availability")
  const locations = await getAllAvailabilityToday()

  const endTime = Date.now()
  logger.info(
    `Today's availability generated for ${Object.keys(locations).length} locations, took ${endTime - startTime}ms`,
  )

  return {
    locations,
  }
}
