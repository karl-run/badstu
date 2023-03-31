import * as R from 'remeda';

export type Locations = 'kroloftet' | 'sukkerbiten' | 'langkaia';

export const locations: Record<Locations, { dropin: number; privat?: number }> = {
  kroloftet: {
    dropin: 189283,
    privat: 189244,
  },
  sukkerbiten: {
    dropin: 184637,
  },
  langkaia: {
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

export function validateLocation(param: string | null): Locations {
  if (param == null || !R.keys(locations).includes(param)) {
    throw new Error(`Invalid location: ${param}`);
  }

  return param as Locations;
}
