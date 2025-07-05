export type DropinLocation = {
  dropin: string
}

export const locations = {
  kroloftet: {
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
      dropin: '5g1XRrzmR9bM0CiukRFx',
    } satisfies DropinLocation,
    'badstu/bad m/ nakenhet': {
      dropin: 'AWAImiJ8LY6S4gCWwf9j',
    } satisfies DropinLocation,
    'badstu m/ nakenhet': {
      dropin: 'brM4BEZAI02QIJoidd7N',
    } satisfies DropinLocation,
  },
}
