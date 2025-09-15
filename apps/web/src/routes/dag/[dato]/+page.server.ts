import type { PageServerLoad } from './$types'
import { getAllAvailabilityForDate } from '@badstu/db/slots'
import logger from '@badstu/logger'
import { isValid, parseISO } from 'date-fns'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, depends }) => {
  if (isValid(params.dato)) {
    error(404, 'Not found')
  }

  depends(`badstu:${params.dato}`)

  logger.info(`Specific date page, generating ${params.dato}'s availability`)

  const startTime = Date.now()
  const locations = await getAllAvailabilityForDate(parseISO(params.dato)).then((it) => {
    const endTime = Date.now()
    logger.info(`Today's availability generated for ${Object.keys(it).length} locations, took ${endTime - startTime}ms`)

    return it
  })

  return {
    date: params.dato,
    locations,
  }
}
