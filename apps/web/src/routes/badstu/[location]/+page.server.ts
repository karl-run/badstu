import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { allBadstuLocations, type AllLocationNames, getBadstuLocation } from '@badstu/data/meta'
import { getAllAvailabilityForLocation } from '@badstu/db/slots'

export const load: PageServerLoad = async ({ params }) => {
  const unslug = params.location.replaceAll('-', ' ')
  const location = getBadstuLocation(unslug)

  if (location == null) {
    error(404, 'Not found')
  }

  const availability = await getAllAvailabilityForLocation(unslug as AllLocationNames)

  return {
    name: location.name,
    availability,
  }
}
