import { Notify } from '@/db/schema';
import { Location, validateLocation } from '@/scraping/metadata';
import { toDateString } from '@/utils/date';

export interface NotifyClean {
  location: Location;
  slot: string;
  date: string;
}

export const toCleanNotify = (notify: Notify): NotifyClean => ({
  location: validateLocation(notify.location),
  slot: notify.slot,
  date: toDateString(notify.date),
});
