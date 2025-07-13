import { toObfLink } from './obf/link-utils'

type LngLatTuple = [number, number]

type BadstuLocation = {
  loc: LngLatTuple
  provider: 'obf' | 'lilleborg'
}

export const allBadstuLocations = {
  'Sagene Folkebad': {
    loc: [10.756673, 59.9314066],
    provider: 'obf',
  } satisfies BadstuLocation,
  Kroloftet: {
    loc: [10.7991902, 59.9050309] satisfies LngLatTuple,
    provider: 'obf',
  } satisfies BadstuLocation,
  Langkaia: {
    loc: [10.746916, 59.9080349] satisfies LngLatTuple,
    provider: 'obf',
  } satisfies BadstuLocation,
  Sukkerbiten: {
    loc: [10.7525683, 59.9045287] satisfies LngLatTuple,
    provider: 'obf',
  } satisfies BadstuLocation,
}

export type AllLocationNames = keyof typeof allBadstuLocations

export function getBadstuLocation(name: string): (BadstuLocation & { name: AllLocationNames }) | null {
  const location = allBadstuLocations[name as AllLocationNames]

  if (!location) return null

  return { ...location, name: name as AllLocationNames }
}

export function getLink(provider: 'obf', locationKey: string, date: string): string {
  switch (provider) {
    case 'obf':
      return toObfLink(locationKey, date)
  }
}
