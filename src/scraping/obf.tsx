import * as R from 'remeda';

import { Location, locations } from '@/scraping/metadata';
import { getFirebaseDocuments } from '@/scraping/firescraper';
import { upsertLocation } from '@/db/location';
import { ExtractedDay } from '@/scraping/types';
import { createEmptyDropinDay } from '@/utils/days';

export async function scrapeTimes(name: Location): Promise<void> {
  const location = locations[name];

  console.info(
    `Scraping ${name}, dropin: ${location.dropin ?? 'true'}, private: ${location.privat ?? 'true'}`,
  );

  console.time(`Scraping ${name}`);
  const [dropinDocuments, privateDocuments] = await Promise.all([
    getFirebaseDocuments(location.dropin),
    location.privat ? await getFirebaseDocuments(location.privat) : Promise.resolve([]),
  ]);
  console.timeEnd(`Scraping ${name}`);

  const dropinDays: ExtractedDay[] = dropinDocuments.map(
    (doc): ExtractedDay => ({
      date: doc.date,
      times: R.pipe(
        doc.slots,
        R.map((slot): [string, number] => [
          decimalTimeToStringTime(slot.time),
          slot.available - slot.booked + slot.cancelled,
        ]),
        (it) => R.fromEntries(it),
        (it) => R.merge(createEmptyDropinDay(locations[name].dropinSlots), it),
      ),
    }),
  );

  const privateDays: ExtractedDay[] = privateDocuments.map(
    (doc): ExtractedDay => ({
      date: doc.date,
      times: R.pipe(
        doc.slots,
        R.map((slot): [string, number] => [
          decimalTimeToStringTime(slot.time),
          slot.available - slot.booked,
        ]),
        R.filter(([, available]) => available > 0),
        (it) => R.fromEntries(it),
      ),
    }),
  );

  console.time('Updating scrape time in db');
  await upsertLocation(name, dropinDays, privateDays);
  console.timeEnd('Updating scrape time in db');
}

function decimalTimeToStringTime(decimalTime: number): string {
  const [hour, minutes] = decimalTime.toFixed(1).split('.');

  return `${hour.padStart(2, '0')}:${minutes === '0' ? '00' : '30'}`;
}
