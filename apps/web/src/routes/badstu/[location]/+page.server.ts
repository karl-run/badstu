import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getBadstuLocation } from '@badstu/data/meta'

export const load: PageServerLoad = async ({ params }) => {
  const unslug = params.location.replaceAll('-', ' ')
  const location = getBadstuLocation(unslug)

  if (location == null) {
    error(404, 'Not found')
  }
}
