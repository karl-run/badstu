export const locationNames = ['kroloftet', 'sukkerbiten', 'langkaia', 'jurten'] as const;

export type Location = (typeof locationNames)[number];

export type LocationDetails = {
  dropinSlots: string[];
  dropin: string;
  privat?: string;
  fillDays?: number[];
};
export type Locations = Record<Location, LocationDetails>;

export const locations: Locations = {
  kroloftet: {
    dropinSlots: [
      '08:30',
      '10:00',
      '11:30',
      '13:00',
      '14:30',
      '16:00',
      '17:30',
      '19:00',
      '20:30',
      '22:00',
    ],
    dropin: 'XfIruVrKjcN2Alt2DFDY',
    privat: '49RAU3tqnDgHaxB3RnGi',
  },
  sukkerbiten: {
    dropinSlots: [
      '07:00',
      '08:30',
      '10:00',
      '11:30',
      '13:00',
      '14:30',
      '16:00',
      '17:30',
      '19:00',
      '20:30',
    ],
    dropin: '1x8uVZQ9KLCRDl0lfTJa',
  },
  langkaia: {
    dropinSlots: [
      '07:00',
      '08:30',
      '10:00',
      '11:30',
      '13:00',
      '14:30',
      '16:00',
      '17:30',
      '19:00',
      '20:30',
    ],
    dropin: 'TSFPApgD7oKG8H1gcQQ2',
  },
  jurten: {
    dropin: 'EAnCJl6ixIM7X8xoaojC',
    dropinSlots: ['10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'],
  },
};

export function validateLocation(param: string | null): Location {
  if (param == null || locationNames.find((it) => param === it) == null) {
    throw new Error(`Invalid location: ${param}`);
  }

  return param as Location;
}

export function locationToTitle(location: Location): string {
  switch (location) {
    case 'kroloftet':
      return 'Kroloftet';
    case 'sukkerbiten':
      return 'Sukkerbiten';
    case 'langkaia':
      return 'Langkaia';
    case 'jurten':
      return 'Jurten (ved Kroloftet)';
  }
}
