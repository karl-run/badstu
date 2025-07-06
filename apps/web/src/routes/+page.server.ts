import type { PageServerLoad } from './$types'
import { getLock } from '@badstu/db/lock'

export const load: PageServerLoad = async () => {
  const rows = await getLock('kroloftet')

  return {
    serverMessage: 'hello from server load function',
    rows,
  }
}
