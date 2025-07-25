import type { PageServerLoad } from './$types'
import { getAllAvailabilityForDate } from '@badstu/db/slots'
import logger from '@badstu/logger'

export const load: PageServerLoad = async ({ depends }) => {
  depends('badstu:today')

  const startTime = Date.now()

  logger.info("Landing page, generating today's availability")
  const locations = getAllAvailabilityForDate(new Date()).then(async (it) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay for testing purposes

    const endTime = Date.now()
    logger.info(`Today's availability generated for ${Object.keys(it).length} locations, took ${endTime - startTime}ms`)
    return it
  })

  return {
    locations,
  }
}
