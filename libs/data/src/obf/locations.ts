export type ObfDropinLocation = {
  key: string
  name: string
  dropin: string
}

export const obfLocations = {
  kroloftet: {
    key: 'kroloftet-svarttrosten',
    name: 'Kroloftet',
    dropin: 'XfIruVrKjcN2Alt2DFDY',
    // privat: '49RAU3tqnDgHaxB3RnGi',
  } satisfies ObfDropinLocation,
  sukkerbiten: {
    key: 'sukkerbiten',
    name: 'Sukkerbiten',
    dropin: '1x8uVZQ9KLCRDl0lfTJa',
  } satisfies ObfDropinLocation,
  langkaia: {
    key: 'langkaia',
    name: 'Langkaia',
    dropin: 'TSFPApgD7oKG8H1gcQQ2',
  } satisfies ObfDropinLocation,
  jurten: {
    dropin: 'EAnCJl6ixIM7X8xoaojC',
  },
  sagene: {
    'badstu/bad u/ nakenhet': {
      key: 'sagene-basseng',
      name: 'Sagene',
      dropin: '5g1XRrzmR9bM0CiukRFx',
    } satisfies ObfDropinLocation,
    'badstu/bad m/ nakenhet': {
      key: 'sagene-basseng-naken',
      name: 'Sagene',
      dropin: 'AWAImiJ8LY6S4gCWwf9j',
    } satisfies ObfDropinLocation,
    'badstu m/ nakenhet': {
      key: 'sagene-badstu-naken',
      name: 'Sagene',
      dropin: 'brM4BEZAI02QIJoidd7N',
    } satisfies ObfDropinLocation,
  },
}
