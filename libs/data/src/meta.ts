type LngLatTuple = [number, number]

type BadstuLocation = {
  loc: LngLatTuple
  provider: 'obf' | 'lilleborg'
}

export const allBadstuLocations = {
  'Sagene Folkebad': {
    loc: [10.756673, 59.9314066] satisfies LngLatTuple,
    provider: 'obf',
  },
  Kroloftet: {
    loc: [10.7991902, 59.9050309] satisfies LngLatTuple,
    provider: 'obf',
  },
  Langkaia: {
    loc: [10.746916, 59.9080349] satisfies LngLatTuple,
    provider: 'obf',
  },
  Sukkerbiten: {
    loc: [10.7525683, 59.9045287] satisfies LngLatTuple,
    provider: 'obf',
  },
}

export type AllLocationNames = keyof typeof allBadstuLocations
