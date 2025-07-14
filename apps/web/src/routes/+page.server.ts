import type { Config } from '@sveltejs/adapter-vercel'
import type { PageServerLoad } from './$types'
import { getAllAvailabilityToday } from '@badstu/db/slots'
import logger from '@badstu/logger'

export const load: PageServerLoad = async () => {
  const startTime = Date.now()

  logger.info("Landing page, generating today's availability")
  const locations = getAllAvailabilityToday().then((it) => {
    const endTime = Date.now()
    logger.info(`Today's availability generated for ${Object.keys(it).length} locations, took ${endTime - startTime}ms`)
    return it
  })

  return {
    locations,
  }
}

export const config: Config = {
  isr: {
    expiration: 60,
  },
}
