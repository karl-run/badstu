export type ObfDropinLocation = {
  key: string
  name: string
  dropin: string
}

export const obfLocations = {
  kroloftet: {
    svarttrosten: {
      key: 'kroloftet-svarttrosten',
      name: 'Kroloftet',
      dropin: 'XfIruVrKjcN2Alt2DFDY',
      // privat: '49RAU3tqnDgHaxB3RnGi',
    } satisfies ObfDropinLocation,
    'svarttrosten nakenbadstue': {
      key: 'kroloftet-svarttrosten-naken',
      name: 'Kroloftet',
      dropin: '4tfMScE3EyG4pZyf4evv',
    } satisfies ObfDropinLocation,
    'svarttrosten nakenbadsue (kvinner)': {
      key: 'kroloftet-svarttrosten-naken-kvinner',
      name: 'Kroloftet',
      dropin: 'XQbP0wJAVGSKsNASxzMg',
    } satisfies ObfDropinLocation,
    jurten: {
      key: 'kroloftet-jurten',
      name: 'Kroloftet',
      dropin: 'EAnCJl6ixIM7X8xoaojC',
    },
  },
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
  sagene: {
    'badstu/bad u/ nakenhet': {
      key: 'sagene-basseng',
      name: 'Sagene Folkebad',
      dropin: '5g1XRrzmR9bM0CiukRFx',
    } satisfies ObfDropinLocation,
    'badstu/bad m/ nakenhet': {
      key: 'sagene-basseng-naken',
      name: 'Sagene Folkebad',
      dropin: 'AWAImiJ8LY6S4gCWwf9j',
    } satisfies ObfDropinLocation,
    'badstu m/ nakenhet': {
      key: 'sagene-badstu-naken',
      name: 'Sagene Folkebad',
      dropin: 'brM4BEZAI02QIJoidd7N',
    } satisfies ObfDropinLocation,
  },
}
