export const locationNames = ['kroloftet', 'sukkerbiten', 'langkaia'] as const;

export type Location = (typeof locationNames)[number];

export type LocationDetails = { dropinSlots: string[]; dropin: number; privat?: number };
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
    dropin: 189283,
    privat: 189244,
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
      '22:00',
    ],
    dropin: 184637,
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
      '22:00',
    ],
    dropin: 189278,
  },
};
export const createUrl = (locationId: number, showCount: boolean) =>
  [
    'https://www.planyo.com/embed-calendar.php?resource_id=',
    locationId,
    '&calendar=57139&style=upcoming-av&modver=2.7&custom-language=NO&ifr=calp_3204143258&usage=resform&clk=r&no_range=1',
    showCount ? '&show_count=1' : '',
    '&visible_items_per_column=100',
  ].join('');

export function validateLocation(param: string | null): Location {
  if (param == null || locationNames.find((it) => param === it) == null) {
    throw new Error(`Invalid location: ${param}`);
  }

  return param as Location;
}
