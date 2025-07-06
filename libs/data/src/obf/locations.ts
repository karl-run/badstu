export type ObfDropinLocation = {
  key: string
  dropin: string
}

export const obfLocations = {
  kroloftet: {
    key: 'kroloftet-svarttrosten',
    dropin: 'XfIruVrKjcN2Alt2DFDY',
    privat: '49RAU3tqnDgHaxB3RnGi',
  },
  sukkerbiten: {
    dropin: '1x8uVZQ9KLCRDl0lfTJa',
  },
  langkaia: {
    dropin: 'TSFPApgD7oKG8H1gcQQ2',
  },
  jurten: {
    dropin: 'EAnCJl6ixIM7X8xoaojC',
  },
  sagene: {
    'badstu/bad u/ nakenhet': {
      key: 'sagene-basseng',
      dropin: '5g1XRrzmR9bM0CiukRFx',
    } satisfies ObfDropinLocation,
    'badstu/bad m/ nakenhet': {
      key: 'sagene-basseng-naken',
      dropin: 'AWAImiJ8LY6S4gCWwf9j',
    } satisfies ObfDropinLocation,
    'badstu m/ nakenhet': {
      key: 'sagene-badstu-naken',
      dropin: 'brM4BEZAI02QIJoidd7N',
    } satisfies ObfDropinLocation,
  },
}
