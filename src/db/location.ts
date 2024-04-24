import * as R from 'remeda';

import db from '@/db/db';
import { AvailabilityMap, ExtractedDay } from '@/scraping/types';
import { Location, validateLocation } from '@/scraping/metadata';
import { unsafeFirst } from '@/utils/R';
import { locations } from '@/db/schema';

export async function upsertLocation(
  name: Location,
  days?: ExtractedDay[],
  privateDays?: ExtractedDay[],
): Promise<void> {
  const now = new Date();
  await db
    .insert(locations)
    .values({
      name,
      dropins_polled_at: days ? now : undefined,
      dropins: days,
      private: privateDays,
      private_polled_at: privateDays ? now : undefined,
    })
    .onConflictDoUpdate({
      target: locations.name,
      set: {
        dropins_polled_at: days ? now : undefined,
        dropins: days,
        private: privateDays,
        private_polled_at: privateDays ? now : undefined,
      },
    });
}

export async function getLocation(name: string) {
  const location = await db.query.locations.findFirst({
    where: (locations, { eq }) => eq(locations.name, name),
  });

  if (location == null) {
    console.warn(`Someone looked up location ${name}, and it was null. That's weird.`);
  }

  return location;
}

export async function nextAvailableLocation(): Promise<
  [where: Location, when: string, slot: string, available: number] | null
> {
  const nothingAvailable = (count: number) => count === 0;
  const dayToEarliestSlot: (map: AvailabilityMap) => [string, number] = R.createPipe(
    R.omitBy(nothingAvailable),
    R.toPairs,
    R.sortBy(R.first),
    unsafeFirst,
  );
  const daysToEarliestDay: (days: ExtractedDay[]) => [string, [string, number]] = R.createPipe(
    R.sortBy(R.prop('date')),
    R.mapToObj((it) => [it.date, it.times]),
    R.mapValues(dayToEarliestSlot),
    R.toPairs.strict,
    R.sortBy(R.first),
    unsafeFirst,
  );
  const byDateAndSlot = ([, [date, [slot]]]: [string, [string, [string, number]]]) =>
    `${date}:${slot}`;

  const locations = await db.query.locations.findMany({
    where: (locations, { isNotNull }) => isNotNull(locations.dropins_polled_at),
  });

  const earliestPossibleDay = R.pipe(
    locations,
    R.mapToObj((it) => [it.name, it.dropins]),
    // @ts-expect-error Need to fix nullability issue
    R.mapValues(daysToEarliestDay),
    R.toPairs.strict,
    (it) => it,
    R.sortBy([byDateAndSlot, 'asc']),
    unsafeFirst,
  );

  if (earliestPossibleDay == null) {
    return null;
  }

  // @ts-expect-error Need to fix nullability issue
  const [where, [when, [slot, available]]] = earliestPossibleDay;
  return [validateLocation(where), when, slot, available];
}
