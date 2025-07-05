import { getDropin, locations } from '@badstu/data'

export async function updateLocation(location: string) {
  await getDropin(locations.kroloftet)
}

if (Deno.mainModule.endsWith('location.ts')) {
  await updateLocation('kroloftet')
}
