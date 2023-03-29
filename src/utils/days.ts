import * as R from 'remeda';

import { AvailabilityMap } from '@/scraping/types';

const dropinSlots = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '22:00'];

export const emptyDropinDay: AvailabilityMap = R.pipe(
  dropinSlots,
  R.map((it): [string, number] => [it, 0]),
  (it) => R.fromPairs(it),
);
