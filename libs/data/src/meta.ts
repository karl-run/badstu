import { toObfLink } from './obf/link-utils'

type LngLatTuple = [number, number]

type BadstuLocation = {
  loc: LngLatTuple
  provider: 'obf' | 'leb'
  maps: string
  ingress: string | null
}

export const allBadstuLocations = {
  'Sagene Folkebad': {
    loc: [10.7592576, 59.9313952],
    provider: 'obf',
    maps: 'https://maps.app.goo.gl/Xi5mRMzHXTaoHzSv6',
    ingress:
      'To badstuer og basseng. Ikke alle bookinger har tilgang på bassenget. Har ofte egne bookinger hvor nakenhet er valgfritt.',
  } satisfies BadstuLocation,
  Kroloftet: {
    loc: [10.8015902, 59.9050309] satisfies LngLatTuple,
    provider: 'obf',
    maps: 'https://maps.app.goo.gl/it9hnPsJQyVtzgi49',
    ingress: null,
  } satisfies BadstuLocation,
  Langkaia: {
    loc: [10.750216, 59.9086349] satisfies LngLatTuple,
    provider: 'obf',
    maps: 'https://maps.app.goo.gl/xaM8jwaFYqj1ALsb6',
    ingress: null,
  } satisfies BadstuLocation,
  Sukkerbiten: {
    loc: [10.7525683, 59.9045287] satisfies LngLatTuple,
    provider: 'obf',
    maps: 'https://maps.app.goo.gl/G9V8Y4AboBJ8exKY9',
    ingress: null,
  } satisfies BadstuLocation,
  'Lilleborg Elvebadstue': {
    loc: [10.7633441, 59.9381311] satisfies LngLatTuple,
    provider: 'leb',
    maps: 'https://maps.app.goo.gl/U8Eqr5eBKVMYXzBa8',
    ingress: 'Lokal badsute drevet av Lilleborg Boretslag',
  } satisfies BadstuLocation,
}

export type AllLocationNames = keyof typeof allBadstuLocations

export function getBadstuLocation(name: string): (BadstuLocation & { name: AllLocationNames }) | null {
  const location = allBadstuLocations[name as AllLocationNames]

  if (!location) return null

  return { ...location, name: name as AllLocationNames }
}

export function getLink(provider: 'obf' | 'leb', locationKey: string, date: string): string {
  switch (provider) {
    case 'obf':
      return toObfLink(locationKey, date)
    case 'leb':
      return 'https://lilleborgelvebadstue.no/booking'
  }
}
