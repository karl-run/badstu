import type { Config } from '@sveltejs/adapter-vercel'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { type AllLocationNames, getBadstuLocation } from '@badstu/data/meta'
import { getAllAvailabilityForLocation } from '@badstu/db/slots'
import logger from '@badstu/logger'

export const load: PageServerLoad = async ({ params }) => {
  const unslug = params.location.replaceAll('-', ' ')
  const location = getBadstuLocation(unslug)

  if (location == null) {
    error(404, 'Not found')
  }

  const startTime = Date.now()
  logger.info(`Loading availability for location: ${location.name} (${unslug})`)

  const availability = getAllAvailabilityForLocation(unslug as AllLocationNames).then((it) => {
    const endTime = Date.now()
    logger.info(
      `Availability for ${location.name} (${unslug}) loaded, found ${Object.keys(it).length} days, took ${endTime - startTime}ms`,
    )
    return it
  })

  return {
    name: location.name,
    availability,
  }
}

export const config: Config = {
  isr: {
    expiration: 60,
  },
}
